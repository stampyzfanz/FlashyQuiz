const Quiz = require("./Quiz");
const Logger = require("./Logger");
const CancellablePromise = require("./CancellablePromise");
const quizQuestions = require('./quizQuestions.json');

const express = require("express");
const cors = require("cors");

// to access filesystem
const fs = require("fs").promises;

// to generate secure random numbers for quiz codes
const crypto = require("crypto");


const app = express();
const logger = new Logger("logs.json");

// loads wordList document
const loadWordsPromise = fs.readFile(".\\words.txt");
let wordList = null;

loadWordsPromise.then(data => {
    wordList = Buffer.from(data).toString().split('\n');
}, (err) => console.error('Failed to read wordlist file', err));


// This code is important for security if the software was hosted online
// however, it is not important while it is being tested during development
// const corsOptions = {
//     origin: "http://localhost:8080",
// };
// app.use(cors(corsOptions));

app.use(cors({
    origin: '*'
}));


/*
As recommended at https://news.ycombinator.com/item?id=27015046,
the bitcoin passphrase wordlist was used for this project, 
although all the three letter words that started longer words 
were removed so that it could accurately autocomplete once any word was typed

The wordlist can be found at 
https://github.com/bitcoin/bips/blob/master/bip-0039/bip-0039-wordlists.md

The following creates a route in the API that serves the list of words
*/
app.get("/wordList.json", async (req, res) => {
    await loadWordsPromise;
    console.assert(wordList !== null);
    res.json(wordList);
});

const server = app.listen(process.env.PORT || 3000, () => {
    const host = server.address().address;
    const port = server.address().port;
    console.log(`The server is located at http://${host}:${port}`);
});

// A global enumerable, shared between front end and serve side
const UserType = Object.freeze({
    PARTICIPANT: "Participant",
    QUIZMASTER: "Quizmaster"
});

const io = require('socket.io')(server, {
    // As outlined above, employing CORS is important when hosted in production
    // cors: corsOptions
    cors: {
        origin: '*'
    }
});

// Handles the connection of participants and quiz master sockets
io.on('connection', async (socket) => {
    const userType = await CancellablePromise.socketOnce(socket, "user type");

    if (userType === UserType.PARTICIPANT) {
        // Allows the client to present a quizCode until one is valid
        socket.on("join quiz", function joinQuiz(quizCode, callback) {
            const quiz = quizzes[quizCode];
            // Only allow the client to join a quiz in operation
            if (quiz === undefined || quiz.hasEnded) {
                callback({
                    status: "Invalid",
                    name: null
                });
            } else {
                callback({
                    status: "Success",
                    name: socket.handshake.address
                });
                // Don't let the participant join the quiz again
                socket.off("join quiz", joinQuiz);
                socket.join(quizCode + "--participants");
                console.log("The player has successfully joined");
                if (!quiz.hasStarted) {
                    quiz.addPlayer(socket.handshake.address);
                }
            }
        });
    } else {
        // Handles a quizmaster joining
        await loadWordsPromise;

        // Generate a unique quiz code
        let quizCode;
        do {
            quizCode = randomWord() + "-" + randomWord();
        } while (quizzes.hasOwnProperty(quizCode))

        console.log(quizCode);
        socket.emit("quiz code", quizCode);

        const quiz = new Quiz(quizQuestions["2015-SDD-HSC"], socket, quizCode, io);
        quizzes[quizCode] = quiz;

        // Wait for the quizmaster to start the quiz once everyone has joined
        socket.once("startQuiz", async () => {
            const hasAnyParticipantsJoined = io.sockets.adapter.rooms.get(quizCode + "--participants") !== undefined;
            if (hasAnyParticipantsJoined) {
                // The client-side validation guarantees
                // that at one least participant has joined anyway
                await quiz.start();
            }
            removeQuiz(quizCode);
        });
    }

    // The following two functions log all socket events
    // One reason for doing so is security: if someone attempts
    // to find a vulnerability
    socket.onAnyOutgoing((event, ...args) => {
        logger.log("Outgoing Socket Event", { event, args: args });
    });

    // Note that is not triggered when acknowledgements are sent
    socket.onAny((event, ...args) => {
        logger.log("Incoming Socket Event", { event, args: args });
    });

});

/**
 * Disconnects attached sockets and remove quiz from hashmap
 * @param {String} quizCode 
 */
function removeQuiz(quizCode) {
    io.to(quizCode).disconnectSockets();
    quizzes[quizCode] = undefined;
}

const quizzes = {};

/**
 * Returns a cryptographically secure random word from the wordlist
 * 
 * The choice to use cryptographically secure numbers was based on
 * the recommendation here https://security.stackexchange.com/a/120465
 * Note this function assumes that the wordlist has already been loaded
 * @returns {string} a cryptographically secure random word from the wordlist
 */
function randomWord() {
    return wordList[crypto.randomInt(0, wordList.length)];
}


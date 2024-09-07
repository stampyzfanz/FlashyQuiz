const CancellablePromise = require("./CancellablePromise");

const quizScreens = Object.freeze({
    QUESTION: "QuizQuestion",
    IS_CORRECT_ANSWER: "IsCorrectAnswer",
    ANSWER_OPTIONS_SCREEN: "AnswerOptionsScreen",
    WAIT_FOR_OPTIONS: "WaitForOptions",
    ENDING_SCREEN: "EndingScreen"
    /*
    The following lists screens that could be implemented in the future
    RESULTS: "Results",
    LEADERBOARD: "Leaderboard"
    */
});

class Quiz {
    /**
     * Creates object that stores data for and controls each active quiz
     * @param {Object} questions 
     * @param {Socket} quizMasterSocket 
     * @param {String} quizCode 
     * @param {*} io 
     */
    constructor(questions, quizMasterSocket, quizCode, io) {
        this.questions = questions;
        this.quizMasterSocket = quizMasterSocket;
        this.io = io;
        this.quizCode = quizCode;

        this.hasStarted = false;
        this.hasEnded = false;

        quizMasterSocket.join(quizCode);

        this.questionDuration = 5000;
        this.allowAnswerDuration = 15000;
        this.reflectionDuration = 5000;

        this.isRemoteQuiz = false;
        // isRemoteQuiz is currently hardcoded, but could be changed to allow each player
        // to view the current answer and available options
        // However, before being changed, the feature would however need to be implemented
    }

    /**
     * Starts the quiz and returns a promise that resolves when the quiz ends
     */
    async start() {
        this.hasStarted = true;

        for (const [questionNumber, questionRecord] of this.questions.entries()) {
            const { question, options, correctAnswerIndex } = questionRecord;
            // Ask question
            this.quizMasterSocket.emit(
                "change screen",
                quizScreens.QUESTION,
                { questionNumber, question, questionDuration: this.questionDuration }
            );

            this.io.to(this.quizCode + "--participants").emit(
                "change screen",
                quizScreens.WAIT_FOR_OPTIONS,
                { questionDuration: this.questionDuration, questionNumber });

            // Set data about timings (that could later be extended 
            // to be different for each question)
            this.quizMasterSocket.emit(
                "change screen data",
                "answerDuration",
                this.allowAnswerDuration
            );

            this.quizMasterSocket.emit(
                "change screen data",
                "reflectionDuration",
                this.reflectionDuration
            );

            // Note that the skip command sent from the quizmaster is just a stub: 
            // the client side does not have a functional skip button
            // However, the server side allows it
            await CancellablePromise.race([
                CancellablePromise.socketOnce(this.quizMasterSocket, "skip"),
                CancellablePromise.sleep(this.questionDuration)
            ]);

            // After the reading time, display the options 
            // and allow the participants to answer the questions
            this.quizMasterSocket.emit(
                "change screen data",
                "options",
                options
            );

            this.io.to(this.quizCode + "--participants").emit(
                "change screen",
                quizScreens.ANSWER_OPTIONS_SCREEN,
                { options: ["", "", "", ""], questionNumber }
            );

            // Keep track of each answer provided by each participant
            const socketsLib = this.io.sockets;
            const participantSocketIDs = socketsLib.adapter.rooms.
                get(this.quizCode + "--participants");

            let participantSockets = []
            if (participantSocketIDs === undefined) {
                participantSockets = [];
            } else {
                participantSockets = Array.from(participantSocketIDs)
                    .map(id => socketsLib.sockets.get(id));
            }



            const answerPromises = [];
            for (const socket of participantSockets) {
                const answerPromise = CancellablePromise.socketOnce(socket, "answer");
                answerPromises.push(answerPromise);
            }

            // Wait for the quizmaster to skip, every participant to answer
            // or the time to run out, whichever occurs first
            await CancellablePromise.race([
                CancellablePromise.socketOnce(this.quizMasterSocket, "skip"),
                CancellablePromise.sleep(this.allowAnswerDuration),
                CancellablePromise.all(answerPromises)
            ]);

            // Give feedback to each participant
            for (const [j, participantSocket] of participantSockets.entries()) {
                let isCorrect = false;
                const hasAnswered = answerPromises[j].hasResolved
                if (hasAnswered && await answerPromises[j] === correctAnswerIndex) {
                    isCorrect = true;
                }

                participantSocket.emit(
                    "change screen",
                    quizScreens.IS_CORRECT_ANSWER, { isCorrect }
                );
            }

            this.quizMasterSocket.emit(
                "change screen data",
                "correctAnswerIndex",
                correctAnswerIndex
            );

            await CancellablePromise.race([
                CancellablePromise.socketOnce(this.quizMasterSocket, "skip"),
                CancellablePromise.sleep(this.reflectionDuration)
            ]);
        }

        this.hasEnded = true;

        // a stub
        await this.displayLeaderboard();
    }

    /**
     * Displays the leaderboard
     * Note that this is a stub and opens a temporary static screen
     * @returns A promise that resolves when the leaderboard is closed
     */
    displayLeaderboard() {
        this.quizMasterSocket.emit(
            "change screen",
            quizScreens.ENDING_SCREEN,
            {}
        );

        this.io.to(this.quizCode + "--participants").emit(
            "change screen",
            quizScreens.ENDING_SCREEN,
            {}
        );
        return CancellablePromise.socketOnce(this.quizMasterSocket, "close leaderboard");
    }

    /**
     * Add a new player to the quiz
     * @param {String} name 
     */
    addPlayer(name) {
        this.quizMasterSocket.emit("new player", name);
    }
}

module.exports = Quiz;
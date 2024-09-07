const Logger = require("./Logger");
const CancellablePromise = require("./CancellablePromise");

const logger = new Logger("test-logs.json");

async function createLogs() {
    for (let i = 0; i < 3; i++) {
        await CancellablePromise.sleep(Math.random() * 3000);

        for (let j = 0; j < 300; j++) {
            logger.log(`Test ${i}.${j}: `, Math.floor(Math.random() * 10000));
        }
    }

    console.log('Finished logging');
}

createLogs();

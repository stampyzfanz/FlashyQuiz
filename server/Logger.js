
const fs = require("fs").promises;

class Logger {
    /**
     * Logs relevant data to a sequential json file
     * @param {string} filename 
     */
    constructor(filename) {
        this.filename = filename;

        /**
         * The following attributes are private and reflect whether the file
         * is currently being edited, to ensure it isn't being edited multiple times at once
         */
        this.queue = [];
        this.isLogging = false;
    }

    /**
     * Logs data
     * @param {String} type description of log
     * @param {Object} data the data that is logged
     */
    log(type, data) {
        console.log(type, data);
        this.queue.push({ type, data });

        if (!this.logging) {
            this.updateFile();
        }
    }

    /**
     * Private method that updates the file with all the logs
     */
    updateFile() {
        this.isLogging = true;
        const loadFilePromise = fs.readFile(this.filename);

        // File IO documentation present at
        // https://blog.logrocket.com/reading-writing-json-files-nodejs-complete-tutorial/

        // Wait for the file to load
        loadFilePromise.then(async previousLogsData => {
            const logString = Buffer.from(previousLogsData).toString();
            let logs = JSON.parse(logString);

            // The queue may grow larger while its being written to
            while (this.queue.length > 0) {
                logs = logs.concat(this.queue);
                this.queue = [];

                // While awaiting this function, the queue may grow larger
                try {
                    // pretty print syntax gathered from
                    // https://stackoverflow.com/questions/4810841/pretty-print-json-using-javascript
                    await fs.writeFile(this.filename, JSON.stringify(logs, null, 2));
                } catch (err) {
                    this.log("Write error: ", err);
                    console.error("Write error: ", err)
                }
            }

            this.isLogging = false;

        }, (err) => console.error('Failed to read log file ', err));
    }
}

module.exports = Logger;
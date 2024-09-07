class CancellablePromise {
    /**
     * Sleeps for a given number of milliseconds
     * @param {Number} ms
     * @returns {Promise} a promise that has the cancel method
     */
    static sleep(ms) {
        let timeoutId;
        const sleepPromise = new Promise((resolve, reject) => {
            timeoutId = setTimeout(resolve, ms);
        });
        sleepPromise.cancel = () => clearTimeout(timeoutId);
        return sleepPromise;
    }

    /**
     * Waits for a single response to an event emitted from the server
     * @param {Socket} socket 
     * @param {String} event 
     * @returns {Promise} a promise that has the cancel method
     */
    static socketOnce(socket, event) {
        let socketCallback;

        const socketPromise = new Promise((resolve) => {
            socketCallback = resolve;
            socket.once(event, resolve);
        });
        socketPromise.cancel = () => socket.removeListener(event, socketCallback);

        return socketPromise;
    }

    /**
     * Returns the result of the first promise to resolve or reject, cancelling the rest
     * @param {Promise[]} promises 
     * @returns {Promise<Object>} a non-cancellable promise
     */
    static race(promises) {
        return new Promise((resolve, reject) => {
            /**
             * @type {Promise?}
             */
            let winner = null;

            function cancelPromises() {
                for (const promise of promises) {
                    if (promise !== winner);
                    promise.cancel();
                }
            }

            for (const promise of promises) {
                promise.then(result => {
                    if (winner === null) {
                        winner = promise;
                        resolve(result);
                        cancelPromises();
                    }
                }).catch(result => {
                    if (winner === null) {
                        winner = promise;
                        reject(result);
                        cancelPromises();
                    }
                })
            }
        });
    }

    /**
     * Waits for all of the promises to fulfil
     * 
     * It cancels all the promises that haven't been fulfilled.
     * If any of the promises reject, the function instantly rejects with the error
     * The hasResolved property is added to each of the promises to track 
     * whether it has been resolved yet
     * @param {Promise[]} promises 
     * @returns {Promise<Object>} a cancellable promise that resolves to an 
     * array of the results of each of the promises
     */
    static all(promises) {
        const allResolvedPromise = new Promise((resolve, reject) => {

            for (const promise of promises) {
                promise.hasResolved = false;

                promise.then(() => {
                    promise.hasResolved = true;
                }).catch(error => {
                    // Exit early if any of the promises reject
                    reject(error);
                });
            }

            Promise.all(promises).then(results => {
                resolve(results);
            });
        });

        // If this method is cancelled, cancel each of the promises
        // that has been been resolved
        allResolvedPromise.cancel = () => {
            for (promise of promises) {
                if (promise.hasResolved === false) {
                    promise.cancel();
                }
            }
        }

        return allResolvedPromise;
    }
}

module.exports = CancellablePromise
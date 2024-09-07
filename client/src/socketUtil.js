import io from 'socket.io-client';

/**
 * A utility class that controls the web socket connnection to the server
 */
class socketUtil {
    constructor(options) {
        this.socket = null;
        this.options = options;

        /**
         * Nested class that is a custom error message for if the web sockets time out
         */
        class TimeoutError extends Error {
            constructor(message = 'Operation timed out') {
                super(message);
                this.name = 'TimeoutError';
            }
        }

        this.TimeoutError = TimeoutError;
    }

    /**
     * @return {Boolean} Whether or not this class currently has a socket
     *  and is connected to the server
     */
    get isConnected() {
        return this.socket !== null;
    }

    /**
     * Connects to the web socket on the server
     */
    connect() {
        this.socket = io(this.options.url);
    }

    /**
     * Emulates normal API call using web sockets, by sending request and returning response
     * Note that it times out after 5 seconds
     * @param  {...any} args the arguments to pass over web sockets
     * @returns {Promise<Object>} either the response as an object or an error
     */
    response(...args) {
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                reject(new this.TimeoutError());
            }, 5000);

            this.socket.emit(...args, (socketResponse) => {
                clearInterval(timeoutId);
                resolve(socketResponse);
            });
        });
    }


    /**
     * Waits for a single response to an event emited from the server
     * @param {String} event
     * @returns {Promise} a promise that has the cancel method
     */
    oncePromise(event) {
        let socketCallback;

        const socketPromise = new Promise((resolve) => {
            socketCallback = resolve;
            this.socket.once(event, resolve);
        });
        socketPromise.cancel = () => this.socket.removeListener(event, socketCallback);

        return socketPromise;
    }
}

/**
 * Outputs correct plugin format for Vue to install, 
 * which sets socketUtil as a singleton
 */
const socketUtilPlugin = {
    install(app, options) {
        app.config.globalProperties.$socketUtil = new socketUtil(options);
    }
};

export default socketUtilPlugin;
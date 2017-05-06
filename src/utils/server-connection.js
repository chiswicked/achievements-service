/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

/**
 * Cached server connection
 * @private
 */

let cachedConnection = null;

/**
 * Returns cached server connection
 *
 * @return {Server}
 * @public
 */

const connection = () => cachedConnection;

/**
 * Establishes server connection and listens on given port
 *
 * @param {Server} server
 * @param {Number} port
 * @return {Promise}
 * @public
 */

const connect = (server, port) =>
  new Promise((success, failure) => {
    server
      .listen(port, (err) => {
        if (!err) {
          cachedConnection = server;
          success(server);
        } else {
          failure(err);
        }
      })
      .on('error', (err) => {
        failure(err);
      });
  });

/**
 * Closes the server connection and clears cache
 * @public
 */

const disconnect = () => {
  cachedConnection.close();
  cachedConnection = null;
};

/**
 * Expose public methods:
 * `connect(server, port)`
 * `connection()`
 * `disconnect()`
 * @public
 */

module.exports = {
  connect,
  connection,
  disconnect,
};

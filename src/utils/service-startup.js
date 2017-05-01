/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * MIT Licensed
 */

/**
 * Module dependencies.
 * @private
 */

const dbConnectionManager = require('./db-connection');
const serverConnectionManager = require('./server-connection');

/**
 * Cached server connections
 * @private
 */

let dbConnection = null;
let serverConnection = null;

/**
 * Returns cached server connections
 *
 * @return {Object}
 * @public
 */

const connection = {
  db: () => dbConnection,
  server: () => serverConnection,
};

/**
 * Establishes database and server connections
 *
 * @param {MongoClient} client
 * @param {string} url
 * @param {Server} server
 * @param {Number} port
 * @return {Promise}
 * @public
 */

const connect = (client, url, server, port) =>
  dbConnectionManager.connect(client, url)
    .then((dbConnected) => {
      dbConnection = dbConnected;
      return serverConnectionManager.connect(server, port);
    })
    .then((serverConnected) => {
      serverConnection = serverConnected;
      return Promise.resolve({ db: dbConnection, server: serverConnection });
    });

/**
 * Closes the databse and server connections and clears cache
 * @public
 */

const disconnect = () => {
  dbConnection.close();
  dbConnection = null;
  serverConnection.close();
  serverConnection = null;
};

/**
 * Expose public methods and properties:
 * `connect(server, port)`
 * `connection`
 * `disconnect()`
 * @public
 */

module.exports = {
  connect,
  connection,
  disconnect,
};

/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

/**
 * Cached database connection
 * @private
 */

let cachedConnection = null;

/**
 * Returns cached database connection
 *
 * @return {any}
 * @public
 */

const connection = () => cachedConnection;

const collection = name =>
  (cachedConnection ? cachedConnection.collection(name) : undefined);

/**
 * Establishes server connection and listens on given port
 *
 * @param {MongoClient} client
 * @param {string} url
 * @return {Promise}
 * @public
 */

const connect = (client, url) =>
  new Promise((success, failure) => {
    client.connect(url, (err, db) => {
      if (err) {
        failure(err);
      } else {
        cachedConnection = db;
        success(cachedConnection);
      }
    });
  });

/**
 * Closes the database connection and clears cache
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
  collection,
  disconnect,
};

/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

/**
 * Module dependencies.
 * @private
 */

const events = require('../controllers/events');
const db = require('./db-connection');
const server = require('./server-connection');

/**
 * Service startup prototype.
 */

const service = exports = module.exports = {};

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

service.start = (client, url, app, port) =>
  // Connect to database
  db.connect(client, url)
    // Cache event objects
    .then(connection =>
      events.cache.init(events, connection.collection('events')))
    // Start HTTP server
    .then(() =>
      server.connect(app, port));

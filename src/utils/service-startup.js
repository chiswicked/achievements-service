/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

/**
 * Module dependencies.
 * @private
 */

const achievements = require('../controllers/achievements');
const db = require('./db-connection');
const events = require('../controllers/events');
const server = require('./server-connection');

/**
 * Service startup utils prototype.
 * @private
 */

const service = exports = module.exports = {};

/**
 * Establishes database and server connections and initializes cache
 *
 * @param {MongoClient} client
 * @param {string} url
 * @param {Server} server
 * @param {Number} port
 * @return {Promise}
 * @public
 */

service.start = (client, url, app, port) =>
  db.connect(client, url)
    .then(connection => events.cache.init(events, connection.collection('events'))
      .then(() => achievements.cache.init(achievements, connection.collection('achievements'))))
    .then(() => server.connect(app, port));

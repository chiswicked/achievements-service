/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

/**
 * Module dependencies
 * @private
 */

const MongoClient = require('mongodb').MongoClient;

const app = require('./app');
const generateTransports = require('./utils/logger').generateTransports;
const log = require('./utils/logger')(generateTransports('development'));
const serviceStartup = require('./utils/service-startup');

/**
 * Start up the Achivements Service
 * - Establish database connection
 * - Start RESTful API server
 */

if (require.main === module) {
  serviceStartup.connect(MongoClient, 'mongodb://localhost:27017/test', app.create(), 8888)
    .then(() => {
      log.info('Achievements Service starting :', { port: 8888 });
    })
    .catch((error) => {
      log.error(`${error}`);
    });
}

/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * MIT Licensed
 */

const MongoClient = require('mongodb').MongoClient;

const app = require('./app');
const generateTransports = require('./utils/logger').generateTransports;
const log = require('./utils/logger')(generateTransports('development'));
const serviceStartup = require('./utils/service-startup');

if (require.main === module) {
  serviceStartup.connect(MongoClient, 'mongodb://localhost:27017/test', app, 8888)
    .then(() => {
      log.info('Achievements Service starting :', { port: 8888 });
    })
    .catch((error) => {
      log.error(`${error}`);
    });
}

const MongoClient = require('mongodb').MongoClient;

const app = require('./app');
const serviceStartup = require('./utils/service-startup');

if (require.main === module) {
  serviceStartup.connect(MongoClient, 'mongodb://localhost:27017/test', app, 8888)
    .then(() => {
      console.log('Listening on port 8888');
    })
    .catch((error) => {
      console.error(`${error}`);
    });
}

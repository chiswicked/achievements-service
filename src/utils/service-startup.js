const dbConnectionManager = require('./db-connection');
const serverConnectionManager = require('./server-connection');

let dbConnection = null;
let serverConnection = null;

const connection = {
  db: () => dbConnection,
  server: () => serverConnection,
};

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

const disconnect = () => {
  dbConnection.close();
  dbConnection = null;
  serverConnection.close();
  serverConnection = null;
};

module.exports = {
  connect,
  connection,
  disconnect,
};

let cachedConnection = null;

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

const connection = () => cachedConnection;

const disconnect = () => {
  cachedConnection.close();
  cachedConnection = null;
};

module.exports = {
  connect,
  connection,
  disconnect,
};

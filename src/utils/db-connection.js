let cachedConnection = null;

const connection = () => cachedConnection;

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

const disconnect = () => {
  cachedConnection.close();
  cachedConnection = null;
};

module.exports = {
  connect,
  connection,
  disconnect,
};

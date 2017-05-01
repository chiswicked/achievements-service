let cachedConnection = null;
const connection = () => cachedConnection;

const connect = (server, port) =>
  new Promise((success, failure) => {
    server
      .listen(port, (err) => {
        if (!err) {
          cachedConnection = server;
          success(server);
        } else {
          failure(err);
        }
      })
      .on('error', (err) => {
        failure(err);
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

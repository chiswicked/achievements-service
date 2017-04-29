let cachedConnection = null;

const connect = (server, port) =>
  new Promise((success, failure) => {
    server.listen(port, (err) => {
      if (!err) {
        cachedConnection = server;
        success(server);
      } else {
        failure(err);
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

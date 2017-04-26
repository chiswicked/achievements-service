const express = require('express');

const logger = require('./utils/logger');

const app = express();

app.get('/', (req, res) => {
  logger.log('debug', 'GET /');
  res.send('Achievements Service');
});

app.listen(8888);

logger.log('info', 'Achievements Service starting :', { port: 8888 });

module.exports = app;

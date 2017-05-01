const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Achievements Service');
});

module.exports = app;

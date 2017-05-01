/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * MIT Licensed
 */

const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Achievements Service');
});

module.exports = app;

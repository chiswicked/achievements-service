const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('Achievements Service');
});

app.listen(8888);

module.exports = app;

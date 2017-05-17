/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

/**
 * Module dependencies
 * @private
 */

const bodyParser = require('body-parser');
const express = require('express');

const routes = require('./routes/');

/**
 * HTTP server factory
 * @return {Server}
 * @public
 */

module.exports.create = () => {
  const app = express();

  app.use(bodyParser.json());

  /**
   * Route definitions
   * @private
   */

  app.get('/', routes.root);

  app.post('/achievements', routes.achievements.create);
  app.get('/achievements', routes.achievements.readAll);

  app.post('/events', routes.events.create);
  app.get('/events/:id', routes.events.read);
  app.get('/events', routes.events.readAll);
  app.patch('/events/:id', routes.events.update);
  app.delete('/events/:id', routes.events.delete);

  app.post('/events/:id/emit', routes.events.emit);

  app.post('/users', routes.users.create);
  app.get('/users/:id', routes.users.read);
  app.get('/users', routes.users.readAll);
  app.delete('/users/:id', routes.users.delete);

  app.get('/users/:id/achievements/:achievement', routes.users.achievements.read);
  app.get('/users/:id/achievements', routes.users.achievements.readAll);

  app.all('/events/*', (req, res) => {
    res.sendStatus(400);
  });

  return app;
};

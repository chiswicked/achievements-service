/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

/**
 * Module dependencies
 * @private
 */

const db = require('../utils/db-connection');
const events = require('../controllers/events');
const response = require('../utils/response');

/**
 * Events route prototype.
 * @private
 */

const route = exports = module.exports = {};

/**
 * Handles the validation and creation of a new event object
 * Sends appropriate success or error response back to the client
 *
 * @param {Object} req
 * @param {Object} res
 */

route.create = (req, res) => {
  events.getObjectToCreateFromRequest(req)
    .then(obj => events.create(db.collection('events'), obj))
    .then(() => { res.sendStatus(204); })
    .catch((err) => { res.send(response.error(err)); });
};

/**
 * Handles the validation and retirieval of a single event object
 * Sends appropriate success or error response back to the client
 *
 * @param {Object} req
 * @param {Object} res
 */

route.read = (req, res) => {
  events.getIdFromRequestURI(req)
    .then(id => events.read(db.collection('events'), id))
    .then((data) => { res.send(response.success(data)); })
    .catch((err) => { res.send(response.error(err)); });
};

/**
 * Handles the validation and retirieval of all event objects
 * Sends appropriate success or error response back to the client
 *
 * @param {Object} req
 * @param {Object} res
 */

route.readAll = (req, res) => {
  events.readAll(db.collection('events'))
    .then((data) => { res.send(response.success(data)); })
    .catch((err) => { res.send(response.error(err)); });
};

/**
 * Handles the validation and uptating of the given event object
 * Sends appropriate success or error response back to the client
 *
 * @param {Object} req
 * @param {Object} res
 */

route.update = (req, res) => {
  events.getObjectToUpdateFromRequest(req)
    .then(obj => events.update(db.collection('events'), obj))
    .then(() => { res.sendStatus(204); })
    .catch((err) => { res.send(response.error(err)); });
};

/**
 * Handles the validation and deletion of the given event object
 * Sends appropriate success or error response back to the client
 *
 * @param {Object} req
 * @param {Object} res
 */

route.delete = (req, res) => {
  events.getIdFromRequestURI(req)
    .then(id => events.delete(db.collection('events'), id))
    .then(() => { res.sendStatus(204); })
    .catch((err) => { res.send(response.error(err)); });
};

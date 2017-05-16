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
const response = require('../utils/response');
const users = require('../controllers/users');

/**
 * Users route prototype.
 * @private
 */

const route = exports = module.exports = {};

/**
 * Handles the validation and creation of a new user object
 * Sends appropriate success or error response back to the client
 *
 * @param {Object} req
 * @param {Object} res
 */

route.create = (req, res) => {
  users.getObjectToCreateFromRequest(req)
    .then(obj => users.create(db.collection('users'), obj))
    .then(() => { res.sendStatus(204); })
    .catch((err) => { res.send(response.error(err)); });
};

/**
 * Handles the validation and retirieval of a single user object
 * Sends appropriate success or error response back to the client
 *
 * @param {Object} req
 * @param {Object} res
 */

route.read = (req, res) => {
  users.getIdFromRequestURI(req)
    .then(id => users.read(db.collection('users'), id))
    .then((data) => { res.send(response.success(data)); })
    .catch((err) => { res.send(response.error(err)); });
};

/**
 * Handles the validation and retirieval of all user objects
 * Sends appropriate success or error response back to the client
 *
 * @param {Object} req
 * @param {Object} res
 */

route.readAll = (req, res) => {
  users.readAll(db.collection('users'))
    .then((data) => { res.send(response.success(data)); })
    .catch((err) => { res.send(response.error(err)); });
};

/**
 * Handles the validation and deletion of the given user object
 * Sends appropriate success or error response back to the client
 *
 * @param {Object} req
 * @param {Object} res
 */

route.delete = (req, res) => {
  users.getIdFromRequestURI(req)
    .then(id => users.delete(db.collection('users'), id))
    .then(() => { res.sendStatus(204); })
    .catch((err) => { res.send(response.error(err)); });
};

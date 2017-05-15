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
const achievements = require('../controllers/achievements');
const response = require('../utils/response');

/**
 * Achivements route prototype.
 * @private
 */

const route = exports = module.exports = {};

/**
 * Handles the validation, creation and chaching of a new achivement object
 * Sends appropriate success or error response back to the client
 *
 * @param {Object} req
 * @param {Object} res
 */

route.create = (req, res) => {
  let o;
  achievements.getObjectToCreateFromRequest(req)
    .then((obj) => {
      o = obj;
      return achievements.create(db.collection('achievements'), obj);
    })
    .then(() => {
      achievements.cache.push(o);
      res.sendStatus(204);
    })
    .catch((err) => {
      res.send(response.error(err));
    });
};

/**
 * Handles the validation and retirieval of all achivement objects
 * Sends appropriate success or error response back to the client
 *
 * @param {Object} req
 * @param {Object} res
 */

route.readAll = (req, res) => {
  achievements.readAll(db.collection('achievements'))
    .then((data) => { res.send(response.success(data)); })
    .catch((err) => { res.send(response.error(err)); });
};

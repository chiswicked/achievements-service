/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

/**
 * Module dependencies
 * @private
 */

const _ = require('lodash');
const achievements = require('../controllers/achievements');
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

route.achievements = {};

route.achievements.read = (req, res) => {
  users.getIdFromRequestURI(req)
    .then(id => users.delete(db.collection('users'), id))
    .then(() => { res.sendStatus(204); })
    .catch((err) => { res.send(response.error(err)); });
};

route.achievements.readAll = (req, res) => {
  const ret = [];
  users.getIdFromRequestURI(req)
    .then(id => users.read(db.collection('users'), id))
    .then((user) => {
      _.forEach(achievements.cache.get(), (achievement) => {
        const obj = {
          name: achievement.name,
          visual: achievement.visual,
          description: achievement.description,
          completed: false,
          percentage: 0,
        };
        const userAchievement = _.find(user.achievements, { id: achievement._id });

        if (userAchievement) {
          const sumProgress = _.sumBy(userAchievement.completion, 'progress');
          const sumTarget = _.sumBy(userAchievement.completion, 'target');
          obj.completed = (sumProgress === sumTarget);
          obj.percentage = _.round((sumProgress / sumTarget) * 100, 2);
        }

        ret.push(obj);
      });
    })
    .then(() => { res.send(ret); })
    .catch((err) => { res.send(response.error(err)); });
};

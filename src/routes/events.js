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
const events = require('../controllers/events');
const response = require('../utils/response');
const users = require('../controllers/users');

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

/**
 * Handles the validation and deletion of the given event object
 * Sends appropriate success or error response back to the client
 *
 * @param {Object} req
 * @param {Object} res
 */

route.emit = (req, res) => {
  let trigger;
  let triggeredAchievements;
  events.getIdFromRequestURI(req)
    .then((id) => {
      trigger = id;
      return events.isRegisteredEvent(events.cache, id);
    })
    .then(() => events.getUserIdAndProgressFromRequest(req))
    .then((evnt) => {
      triggeredAchievements =
        achievements.getTriggeredAchievementsFromCache(achievements.cache, trigger, evnt.progress);
      return users.read(db.collection('users'), evnt.userId);
    })
    .then((user) => {
      const newUser = {};
      newUser.id = user.id;
      newUser.achievements = [];
      _.forEach(triggeredAchievements, (triggeredAchievement) => {
        const userAchievement = _.find(user.achievements, { id: triggeredAchievement._id });
        const cachedAchievement = _.find(achievements.cache.get(), { _id: triggeredAchievement._id });

        const newAchievement = {};
        newAchievement._id = triggeredAchievement._id;
        newAchievement.completion = [];
        _.forEach(cachedAchievement.completion, (cachedCompletion) => {
          const newCompletion = {
            id: cachedCompletion.id,
            target: cachedCompletion.multiplier,
            progress: 0,
          };
          const triggeredCompletion = _.find(triggeredAchievement.completion, { id: cachedCompletion.id });

          if (triggeredCompletion) {
            // it's the triggered completion
            if (userAchievement) {
              // it's an existing one -> increase
              const userCompletion = _.find(userAchievement.completion, { id: triggeredCompletion.id });
              const userProgress = _.get(userCompletion, 'progress') || 0;
              newCompletion.progress = Math.min(triggeredCompletion.progress + userProgress, cachedCompletion.multiplier);
            } else {
              // it's a new one -> increase
              newCompletion.progress = Math.min(triggeredCompletion.progress, cachedCompletion.multiplier);
            }
          } else if (userAchievement) {
            // it's an existing one -> set to what is on record
            const userCompletion = _.find(userAchievement.completion, { id: cachedCompletion.id });
            const userProgress = _.get(userCompletion, 'progress') || 0;
            newCompletion.progress = userProgress;
          }
          newAchievement.completion.push(newCompletion);
        });
        newUser.achievements.push(newAchievement);
      });
      res.send(response.success(newUser));
    })
    .catch((err) => { res.send(response.error(err)); });
};

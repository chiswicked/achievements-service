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
const Cache = require('../../src/utils/cache').Cache;

/**
 * Achievements controller prototype.
 */

const controller = exports = module.exports = {};

/**
 * Achievement cache, holds achivement instances in memory
 * Thus no databse lookup is needed when a client triggers an event
 * @public
 */

controller.cache = new Cache();

/**
 * Creates an achievement if one with the supplied `obj.id` does not exist yet
 *
 * @param {Collection} collection
 * @param {Object} obj Expects `obj.id` and `obj.description` fields
 * @return {Promise}
 * @public
 */

controller.create = (collection, obja) =>
  new Promise((success, failure) => {
    if (!obja) failure('Invalid arguments');
    collection.insertOne(obja, (err, result) => {
      if (err) failure(err);
      success(result);
    });
  });

/**
 * Returns all achievements
 *
 * @param {Collection} collection
 * @return {Promise}
 * @public
 */

controller.readAll = collection =>
  new Promise((success, failure) => {
    collection.find({}).toArray((err, result) => {
      if (err) failure(err);
      success(result);
    });
  });

/**
 * Extracts achievement fields from request paremeters and returns them as an object
 *
 * @return {Object}
 * @public
 */

controller.getObjectToCreateFromRequest = req =>
  new Promise((success, failure) => {
    const name = _.get(req, 'body.name', undefined);
    const organisation = _.get(req, 'body.organisation', undefined);
    const visual = _.get(req, 'body.visual', undefined);
    const description = _.get(req, 'body.description', undefined);
    const completion = _.get(req, 'body.completion', undefined);
    const conditions = _.get(req, 'body.conditions', undefined);
    const rewards = _.get(req, 'body.rewards', undefined);
    if (!name || !organisation || !visual || !description || !completion || !conditions || !rewards) failure('Invalid arguments');
    const obj = {
      name,
      organisation,
      visual,
      description,
      completion,
      conditions,
      rewards,
    };
    success(obj);
  });

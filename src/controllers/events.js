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
const Cache = require('../utils/cache').Cache;

/**
 * Events controller prototype.
 * @private
 */

const controller = exports = module.exports = {};

/**
 * Event cache, holds event instances in memory
 * Thus no databse lookup is needed when a client triggers an event
 * @public
 */

controller.cache = new Cache();

/**
 * Creates an event if one with the supplied `obj.id` does not exist yet
 *
 * @param {Collection} collection
 * @param {Object} obj Expects `obj.id` and `obj.description` fields
 * @return {Promise}
 * @public
 */

controller.create = (collection, obj) =>
  new Promise((success, failure) => {
    if (!obj) failure('Invalid arguments');
    collection.insertOne(obj, (err, result) => {
      if (err) failure(err);
      success(result);
    });
  });

/**
 * Returns the event matching the supplied `id`
 *
 * @param {Collection} collection
 * @param {string} id
 * @return {Promise}
 * @public
 */

controller.read = (collection, id) =>
  new Promise((success, failure) => {
    if (!id) failure('Invalid arguments');
    collection.findOne({ id }, { _id: 0 }, (err, result) => {
      if (err) failure(err);
      if (!result) failure('Not found');
      success(result);
    });
  });

/**
 * Returns all events
 *
 * @param {Collection} collection
 * @return {Promise}
 * @public
 */

controller.readAll = collection =>
  new Promise((success, failure) => {
    collection.find({}, { _id: 0 }).toArray((err, result) => {
      if (err) failure(err);
      success(result);
    });
  });

/**
 * Updates the event description of the event matching the supplied `obj.id`
 *
 * @param {Collection} collection
 * @param {Object} obj Expects `obj.id` and `obj.description` fields
 * @return {Promise}
 * @public
 */

controller.update = (collection, obj) =>
  new Promise((success, failure) => {
    if (!obj || !obj.id || !obj.description) failure('Invalid arguments');
    collection.findOneAndUpdate(
      { id: obj.id },
      { $set: { description: obj.description } },
      { projection: { _id: 0 } },
      (err, result) => {
        if (err) failure(err);
        if (result.matchedCount === 0) failure('Not found');
        success(result);
      });
  });

/**
 * Deletes the event matching the supplied `id`
 *
 * @param {Collection} collection
 * @param {string} id
 * @return {Promise}
 * @public
 */

controller.delete = (collection, id) =>
  new Promise((success, failure) => {
    if (!id) failure('Invalid arguments');
    collection.deleteOne({ id }, (err, result) => {
      if (err) failure(err);
      if (result.deletedCount === 0) failure('Not found');
      success(result);
    });
  });

/**
 * Extracts `id` from request parameters
 *
 * @param {Object} req
 * @return {Promise}
 * @public
 */

controller.getIdFromRequestURI = req =>
  new Promise((success, failure) => {
    const id = _.get(req, 'params.id', undefined);
    if (!id) failure('Invalid arguments');
    success(id);
  });

/**
 * Extracts `progress` from request body
 *
 * @param {Object} req
 * @return {Promise}
 * @public
 */

controller.getProgressFromRequest = req =>
  new Promise((success, failure) => {
    const progress = _.get(req, 'body.progress', undefined);
    if (!progress || !_.isInteger(progress) || progress < 1) failure('Invalid arguments');
    success(progress);
  });

/**
 * Extracts `id` and `description` from request body
 *
 * @param {Object} req
 * @return {Promise}
 * @public
 */

controller.getObjectToCreateFromRequest = req =>
  new Promise((success, failure) => {
    const id = _.get(req, 'body.id', undefined);
    const description = _.get(req, 'body.description', undefined);
    if (!id || !description) failure('Invalid arguments');
    success({ id, description });
  });

/**
 * Extracts `id` from request paremeters and `description` from request body
 *
 * @param {Object} req
 * @return {Promise}
 * @public
 */

controller.getObjectToUpdateFromRequest = req =>
  new Promise((success, failure) => {
    const id = _.get(req, 'params.id', undefined);
    const description = _.get(req, 'body.description', undefined);
    if (!id || !description) failure('Invalid arguments');
    success({ id, description });
  });

/**
 * Returns whether or not the an event with the supplied id exists
 *
 * @return {Promise}
 * @public
 */

controller.isRegisteredEvent = (cache, id) =>
  new Promise((success, failure) => {
    if (_.filter(cache.get(), event => event.id === id).length === 0) {
      failure(`Invalid event id: ${id}`);
    }
    success();
  });

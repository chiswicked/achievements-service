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

/**
 * Users controller prototype.
 * @private
 */

const controller = exports = module.exports = {};

/**
 * Creates a user if one with the supplied `obj.id` does not exist yet
 *
 * @param {Collection} collection
 * @param {Object} obj Expects `obj.id`
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
 * Returns the user matching the supplied `id`
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
 * Returns all users
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
 * Deletes the user matching the supplied `id`
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
 * Extracts `id` from request body
 *
 * @param {Object} req
 * @return {Promise}
 * @public
 */

controller.getObjectToCreateFromRequest = req =>
  new Promise((success, failure) => {
    const id = _.get(req, 'body.id', undefined);
    if (!id) failure('Invalid arguments');
    success({ id });
  });

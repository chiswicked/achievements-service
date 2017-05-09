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
 * Runs validation based on supplied predicate
 * Sets error message and error code if validation fails
 *
 * @param {Function} method Validation method
 * @param {string} message Error code to be set if validation fails
 * @param {Number} code Error code to be set if validation fails
 * @return {Promise}
 * @public
 */

const validator = (method, message, code) => {
  const valid = (...args) => method.apply(method, args);
  if (_.isString(message)) valid.message = message;
  if (_.isInteger(code)) valid.code = code;
  return valid;
};

/**
 * Chains validators to validate compound criteria
 * Returns array of errors if any validator evaluates false
 * Returns empty array if every validator passes
 *
 * @param {...} args Validators to be executed in sequence
 * @return {Array} Array of error messages and codes
 * @public
 */

const validationChain = (...args) => {
  const validators = _.toArray(args);
  return something => _.reduce(validators, (errors, checkerFunction) => {
    if (checkerFunction(something)) return errors;
    return _.chain(errors).push({
      code: checkerFunction.code,
      message: checkerFunction.message,
    }).value();
  }, []);
};

/**
 * Expose public methods
 * @public
 */

module.exports = {
  validator,
  validationChain,
};

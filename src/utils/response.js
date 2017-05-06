/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

/**
 * Returns `data` wrapped in standard JSON response format
 * Returned object can be sent as payload to successful requests
 *
 * @param {string|Object} data
 * @return {Object}
 * @public
 */

module.exports.success = data => ({
  success: true,
  data,
});

/**
 * Returns `err` wrapped in standard JSON response format
 * Returned object can be sent as payload to unsuccessful requests
 *
 * @param {string|Object} data
 * @return {Object}
 * @public
 */

module.exports.error = err => ({
  success: false,
  error: err,
});

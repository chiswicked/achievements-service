/*!
 * Achievements Service
 * Copyright(c) 2017 Norbert Metz
 * ISC Licensed
 */

/**
 * Module dependencies.
 * @private
 */

const winston = require('winston');
const fs = require('fs');

/**
 * Basic config
 * @private
 */

const LOG_DIR = `${process.env.NODE_PATH || '.'}/log`;

/**
 * Debug level logging to console output
 * @private
 */

const debugConsole = new (winston.transports.Console)({
  name: 'debug-console',
  colorize: true,
  timestamp: true,
  level: 'debug',
});

/**
 * Info level logging into a file
 * @private
 */

const infoFile = new (winston.transports.File)({
  name: 'info-file',
  filename: `${LOG_DIR}/filelog-info.log`,
  timestamp: true,
  level: 'info',
});

/**
 * Error level logging into a file
 * @private
 */

const errorFile = new (winston.transports.File)({
  name: 'error-file',
  filename: `${LOG_DIR}/filelog-error.log`,
  timestamp: true,
  level: 'error',
});

/**
 * Transport templates for development, test and production
 * Additional template for logging turned off
 * @private
 */

const transportTemplates = [{
  mode: 'development',
  transports: [
    debugConsole,
    infoFile,
    errorFile,
  ],
}, {
  mode: 'test',
  transports: [],
}, {
  mode: 'production',
  transports: [
    infoFile,
    errorFile,
  ],
}, {
  mode: 'off',
  transports: [],
}];

/**
 * Returns an array of Winston Transports based on mode
 *
 * @param {string} mode [`development`|`test`|`production`|`off`]
 * @return {Array}
 * @public
 */

const generateTransports = (mode) => {
  const trns = transportTemplates.filter(trn => trn.mode === mode).pop();
  return (trns) ? trns.transports : [];
};

/**
 * Returns a Winston logger instance with given Array of Winston Transports
 * Ignores invalid Transports
 *
 * @param {Array} transports Array of Winston Transports
 * @return {winston.Logger} Logger instance
 * @public
 */

const createLogger = (transports) => {
  let result = [];

  // Remove invalid Transport instances from supplied array
  if (transports instanceof Array) {
    result = transports.filter(transport =>
      transport instanceof winston.Transport);
  }

  // Create log directory if does not exist yet
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
  }

  return new (winston.Logger)({
    transports: result,
  });
};

/**
 * Expose logger factory method
 * @public
 */

module.exports = createLogger;
exports = module.exports;

/**
 * Expose `generateTransports(mode)` helper method
 * @public
 */

exports.generateTransports = generateTransports;

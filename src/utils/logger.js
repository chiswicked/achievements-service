/**
 * Module dependencies.
 */

const winston = require('winston');

/**
 * Debug level logging to console output
 */

const debugConsole = new (winston.transports.Console)({
  name: 'debug-console',
  colorize: true,
  timestamp: true,
  level: 'debug',
});

/**
 * Info level logging into a file
 */

const infoFile = new (winston.transports.File)({
  name: 'info-file',
  filename: './log/filelog-info.log',
  timestamp: true,
  level: 'info',
});

/**
 * Error level logging into a file
 */

const errorFile = new (winston.transports.File)({
  name: 'error-file',
  filename: './log/filelog-error.log',
  timestamp: true,
  level: 'error',
});

/**
 * Transport templates for development, test and production
 * Additional template for logging turned off
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
 * @param {string} mode `development`, `test`, `production` or `off`
 * @return {Array} Array of Winston Transports
 * @api public
 */

const generateTransports = (mode) => {
  const trns = transportTemplates.filter(trn => trn.mode === mode).pop();
  return (trns) ? trns.transports : [];
};

/**
 * Returns a Winston logger instance with given Array of Winston Transports
 * Ignores invalid Transports
 *
 * @param {*} transports Array of Winston Transports
 * @return {winston.Logger} Logger instance
 * @api public
 */

const createLogger = (transports) => {
  let result = [];

  if (transports instanceof Array) {
    result = transports.filter(transport =>
      transport instanceof winston.Transport);
  }

  return new (winston.Logger)({
    transports: result,
  });
};

/**
 * Expose logger factory method
 */

module.exports = createLogger;
exports = module.exports;

/**
 * Expose `generateTransports(mode)` helper method
 */

exports.generateTransports = generateTransports;

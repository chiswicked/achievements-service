const winston = require('winston');

module.exports = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({
      colorize: true,
      timestamp: true,
      level: 'debug',
    }),
    new (winston.transports.File)({
      name: 'info-file',
      filename: './log/filelog-info.log',
      timestamp: true,
      level: 'info',
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: './log/filelog-error.log',
      timestamp: true,
      level: 'error',
    }),
  ],
});

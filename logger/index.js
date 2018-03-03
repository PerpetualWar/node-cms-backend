const winston = require('winston');

//logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({
      filename: './logger/error.log',
      level: 'error',
      handleExceptions: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false,
      timestamp: true
    }),
    new winston.transports.File({
      filename: './logger/combined.log',
      handleExceptions: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false,
      timestamp: true
    })
  ],
  exitOnError: false
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
    level: 'debug',
    handleExceptions: true,
    colorize: true
  }));
}

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding){
      logger.info(message);
  }
};
const winston = require('winston');
const { format } = require('logform');

const alignedWithColorsAndTime = format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);
//con colores winston.format.cli()
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'silly',
    format: alignedWithColorsAndTime,
    transports: [new winston.transports.Console()],
});

module.exports = {
    logger
};


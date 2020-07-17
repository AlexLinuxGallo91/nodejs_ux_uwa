const {createLogger, format, transports} = require('winston');
const constantesLogger = require('./constantesLogger');

module.exports = createLogger({
    format: format.combine(
        format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)),
    transports: [
        new transports.File({
            maxsize: 5120000,
            maxFiles: 5,
            filename: `${constantesLogger.DIR_PATH_LOGS}${constantesLogger.NOMBRE_LOG}`,
            level: 'info'
        })
    ]
});
// utils/logger.js
const log = require('node-file-logger');

// Configure logger options
const options = {
    timeZone: 'Asia/Kolkata',
    folderPath: './logs/',
    dateBasedFileNaming: true,
    fileName: 'All_Logs',
    fileNamePrefix: 'Logs_',
    fileNameSuffix: '',
    fileNameExtension: '.log',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm:ss.SSS',
    logLevel: 'debug',
    onlyFileLogging: true
};

log.SetUserOptions(options);

// Utility functions
const info = (message, context = 'General', method = 'N/A') => {
    log.Info(message, context, method);
};

const ServerError = (message, context = 'General', method = 'N/A') => {
    log.Error(message, context, method);
};

const warn = (message, context = 'General', method = 'N/A') => {
    log.Warn(message, context, method);
};

module.exports = {
    info,
    ServerError,
    warn
};

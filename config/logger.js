const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create a write stream for logging
const accessLogStream = fs.createWriteStream(path.join(__dirname, '/logging/access.log'), { flags: 'a' });

// Define custom token for logging timestamp
morgan.token('timestamp', () => new Date().toISOString());

// Define custom logging format
const loggingFormat = 'combined';

// Create and export Morgan middleware
const logger = morgan(loggingFormat, { stream: accessLogStream });

module.exports = logger;

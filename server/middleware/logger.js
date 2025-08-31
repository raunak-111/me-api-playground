const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Custom token for response time in milliseconds
morgan.token('response-time-ms', (req, res) => {
  const responseTime = res.getHeader('X-Response-Time');
  return responseTime ? `${responseTime}ms` : '-';
});

// Custom format for detailed logging
const detailedFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Development logger (console)
const devLogger = morgan('dev');

// Production logger (file)
const prodLogger = morgan(detailedFormat, {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode < 400 // Only log errors in production
});

// Combined logger for all requests
const combinedLogger = morgan('combined', {
  stream: accessLogStream
});

// Error logger
const errorLogger = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  const errorLog = `[${timestamp}] ERROR: ${err.message}\nStack: ${err.stack}\nURL: ${req.method} ${req.url}\nIP: ${req.ip}\n\n`;
  
  fs.appendFile(path.join(logsDir, 'error.log'), errorLog, (writeErr) => {
    if (writeErr) console.error('Failed to write error log:', writeErr);
  });
  
  next(err);
};

// Request logger middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent') || '-'
    };
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${logEntry.method} ${logEntry.url} - ${logEntry.status} - ${logEntry.duration}`);
    }
  });
  
  next();
};

module.exports = {
  devLogger,
  prodLogger,
  combinedLogger,
  errorLogger,
  requestLogger
};

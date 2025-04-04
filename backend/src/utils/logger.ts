import pino from 'pino';

// Create a simple logger instance that only logs to terminal
const logger = pino({
  level: 'debug',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
    }
  },
  base: undefined, // Remove default base properties (pid, hostname)
});

export default logger;
// =============================================================================
// Logger — Winston-based logging without sensitive data
// =============================================================================

import winston from 'winston';
import { env } from '../../config/env';

const sensitiveFields = ['password', 'token', 'secret', 'authorization', 'cookie'];

/** Redacts sensitive fields from log data */
const redactSensitive = winston.format((info) => {
  if (typeof info.message === 'string') {
    for (const field of sensitiveFields) {
      const regex = new RegExp(`("${field}"\\s*:\\s*)"[^"]*"`, 'gi');
      info.message = (info.message as string).replace(regex, `$1"[REDACTED]"`);
    }
  }
  return info;
});

export const logger = winston.createLogger({
  level: env.isDevelopment ? 'debug' : 'info',
  format: winston.format.combine(
    redactSensitive(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    env.isDevelopment
      ? winston.format.combine(winston.format.colorize(), winston.format.simple())
      : winston.format.json()
  ),
  defaultMeta: { service: 'soundwave-api' },
  transports: [
    new winston.transports.Console(),
    // In production, add file transports:
    // new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

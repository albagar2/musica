// =============================================================================
// Request Logger Middleware
// Logs all incoming requests without sensitive data
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import { logger } from '../shared/utils/logger';

/** Logs incoming HTTP requests with method, path, status, and duration */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')?.substring(0, 100),
    };

    if (res.statusCode >= 400) {
      logger.warn('Request failed', logData);
    } else {
      logger.info('Request completed', logData);
    }
  });

  next();
}

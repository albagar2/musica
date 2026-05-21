// =============================================================================
// Async Handler Wrapper
// Wraps async route handlers to catch errors and forward to error middleware
// =============================================================================

import { Request, Response, NextFunction, RequestHandler } from 'express';

type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * Wraps an async Express handler so thrown errors are passed to next().
 * Eliminates try/catch boilerplate in every controller.
 */
export function asyncHandler(fn: AsyncRequestHandler): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

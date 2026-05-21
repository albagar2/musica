// =============================================================================
// Global Error Handler Middleware
// Catches all errors and returns consistent JSON responses
// Never exposes sensitive data in error responses
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import { AppError } from './AppError';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Error de validación',
      errors: formattedErrors,
    });
    return;
  }

  // Handle our custom AppError
  if (err instanceof AppError) {
    // Log operational errors at warn level, programming errors at error level
    if (err.isOperational) {
      logger.warn(`[${err.code}] ${err.message}`);
    } else {
      logger.error(`[${err.code}] ${err.message}`, { stack: err.stack });
    }

    res.status(err.statusCode).json({
      success: false,
      code: err.code,
      message: err.message,
    });
    return;
  }

  // Handle Prisma known errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;
    if (prismaError.code === 'P2002') {
      const target = prismaError.meta?.target;
      res.status(409).json({
        success: false,
        code: 'DUPLICATE_ENTRY',
        message: `Ya existe un registro con ese ${target || 'valor'}`,
      });
      return;
    }
    if (prismaError.code === 'P2025') {
      res.status(404).json({
        success: false,
        code: 'NOT_FOUND',
        message: 'Registro no encontrado',
      });
      return;
    }
  }

  // Unknown/unexpected errors — never expose stack traces to client
  logger.error('Unhandled error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    code: 'INTERNAL_ERROR',
    message: 'Error interno del servidor',
  });
}

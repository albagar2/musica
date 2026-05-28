// =============================================================================
// JWT Authentication Middleware
// Validates access tokens and attaches user to request
// =============================================================================

import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../shared/errors/AppError';
import { AuthenticatedRequest, UserRole } from '../shared/types';

interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Middleware that requires a valid JWT access token.
 * Extracts user info and attaches to req.user
 */
export function authenticate(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw AppError.unauthorized('Token de acceso requerido');
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    throw AppError.unauthorized('Token de acceso requerido');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    // Bloquear modificaciones para la cuenta Demo
    if (req.user.email === 'demo@soundwave.com' && req.method !== 'GET') {
      throw AppError.forbidden('Modo Demo: Puedes explorar la aplicación, pero no modificar datos.');
    }

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw AppError.unauthorized('Token expirado');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw AppError.unauthorized('Token inválido');
    }
    throw AppError.unauthorized('Error de autenticación');
  }
}

/**
 * Optional authentication — doesn't fail if no token present.
 * Useful for endpoints that work for both authenticated and anonymous users.
 */
export function optionalAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    // Silently ignore invalid tokens for optional auth
  }

  next();
}

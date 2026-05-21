// =============================================================================
// Rate Limiting Middleware
// Protects against brute force and DDoS attacks
// =============================================================================

import rateLimit from 'express-rate-limit';
import { env } from '../config/env';

/** General API rate limiter */
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Demasiadas solicitudes. Por favor, inténtalo de nuevo más tarde.',
  },
  keyGenerator: (req) => {
    // Use X-Forwarded-For header if behind a proxy, otherwise use IP
    return (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
  },
});

/** Stricter rate limiter for auth endpoints (login, register) */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Demasiados intentos de autenticación. Inténtalo en 15 minutos.',
  },
  keyGenerator: (req) => {
    return (req.headers['x-forwarded-for'] as string) || req.ip || 'unknown';
  },
});

/** Upload rate limiter */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 uploads per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    code: 'TOO_MANY_REQUESTS',
    message: 'Has alcanzado el límite de subidas. Inténtalo más tarde.',
  },
});

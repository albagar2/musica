// =============================================================================
// Role-Based Access Control (RBAC) Middleware
// Restricts routes based on user roles
// =============================================================================

import { Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';
import { AuthenticatedRequest, UserRole } from '../shared/types';

/**
 * Creates middleware that only allows users with specified roles.
 * Must be used AFTER the authenticate middleware.
 *
 * @example
 * router.delete('/songs/:id', authenticate, authorize('ADMIN'), deleteSong);
 */
export function authorize(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw AppError.unauthorized('Autenticación requerida');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw AppError.forbidden(
        'No tienes permisos para realizar esta acción'
      );
    }

    next();
  };
}

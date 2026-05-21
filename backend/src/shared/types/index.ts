// =============================================================================
// Shared TypeScript Types and Interfaces
// =============================================================================

import { Request } from 'express';

/** Roles available in the system */
export type UserRole = 'USER' | 'ARTIST' | 'ADMIN';

/** Authenticated request with user payload */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: UserRole;
  };
}

/** Standard API response format */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
}

/** Pagination metadata */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Pagination query params */
export interface PaginationQuery {
  page: number;
  limit: number;
  skip: number;
}

/** Parse pagination from query string */
export function parsePagination(query: Record<string, any>): PaginationQuery {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit) || 20));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

/**
 * Tipos base para comunicação com API
 * Centralizados para evitar duplicação em services
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
  };
}

export interface RequestOptions {
  headers?: Record<string, string>;
  timeout?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

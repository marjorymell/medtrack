/**
 * Tipos de gerenciamento de usuário
 * Consolidado de services/user-service.ts
 */

import type { User } from './auth';

// Re-exporta User de auth.ts para evitar imports circulares
export type { User } from './auth';

export interface UpdateUserData {
  name?: string;
  email?: string;
  avatar?: string;
  password?: string;
}

export interface UpdateUserResponse {
  success: boolean;
  data: User;
  message?: string;
}

import { ApiService } from './api-service';
import { User, UpdateUserData, UpdateUserResponse } from '@/types/user';
import { ApiResponse } from '@/types/api';

/**
 * Serviço de gerenciamento de usuários
 * Refatorado para estender ApiService
 */
class UserService extends ApiService {
  constructor() {
    super();
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.get<User>('/users/me');
  }

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return this.get<User>(`/users/${userId}`);
  }

  async updateUser(userId: string, data: UpdateUserData): Promise<ApiResponse<User>> {
    return this.put<User>(`/users/${userId}`, data);
  }

  async deleteUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return this.delete<{ message: string }>(`/users/${userId}`);
  }
}

export const userService = new UserService();
export default UserService;

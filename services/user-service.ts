const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
}

class UserService {
  private getAuthHeaders(token?: string) {
    const authToken = token || process.env.EXPO_PUBLIC_JWT_TOKEN;
    return {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    };
  }

  async getCurrentUser(token?: string): Promise<User> {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'GET',
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Erro ao buscar dados do usuário');
    }

    const data = await response.json();
    return data.user || data;
  }

  async updateUser(userId: string, data: UpdateUserData, token?: string): Promise<User> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(token),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Erro ao atualizar usuário');
    }

    const result = await response.json();
    return result.user || result;
  }

  async deleteUser(userId: string, token?: string): Promise<void> {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Erro ao deletar usuário');
    }
  }
}

export const userService = new UserService();

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth';
import { ApiResponse } from '@/types/api';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = '@medtrack:auth_token';
const USER_KEY = '@medtrack:user';

/**
 * Serviço para autenticação de usuários
 * NOTA: Este serviço NÃO estende ApiService para evitar dependência circular
 * (ApiService depende de authService.getToken())
 */
class AuthService {
  /**
   * Faz login do usuário
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        let errorMessage = 'Erro ao fazer login';

        try {
          const errorData = await response.json();

          // Nova estrutura: { success: false, error: { code, message } }
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          }
          // Estrutura antiga: { error: "msg" }
          else if (typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          }
          // Estrutura alternativa: { message: "msg" }
          else if (errorData.message) {
            errorMessage = errorData.message;
          }

          // Mensagem específica para 401
          if (response.status === 401) {
            errorMessage = 'Credenciais inválidas';
          }
        } catch (parseError) {
          console.error('[AuthService] Error parsing response:', parseError);
          errorMessage = `Erro HTTP ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      const data: AuthResponse = await response.json();

      await this.saveAuthData(data.data.token, data.data.user);

      return data;
    } catch (error: any) {
      console.error('[AuthService] Login error:', error.message);
      throw error;
    }
  }

  /**
   * Registra um novo usuário
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        let errorMessage = 'Erro ao criar conta';

        try {
          const errorData = await response.json();

          // Nova estrutura: { success: false, error: { code, message } }
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          }
          // Estrutura antiga: { error: "msg" }
          else if (typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          }
          // Estrutura alternativa: { message: "msg" }
          else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } catch (parseError) {
          console.error('[AuthService] Error parsing response:', parseError);
          errorMessage = `Erro HTTP ${response.status}`;
        }

        throw new Error(errorMessage);
      }

      const data: AuthResponse = await response.json();

      await this.saveAuthData(data.data.token, data.data.user);

      return data;
    } catch (error: any) {
      console.error('[AuthService] Register error:', error.message);
      throw error;
    }
  }

  /**
   * Faz logout do usuário
   */
  async logout(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Verifica se o usuário está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getToken();
      return !!token;
    } catch {
      return false;
    }
  }

  /**
   * Obtém o token JWT armazenado
   */
  async getToken(): Promise<string | null> {
    try {
      const token = await AsyncStorage.getItem(TOKEN_KEY);
      return token;
    } catch (error) {
      return null;
    }
  }

  /**
   * Obtém os dados do usuário armazenados
   */
  async getUser(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  /**
   * Salva os dados de autenticação
   */
  private async saveAuthData(token: string, user: User): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [TOKEN_KEY, token],
        [USER_KEY, JSON.stringify(user)],
      ]);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Obtém headers de autenticação para requests
   */
  async getAuthHeaders(): Promise<HeadersInit> {
    const token = await this.getToken();
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }
}

// Exporta uma instância singleton
export const authService = new AuthService();

// Exporta também a classe para casos de uso avançados
export default AuthService;

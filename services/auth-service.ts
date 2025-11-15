import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
const TOKEN_KEY = '@medtrack:auth_token';
const USER_KEY = '@medtrack:user';

/**
 * Serviço para autenticação de usuários
 */
class AuthService {
  /**
   * Faz login do usuário
   */
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      console.log('[AuthService] Fazendo login...');

      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro HTTP ${response.status}`);
      }

      const data: AuthResponse = await response.json();

      // Salvar token e dados do usuário
      await this.saveAuthData(data.token, data.user);

      console.log('[AuthService] Login realizado com sucesso');
      return data;
    } catch (error: any) {
      console.error('[AuthService] Erro no login:', error);
      throw error;
    }
  }

  /**
   * Registra um novo usuário
   */
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log('[AuthService] Registrando usuário...');

      const response = await fetch(`${API_URL}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro HTTP ${response.status}`);
      }

      const data: AuthResponse = await response.json();

      // Salvar token e dados do usuário
      await this.saveAuthData(data.token, data.user);

      console.log('[AuthService] Usuário registrado com sucesso');
      return data;
    } catch (error: any) {
      console.error('[AuthService] Erro no registro:', error);
      throw error;
    }
  }

  /**
   * Faz logout do usuário
   */
  async logout(): Promise<void> {
    try {
      console.log('[AuthService] Fazendo logout...');

      // Limpar dados armazenados
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);

      console.log('[AuthService] Logout realizado com sucesso');
    } catch (error: any) {
      console.error('[AuthService] Erro no logout:', error);
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
      console.log(
        '[AuthService] Token recuperado do AsyncStorage:',
        token ? 'PRESENTE' : 'AUSENTE'
      );
      return token;
    } catch (error) {
      console.error('[AuthService] Erro ao obter token:', error);
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
      console.error('[AuthService] Erro ao salvar dados de auth:', error);
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

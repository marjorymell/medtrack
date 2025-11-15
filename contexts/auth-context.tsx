import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService, User, LoginRequest, RegisterRequest } from '../services/auth-service';
import { showToast } from '../utils/toast';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  /**
   * Carrega dados de autenticação armazenados
   */
  const loadStoredAuth = async () => {
    try {
      setIsLoading(true);

      const [storedToken, storedUser] = await Promise.all([
        authService.getToken(),
        authService.getUser(),
      ]);

      console.log('[AuthContext] Token encontrado:', storedToken ? 'SIM' : 'NÃO');
      console.log('[AuthContext] User encontrado:', storedUser ? 'SIM' : 'NÃO');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
        console.log('[AuthContext] Dados de autenticação carregados');
      } else {
        console.log('[AuthContext] Nenhum dado de autenticação encontrado');
      }
    } catch (error) {
      console.error('[AuthContext] Erro ao carregar dados de autenticação:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Faz login do usuário
   */
  const login = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);

      const response = await authService.login(credentials);

      setUser(response.user);
      setToken(response.token);

      showToast('Login realizado com sucesso!', 'success');
      console.log('[AuthContext] Login realizado com sucesso');
    } catch (error: any) {
      console.error('[AuthContext] Erro no login:', error);
      showToast(error.message || 'Erro no login', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Registra um novo usuário
   */
  const register = async (userData: RegisterRequest) => {
    try {
      setIsLoading(true);

      const response = await authService.register(userData);

      setUser(response.user);
      setToken(response.token);

      showToast('Conta criada com sucesso!', 'success');
      console.log('[AuthContext] Registro realizado com sucesso');
    } catch (error: any) {
      console.error('[AuthContext] Erro no registro:', error);
      showToast(error.message || 'Erro ao criar conta', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Faz logout do usuário
   */
  const logout = async () => {
    try {
      setIsLoading(true);

      await authService.logout();

      setUser(null);
      setToken(null);

      showToast('Logout realizado com sucesso', 'success');
      console.log('[AuthContext] Logout realizado com sucesso');
    } catch (error: any) {
      console.error('[AuthContext] Erro no logout:', error);
      showToast('Erro ao fazer logout', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Atualiza dados de autenticação (útil para refresh)
   */
  const refreshAuth = async () => {
    await loadStoredAuth();
  };

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

import React, { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import { User, LoginRequest, RegisterRequest, AuthContextValue } from '@/types/auth';
import { authService } from '@/lib/services/auth-service';
import { showToast } from '../utils/toast';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

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

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      } else {
        setToken(null)
        setUser(null);
        await authService.logout();
      }
    } catch (error) {
      console.error("Auth load failed", error);
      setToken(null);
      setUser(null);
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

      setUser(response.data.user);
      setToken(response.data.token);

      // Não mostra toast aqui - será mostrado na tela de auth
    } catch (error: any) {
      // Re-lança o erro para ser tratado na tela
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

      setUser(response.data.user);
      setToken(response.data.token);

      // Não mostra toast aqui - será mostrado na tela de auth
    } catch (error: any) {
      // Re-lança o erro para ser tratado na tela
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
    } catch (error: any) {
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

  const value = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  }), [user, token, isLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook para usar o contexto de autenticação
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}

import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/contexts/auth-context';
import { useRouter, useSegments } from 'expo-router';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Componente que protege rotas que requerem autenticação
 * Redireciona para tela de login se usuário não estiver autenticado
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const colors = useThemeColors();

  // Verifica se estamos em uma rota protegida
  const isProtectedRoute = segments[0] === '(tabs)' || segments[0] === 'add-medication';

  React.useEffect(() => {
    if (!isLoading && !isAuthenticated && isProtectedRoute) {
      console.log('[AuthGuard] Usuário não autenticado, redirecionando para login');
      router.replace('/auth-screen?mode=login');
    }
  }, [isAuthenticated, isLoading, isProtectedRoute, router]);

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Se não está autenticado e está em rota protegida, não renderiza nada
  // (o useEffect vai redirecionar)
  if (!isAuthenticated && isProtectedRoute) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Se está autenticado ou não está em rota protegida, renderiza normalmente
  return <>{children}</>;
}

import React, { useEffect } from 'react';
import { View, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAuth } from '@/contexts/auth-context';

export default function IndexScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirecionamento automático baseado no estado de autenticação
  useEffect(() => {
    if (!isLoading) {
      console.log('[IndexScreen] Verificando autenticação - isAuthenticated:', isAuthenticated);
      if (isAuthenticated) {
        console.log('[IndexScreen] Usuário autenticado, redirecionando para tabs');
        router.replace('/(tabs)');
      } else {
        console.log('[IndexScreen] Usuário não autenticado, mostrando tela de boas-vindas');
      }
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = () => {
    router.push('/auth-screen?mode=login');
  };

  const handleCreateAccount = () => {
    router.push('/auth-screen?mode=signup');
  };

  // Mostra loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Se usuário estiver autenticado, não mostra nada (useEffect vai redirecionar)
  if (isAuthenticated) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo and Text Section */}
        <View className="mb-12 w-full items-center">
          <View className="mb-6">
            <Image
              source={require('@/assets/images/logo-medtrack.png')}
              style={{ width: 154, height: 154 }}
              resizeMode="contain"
            />
          </View>

          {/* MedTrack Text */}
          <Text className="mb-12 text-[22px] font-semibold text-foreground dark:text-foreground-dark">
            MedTrack
          </Text>

          <Pressable
            onPress={handleLogin}
            className="mb-3 h-12 w-full items-center justify-center rounded-lg bg-primary dark:bg-primary-dark"
            accessibilityLabel="Entrar"
            accessibilityRole="button">
            <Text className="text-base font-bold text-primary-foreground dark:text-primary-foreground-dark">
              Entrar
            </Text>
          </Pressable>

          {/* Create Account Button */}
          <Pressable
            onPress={handleCreateAccount}
            className="mb-4 h-12 w-full items-center justify-center rounded-lg bg-secondary dark:bg-secondary-dark"
            accessibilityLabel="Criar Conta"
            accessibilityRole="button">
            <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
              Criar Conta
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="px-6 py-8">
        <Text
          className="text-center text-xs leading-relaxed"
          style={{ color: colors.textSecondary }}>
          Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </Text>
      </View>
    </ScrollView>
  );
}

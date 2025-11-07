import React, { useState, useCallback } from 'react';
import { View, ScrollView, Pressable, Image, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FormField } from '@/components/ui/form-field';
import { useThemeColors } from '@/hooks/use-theme-colors';

type AuthMode = 'login' | 'signup';

export default function AuthScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const { mode: initialModeParam } = useLocalSearchParams<{ mode: AuthMode }>();

  const initialMode: AuthMode =
    initialModeParam === 'signup' || initialModeParam === 'login' ? initialModeParam : 'login';

  const [mode, setMode] = useState<AuthMode>(initialMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = useCallback(() => {
    if (isLogin) {
      console.log(`[API] Tentando Logar: ${email}`);
      router.replace('/(tabs)');
    } else {
      console.log(`[API] Tentando Cadastrar: ${email}`);
      router.replace('/(tabs)');
    }
  }, [email, isLogin, router]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, []);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}>
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center justify-center px-6 pt-10">
          {/* Logo and Title */}
          <View className="mb-8 w-full items-center">
            <Image
              source={require('@/assets/images/logo-medtrack.png')}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
            <Text className="mt-4 text-[24px] font-bold text-foreground dark:text-foreground-dark">
              {isLogin ? 'Bem-vindo de Volta' : 'Criar Sua Conta'}
            </Text>
            <Text className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground-dark">
              {isLogin ? 'Entre para continuar' : 'Preencha seus dados para começar'}
            </Text>
          </View>

          {/* Form */}
          <View className="w-full">
            <FormField
              label="E-mail"
              placeholder="seu.email@exemplo.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            <FormField
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete={isLogin ? 'password' : 'new-password'}
            />

            {/* Password Confirmation (Registration Mode Only) */}
            {!isLogin && (
              <FormField
                label="Confirmar Senha"
                placeholder="Confirme sua senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                autoComplete="new-password"
              />
            )}

            <View className="h-4" />

            {/* Main Action Button */}
            <Pressable
              onPress={handleSubmit}
              className="mb-3 h-12 w-full items-center justify-center rounded-lg bg-primary dark:bg-primary-dark"
              accessibilityLabel={isLogin ? 'Entrar' : 'Cadastrar'}
              accessibilityRole="button">
              <Text className="text-base font-bold text-primary-foreground dark:text-primary-foreground-dark">
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Text>
            </Pressable>

            {/* Link to switch modes */}
            <Pressable
              onPress={toggleMode}
              className="w-full items-center py-2"
              accessibilityLabel={isLogin ? 'Criar uma nova conta' : 'Já tenho conta, quero entrar'}
              accessibilityRole="link">
              <View className="border-b pb-0.5" style={{ borderColor: colors.textSecondary }}>
                <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                  {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça Login'}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Terms of Service */}
        <View className="mt-auto px-6 py-8">
          <Text
            className="text-center text-xs leading-relaxed"
            style={{ color: colors.textSecondary }}>
            Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

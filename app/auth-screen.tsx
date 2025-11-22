import React, { useState, useCallback } from 'react';
import { View, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FormField } from '@/components/ui/form-field';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/contexts/auth-context';
import { showToast } from '@/utils/toast';

type AuthMode = 'login' | 'signup';

export default function AuthScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { login, register, isLoading: authLoading } = useAuth();

  const { mode: initialModeParam } = useLocalSearchParams<{ mode: AuthMode }>();

  const initialMode: AuthMode =
    initialModeParam === 'signup' || initialModeParam === 'login' ? initialModeParam : 'login';

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [isLoading, setIsLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const isLogin = mode === 'login';

  const handleSubmit = useCallback(async () => {
    if (!email || !password) {
      showToast('Preencha todos os campos', 'error');
      return;
    }

    if (!isLogin && !name.trim()) {
      showToast('Digite seu nome', 'error');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      showToast('As senhas não coincidem', 'error');
      return;
    }

    setIsLoading(true);

    try {
      if (isLogin) {
        await login({ email, password });
        router.replace('/(tabs)');
      } else {
        await register({
          name: name.trim(),
          email,
          password,
        });
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      // Erro já tratado no contexto de autenticação

    } finally {
      setIsLoading(false);
    }
  }, [email, password, confirmPassword, name, isLogin, login, register, router]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
  }, []);

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}>
      <View className="absolute left-0 top-0 z-10 px-6 pt-16">
        <Pressable
          onPress={() => router.back()}
          className=""
          accessibilityLabel="Voltar para a tela anterior"
          accessibilityRole="button">
          <ArrowLeft size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center justify-center px-6 pt-20">
          <View className="mb-8 w-full items-center">
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

            {/* Name Field (Registration Mode Only) */}
            {!isLogin && (
              <FormField
                label="Nome"
                placeholder="Seu nome completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoComplete="name"
              />
            )}

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
              disabled={isLoading || authLoading}
              className={`mb-3 h-12 w-full items-center justify-center rounded-lg ${
                isLoading || authLoading
                  ? 'bg-secondary dark:bg-secondary-dark'
                  : 'bg-primary dark:bg-primary-dark'
              }`}
              accessibilityLabel={isLogin ? 'Entrar' : 'Cadastrar'}
              accessibilityRole="button">
              <Text
                className={`text-base font-bold ${
                  isLoading || authLoading
                    ? 'text-secondary-foreground dark:text-secondary-foreground-dark'
                    : 'text-primary-foreground dark:text-primary-foreground-dark'
                }`}>
                {isLoading || authLoading
                  ? isLogin
                    ? 'Entrando...'
                    : 'Criando conta...'
                  : isLogin
                    ? 'Entrar'
                    : 'Criar Conta'}
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

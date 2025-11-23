import React, { useState, useCallback } from 'react';
import {
  View,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { FormField } from '@/components/ui/form-field';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { ArrowLeft, AlertCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/auth-context';
import { showToast } from '@/utils/toast';
import { loginSchema, formatAuthErrors } from '@/lib/validation/auth-schemas';
import { Stack } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { login, isLoading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleLogin = useCallback(async () => {
    // Limpar mensagens de erro anteriores
    setErrorMessage('');
    setFieldErrors({});

    try {
      // Validar com Zod
      const validatedData = loginSchema.parse({ email, password });

      setIsLoading(true);
      await login(validatedData);

      // Só redireciona em caso de sucesso
      showToast('Login realizado com sucesso!', 'success');
      router.replace('/(tabs)');
    } catch (error: any) {
      // Erros de validação do Zod
      if (error.name === 'ZodError') {
        const errors = formatAuthErrors(error);
        setFieldErrors(errors);

        // Mostrar primeira mensagem de erro no card
        const firstError = Object.values(errors)[0];
        if (firstError) {
          setErrorMessage(firstError);
        }
        return;
      }

      // Erros da API
      const errorMsg = error.message || 'Erro desconhecido';

      // Mostrar mensagem mais específica baseada no erro
      if (errorMsg.toLowerCase().includes('credenciais inválidas')) {
        setErrorMessage(
          'E-mail ou senha incorretos. Verifique suas credenciais e tente novamente.'
        );
      } else if (
        errorMsg.toLowerCase().includes('network') ||
        errorMsg.toLowerCase().includes('fetch')
      ) {
        setErrorMessage('Erro de conexão. Verifique sua internet e tente novamente.');
      } else {
        setErrorMessage(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login, router]);

  const goToSignup = useCallback(() => {
    router.replace('/signup');
  }, [router]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
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
                Bem-vindo de Volta
              </Text>
              <Text className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground-dark">
                Entre para continuar
              </Text>
            </View>

            {/* Form */}
            <View className="w-full">
              <FormField
                label="E-mail"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  setFieldErrors((prev) => ({ ...prev, email: '' }));
                  setErrorMessage('');
                }}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={fieldErrors.email}
              />

              <FormField
                label="Senha"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setFieldErrors((prev) => ({ ...prev, password: '' }));
                  setErrorMessage('');
                }}
                placeholder="Digite sua senha"
                secureTextEntry
                error={fieldErrors.password}
              />

              {/* Error Message */}
              {errorMessage ? (
                <View className="mb-4 flex-row items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                  <AlertCircle size={20} color="#ef4444" />
                  <Text className="flex-1 text-sm text-red-500">{errorMessage}</Text>
                </View>
              ) : null}

              {/* Login Button */}
              <Pressable
                onPress={handleLogin}
                disabled={isLoading || authLoading}
                className="mb-4 rounded-lg bg-primary py-4 active:opacity-80 disabled:opacity-50 dark:bg-primary-dark"
                accessibilityLabel="Fazer login"
                accessibilityRole="button">
                {isLoading || authLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-center text-base font-semibold text-primary-foreground dark:text-primary-foreground-dark">
                    Entrar
                  </Text>
                )}
              </Pressable>

              {/* Divider */}
              <View className="my-6 flex-row items-center">
                <View className="h-[1px] flex-1 bg-border dark:bg-border-dark" />
                <Text className="mx-4 text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  ou
                </Text>
                <View className="h-[1px] flex-1 bg-border dark:bg-border-dark" />
              </View>

              {/* Signup Link */}
              <Pressable
                onPress={goToSignup}
                className="py-2 active:opacity-70"
                accessibilityLabel="Ir para criar conta"
                accessibilityRole="button">
                <Text className="text-center text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  Não tem uma conta?{' '}
                  <Text className="font-semibold text-primary dark:text-primary-dark">
                    Cadastre-se
                  </Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

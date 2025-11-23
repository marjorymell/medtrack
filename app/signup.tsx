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
import { signupFormSchema, formatAuthErrors } from '@/lib/validation/auth-schemas';
import { Stack } from 'expo-router';

export default function SignupScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { register, isLoading: authLoading } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSignup = useCallback(async () => {
    // Limpar mensagens de erro anteriores
    setErrorMessage('');
    setFieldErrors({});

    try {
      // Validar com Zod (inclui validação de confirmação de senha)
      const validatedData = signupFormSchema.parse({
        name,
        email,
        password,
        confirmPassword,
      });

      setIsLoading(true);

      // Enviar apenas os dados necessários para o backend (sem confirmPassword)
      const { confirmPassword: _, ...registerData } = validatedData;
      await register(registerData);

      // Só redireciona em caso de sucesso
      showToast('Conta criada com sucesso!', 'success');
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
      if (
        errorMsg.toLowerCase().includes('já existe') ||
        errorMsg.toLowerCase().includes('already exists')
      ) {
        setErrorMessage('Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.');
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
  }, [name, email, password, confirmPassword, register, router]);

  const goToLogin = useCallback(() => {
    router.replace('/login');
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
                Criar Sua Conta
              </Text>
              <Text className="mt-1 text-sm text-muted-foreground dark:text-muted-foreground-dark">
                Preencha seus dados para começar
              </Text>
            </View>

            {/* Form */}
            <View className="w-full">
              <FormField
                label="Nome"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  setFieldErrors((prev) => ({ ...prev, name: '' }));
                  setErrorMessage('');
                }}
                placeholder="Seu nome completo"
                autoCapitalize="words"
                error={fieldErrors.name}
              />

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
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                error={fieldErrors.password}
              />

              <FormField
                label="Confirmar Senha"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setFieldErrors((prev) => ({ ...prev, confirmPassword: '' }));
                  setErrorMessage('');
                }}
                placeholder="Digite a senha novamente"
                secureTextEntry
                error={fieldErrors.confirmPassword}
              />

              {/* Error Message */}
              {errorMessage ? (
                <View className="mb-4 flex-row items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/10 p-3">
                  <AlertCircle size={20} color="#ef4444" />
                  <Text className="flex-1 text-sm text-red-500">{errorMessage}</Text>
                </View>
              ) : null}

              {/* Signup Button */}
              <Pressable
                onPress={handleSignup}
                disabled={isLoading || authLoading}
                className="mb-4 rounded-lg bg-primary py-4 active:opacity-80 disabled:opacity-50 dark:bg-primary-dark"
                accessibilityLabel="Criar conta"
                accessibilityRole="button">
                {isLoading || authLoading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-center text-base font-semibold text-primary-foreground dark:text-primary-foreground-dark">
                    Criar Conta
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

              {/* Login Link */}
              <Pressable
                onPress={goToLogin}
                className="py-2 active:opacity-70"
                accessibilityLabel="Ir para fazer login"
                accessibilityRole="button">
                <Text className="text-center text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  Já tem uma conta?{' '}
                  <Text className="font-semibold text-primary dark:text-primary-dark">Entrar</Text>
                </Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

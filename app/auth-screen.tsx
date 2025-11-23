import React, { useState, useCallback } from 'react';
import { View, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FormField } from '@/components/ui/form-field';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { ArrowLeft, AlertCircle } from 'lucide-react-native';
import { useAuth } from '@/contexts/auth-context';
import { showToast } from '@/utils/toast';
import { loginSchema, registerSchema, formatAuthErrors } from '@/lib/validation/auth-schemas';

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
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isLogin = mode === 'login';

  const handleSubmit = useCallback(async () => {
    // Limpar mensagens de erro anteriores
    setErrorMessage('');
    setFieldErrors({});

    try {
      if (isLogin) {
        // Validar com Zod
        const validatedData = loginSchema.parse({ email, password });

        setIsLoading(true);
        await login(validatedData);

        // Só redireciona em caso de sucesso
        showToast('Login realizado com sucesso!', 'success');
        router.replace('/(tabs)');
      } else {
        // Validar confirmação de senha antes do Zod
        if (password !== confirmPassword) {
          setErrorMessage('As senhas não coincidem');
          return;
        }

        // Validar com Zod
        const validatedData = registerSchema.parse({ name, email, password });

        setIsLoading(true);
        await register(validatedData);

        // Só redireciona em caso de sucesso
        showToast('Conta criada com sucesso!', 'success');
        router.replace('/(tabs)');
      }
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
  }, [email, password, confirmPassword, name, isLogin, login, register, router]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'login' ? 'signup' : 'login'));
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setErrorMessage('');
    setFieldErrors({});
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
              onChangeText={(text) => {
                setEmail(text);
                if (fieldErrors.email) {
                  const { email, ...rest } = fieldErrors;
                  setFieldErrors(rest);
                }
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={fieldErrors.email}
            />

            {/* Name Field (Registration Mode Only) */}
            {!isLogin && (
              <FormField
                label="Nome"
                placeholder="Seu nome completo"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (fieldErrors.name) {
                    const { name, ...rest } = fieldErrors;
                    setFieldErrors(rest);
                  }
                }}
                autoCapitalize="words"
                autoComplete="name"
                error={fieldErrors.name}
              />
            )}

            <FormField
              label="Senha"
              placeholder="Digite sua senha"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (fieldErrors.password) {
                  const { password, ...rest } = fieldErrors;
                  setFieldErrors(rest);
                }
              }}
              secureTextEntry
              autoComplete={isLogin ? 'password' : 'new-password'}
              error={fieldErrors.password}
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

            {/* Error Message */}
            {errorMessage && (
              <View className="mb-4 flex-row items-start gap-3 rounded-lg border border-red-500/30 bg-red-50 px-4 py-3.5 dark:bg-red-950/20">
                <AlertCircle size={20} color="#ef4444" className="mt-0.5 flex-shrink-0" />
                <View className="flex-1">
                  <Text className="text-sm font-medium leading-relaxed text-red-700 dark:text-red-400">
                    {errorMessage}
                  </Text>
                </View>
              </View>
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

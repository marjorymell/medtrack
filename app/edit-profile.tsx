import React, { useState, useCallback } from 'react';
import { View, ScrollView, Pressable, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Text } from '@/components/ui/text';
import { FormField } from '@/components/ui/form-field';
import { useRouter } from 'expo-router';
import { ArrowLeft, Save, User } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useUser } from '@/hooks/use-user';
import { useAuth } from '@/contexts/auth-context';
import { showToast } from '@/utils/toast';
import { StatusBar } from 'expo-status-bar';

export default function EditProfileScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user, updateUser, loading } = useUser();
  const { logout } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  const handleSave = useCallback(async () => {
    if (!formData.name.trim()) {
      showToast('Nome é obrigatório', 'error');
      return;
    }

    if (!formData.email.trim()) {
      showToast('E-mail é obrigatório', 'error');
      return;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showToast('E-mail inválido', 'error');
      return;
    }

    setIsLoading(true);

    try {
      await updateUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
      });

      showToast('Perfil atualizado com sucesso!', 'success');
      router.back();
    } catch (error: any) {
      console.error('Erro ao atualizar perfil:', error);
      showToast(error.message || 'Erro ao atualizar perfil', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [formData, updateUser, router]);

  const handleLogout = useCallback(async () => {
    Alert.alert('Sair da conta', 'Tem certeza que deseja sair da sua conta?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
            router.replace('/');
          } catch (error) {
            console.error('Erro ao fazer logout:', error);
          }
        },
      },
    ]);
  }, [logout, router]);

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}>
      {/* Header */}
      <View className="flex-row items-center bg-background px-4 pb-6 pt-16 dark:bg-background-dark">
        <Pressable onPress={() => router.back()} className="p-2">
          <ArrowLeft size={24} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-center text-lg font-semibold text-foreground dark:text-foreground-dark">
            Editar Perfil
          </Text>
        </View>
        <Pressable
          onPress={handleSave}
          disabled={isLoading || loading}
          className="p-2"
          accessibilityLabel="Salvar alterações"
          accessibilityRole="button">
          <Save
            size={24}
            color={isLoading || loading ? colors.textSecondary : colors.primary}
            strokeWidth={2}
          />
        </Pressable>
      </View>

      <ScrollView className="flex-1 bg-background dark:bg-background-dark">
        {/* Profile Info */}
        <View className="items-center gap-4 px-4 py-6">
          <View className="h-32 w-32 items-center justify-center rounded-full bg-primary dark:bg-primary-dark">
            <Text className="text-[50px] font-bold leading-[50px] text-primary-foreground dark:text-primary-foreground-dark">
              {getUserInitials(formData.name || user?.name || 'U')}
            </Text>
          </View>

          <View className="items-center gap-1">
            <Text className="text-[22px] font-bold leading-7 text-foreground dark:text-foreground-dark">
              {user?.name || 'Carregando...'}
            </Text>
            <Text className="text-base text-muted-foreground dark:text-muted-foreground-dark">
              {user?.email || ''}
            </Text>
          </View>
        </View>

        {/* Form */}
        <View className="px-6">
          <FormField
            label="Nome completo"
            placeholder="Digite seu nome completo"
            value={formData.name}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
            autoCapitalize="words"
            autoComplete="name"
            autoFocus
          />

          <FormField
            label="E-mail"
            placeholder="seu.email@exemplo.com"
            value={formData.email}
            onChangeText={(text) => setFormData((prev) => ({ ...prev, email: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          {/* Account Info */}
          <View className="mt-6 rounded-lg bg-card p-4 dark:bg-card-dark">
            <Text className="mb-3 text-base font-medium text-foreground dark:text-foreground-dark">
              Informações da conta
            </Text>

            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  Membro desde
                </Text>
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  Última atualização
                </Text>
                <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
                  {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('pt-BR') : 'N/A'}
                </Text>
              </View>
            </View>
          </View>

          {/* Logout Button */}
          <Pressable
            onPress={handleLogout}
            className="mt-8 flex-row items-center justify-center rounded-lg bg-red-500 py-3"
            accessibilityLabel="Sair da conta"
            accessibilityRole="button">
            <User size={20} color="white" className="mr-2" />
            <Text className="ml-2 text-base font-bold text-white">Sair da conta</Text>
          </Pressable>
        </View>

        <View className="h-20" />
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

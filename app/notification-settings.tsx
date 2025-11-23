import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { X, Bell, Mail, Clock, Moon } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAuth } from '@/contexts/auth-context';
import { useNotificationPermissions } from '@/hooks/use-notification-permissions';
import { useDeviceToken } from '@/hooks/use-device-token';
import { notificationService } from '@/lib/services/notification-service';
import type { NotificationSettings } from '@/types/notification';

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { user, isAuthenticated } = useAuth();
  const { permissionStatus, requestPermissions } = useNotificationPermissions();
  const { deviceToken, registerToken, getDeviceToken, isLoading: tokenLoading } = useDeviceToken();

  // Estado das configurações
  const [settings, setSettings] = useState<NotificationSettings>({
    enablePush: false,
    enableEmail: false,
    reminderBefore: 0,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Marcar componente como montado
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Memoizar valores dos hooks para evitar leituras durante renderização
  const memoizedPermissionStatus = useMemo(
    () => permissionStatus,
    [permissionStatus.granted, permissionStatus.status]
  );
  const memoizedDeviceToken = useMemo(() => deviceToken, [deviceToken]);
  const memoizedTokenLoading = useMemo(() => tokenLoading, [tokenLoading]);

  // Carregar configurações salvas
  useEffect(() => {
    if (isAuthenticated && user?.id && isMounted) {
      loadSettings();
    }
  }, [isAuthenticated, user?.id, isMounted]); // Executa quando auth, user ou montagem mudar

  const loadSettings = async () => {
    try {
      setIsLoading(true);

      // Buscar configurações do backend
      const userSettings = await notificationService.getNotificationSettings();

      // Verificar se o componente ainda está montado antes de atualizar o estado
      if (!isMounted) {
        return;
      }

      const newSettings = {
        enablePush: userSettings.enablePush,
        enableEmail: userSettings.enableEmail,
        reminderBefore: userSettings.reminderBefore,
        quietHoursStart: userSettings.quietHoursStart || '22:00',
        quietHoursEnd: userSettings.quietHoursEnd || '08:00',
      };

      setSettings(newSettings);
    } catch (error) {
      console.error('[NotificationSettings] Erro ao carregar configurações:', error);
      console.error('[NotificationSettings] Detalhes do erro:', error);

      // Verificar se o componente ainda está montado antes de atualizar o estado
      if (!isMounted) {
        return;
      }

      // Fallback para valores padrão em caso de erro
      const fallbackSettings = {
        enablePush: memoizedPermissionStatus.granted,
        enableEmail: false,
        reminderBefore: 15,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00',
      };
      setSettings(fallbackSettings);

      Alert.alert('Erro', 'Não foi possível carregar as configurações. Usando valores padrão.');
    } finally {
      // Verificar se o componente ainda está montado antes de atualizar o estado
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  const updateSetting = async <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    try {
      setIsLoading(true);

      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);

      // Salvar no backend
      await notificationService.updateNotificationSettings(newSettings);
    } catch (error) {
      console.error(`Erro ao atualizar ${String(key)}:`, error);
      Alert.alert('Erro', 'Não foi possível salvar a configuração. Tente novamente.');
      // Reverter mudança em caso de erro
      setSettings(settings);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled && !memoizedPermissionStatus.granted) {
      // Solicitar permissões primeiro
      const granted = await requestPermissions();
      if (!granted) {
        Alert.alert(
          'Permissões necessárias',
          'Para receber notificações, permita o acesso nas configurações do dispositivo.'
        );
        return;
      }
    }

    await updateSetting('enablePush', enabled);

    // Se ativando, obter e registrar token do dispositivo
    if (enabled) {
      try {
        // Obter token do dispositivo (agora que as permissões foram concedidas)
        const token = await getDeviceToken();
        if (token && user?.id) {
          await registerToken(token, user.id);
        } else {
          console.warn('[NotificationSettings] Token ou user ID não disponível:', {
            token: !!token,
            userId: user?.id,
          });
          Alert.alert(
            'Erro',
            'Não foi possível ativar notificações push. Usuário não autenticado.'
          );
          // Reverter a configuração em caso de erro
          await updateSetting('enablePush', false);
        }
      } catch (error) {
        console.error('Erro ao obter/registrar token:', error);
        Alert.alert('Erro', 'Não foi possível ativar notificações push. Tente novamente.');
        // Reverter a configuração em caso de erro
        await updateSetting('enablePush', false);
      }
    }
  };

  const handleQuietHoursChange = async (startTime: string, endTime: string) => {
    await updateSetting('quietHoursStart', startTime);
    await updateSetting('quietHoursEnd', endTime);
  };

  const SettingToggle = ({
    enabled,
    onToggle,
    title,
    description,
    icon: Icon,
    disabled = false,
  }: {
    enabled: boolean;
    onToggle: (enabled: boolean) => void;
    title: string;
    description: string;
    icon: any;
    disabled?: boolean;
  }) => (
    <View className="mb-4 rounded-lg bg-card p-4 dark:bg-card-dark">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <View
            className={`mr-3 rounded-full p-2 ${enabled ? 'bg-primary/10 dark:bg-primary-dark/10' : 'bg-secondary dark:bg-secondary-dark'}`}>
            <Icon size={20} color={enabled ? colors.primary : colors.textSecondary} />
          </View>
          <View className="flex-1">
            <Text
              className={`text-base font-medium ${disabled ? 'opacity-50' : ''}`}
              style={{ color: colors.textPrimary }}>
              {title}
            </Text>
            <Text
              className={`text-sm ${disabled ? 'opacity-50' : ''}`}
              style={{ color: colors.textSecondary }}>
              {description}
            </Text>
          </View>
        </View>

        <Pressable
          onPress={() => !disabled && onToggle(!enabled)}
          disabled={disabled}
          className={`h-6 w-11 rounded-full p-0.5 ${enabled ? 'bg-primary dark:bg-primary-dark' : 'bg-secondary dark:bg-secondary-dark'}`}
          style={{ opacity: disabled ? 0.5 : 1 }}>
          <View
            className={`h-5 w-5 rounded-full bg-white shadow-sm`}
            style={{
              transform: [{ translateX: enabled ? 16 : 0 }],
            }}
          />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center bg-background px-4 pb-6 pt-16 dark:bg-background-dark">
        <Pressable onPress={() => router.back()} className="p-2">
          <X size={24} color={colors.textPrimary} strokeWidth={2} />
        </Pressable>
        <View className="flex-1">
          <Text className="text-center text-lg font-semibold text-foreground dark:text-foreground-dark">
            Notificações
          </Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16 }}>
        {/* Notificações Push */}
        <SettingToggle
          enabled={settings.enablePush}
          onToggle={handlePushToggle}
          title="Notificações Push"
          description="Receba lembretes de medicamentos no seu dispositivo"
          icon={Bell}
        />

        {/* Notificações por Email */}
        <SettingToggle
          enabled={settings.enableEmail}
          onToggle={(enabled) => updateSetting('enableEmail', enabled)}
          title="Notificações por Email"
          description="Receba lembretes também no seu email"
          icon={Mail}
          disabled={isLoading}
        />

        {/* Lembrete antecipado */}
        <View className="mb-4 rounded-lg bg-card p-4 dark:bg-card-dark">
          <View className="mb-3 flex-row items-center">
            <View className="mr-3 rounded-full bg-secondary p-2 dark:bg-secondary-dark">
              <Clock size={20} color={colors.textSecondary} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-foreground dark:text-foreground-dark">
                Lembrete antecipado
              </Text>
              <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                Minutos antes do horário programado
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {[0, 5, 15, 30, 60].map((minutes) => (
              <Pressable
                key={minutes}
                onPress={() => updateSetting('reminderBefore', minutes)}
                disabled={isLoading}
                className={`rounded-lg border px-3 py-2 ${
                  settings.reminderBefore === minutes
                    ? 'border-primary bg-primary dark:border-primary-dark dark:bg-primary-dark'
                    : 'border-border bg-secondary dark:border-border-dark dark:bg-secondary-dark'
                }`}
                style={{ opacity: isLoading ? 0.5 : 1 }}>
                <Text
                  className={`text-sm font-medium ${
                    settings.reminderBefore === minutes
                      ? 'text-primary-foreground dark:text-primary-foreground-dark'
                      : 'text-foreground dark:text-foreground-dark'
                  }`}>
                  {minutes === 0 ? 'No horário' : `${minutes}min`}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Horário de silêncio */}
        <View className="mb-4 rounded-lg bg-card p-4 dark:bg-card-dark">
          <View className="mb-3 flex-row items-center">
            <View className="mr-3 rounded-full bg-secondary p-2 dark:bg-secondary-dark">
              <Moon size={20} color={colors.textSecondary} />
            </View>
            <View className="flex-1">
              <Text className="text-base font-medium text-foreground dark:text-foreground-dark">
                Horário de silêncio
              </Text>
              <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                Não receber notificações durante este período
              </Text>
            </View>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="mb-1 text-sm text-muted-foreground dark:text-muted-foreground-dark">
                Início
              </Text>
              <Pressable
                onPress={() => {
                  // TODO: Implementar picker de horário
                  Alert.alert(
                    'Em desenvolvimento',
                    'Seletor de horário será implementado em breve'
                  );
                }}
                className="rounded-lg bg-secondary px-3 py-2 dark:bg-secondary-dark">
                <Text className="text-base text-foreground dark:text-foreground-dark">
                  {settings.quietHoursStart}
                </Text>
              </Pressable>
            </View>

            <Text className="mx-4 text-muted-foreground dark:text-muted-foreground-dark">até</Text>

            <View className="flex-1">
              <Text className="mb-1 text-sm text-muted-foreground dark:text-muted-foreground-dark">
                Fim
              </Text>
              <Pressable
                onPress={() => {
                  // TODO: Implementar picker de horário
                  Alert.alert(
                    'Em desenvolvimento',
                    'Seletor de horário será implementado em breve'
                  );
                }}
                className="rounded-lg bg-secondary px-3 py-2 dark:bg-secondary-dark">
                <Text className="text-base text-foreground dark:text-foreground-dark">
                  {settings.quietHoursEnd}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Status do dispositivo */}
        <View className="mb-4 rounded-lg bg-card p-4 dark:bg-card-dark">
          <Text className="mb-3 text-base font-medium text-foreground dark:text-foreground-dark">
            Status do dispositivo
          </Text>

          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                Permissões concedidas
              </Text>
              <View className="flex-row items-center gap-2">
                <View
                  className={`h-2 w-2 rounded-full ${
                    memoizedPermissionStatus.granted ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <Text
                  className={`text-sm font-medium ${
                    memoizedPermissionStatus.granted
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                  {memoizedPermissionStatus.granted
                    ? 'Sim'
                    : `Não (${memoizedPermissionStatus.status})`}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                Token registrado
              </Text>
              <View className="flex-row items-center gap-2">
                <View
                  className={`h-2 w-2 rounded-full ${
                    memoizedDeviceToken && settings.enablePush
                      ? 'bg-green-500'
                      : memoizedDeviceToken
                        ? 'bg-yellow-500'
                        : memoizedTokenLoading
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                  }`}
                />
                <Text
                  className={`text-sm font-medium ${
                    memoizedDeviceToken && settings.enablePush
                      ? 'text-green-600 dark:text-green-400'
                      : memoizedDeviceToken
                        ? 'text-yellow-600 dark:text-yellow-400'
                        : memoizedTokenLoading
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                  }`}>
                  {memoizedDeviceToken && settings.enablePush
                    ? 'Sim'
                    : memoizedDeviceToken
                      ? 'Disponível'
                      : memoizedTokenLoading
                        ? 'Carregando...'
                        : 'Não'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

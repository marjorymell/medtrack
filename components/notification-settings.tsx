import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useAuth } from '@/contexts/auth-context';
import { useNotificationPermissions } from '../hooks/use-notification-permissions';
import { useDeviceToken } from '../hooks/use-device-token';
import { useNotificationSettings } from '../hooks/use-notification-settings';
import { NotificationToggle, PushNotificationToggle } from './notification-toggle';
import { QuietHoursPicker } from './quiet-hours-picker';
import type { NotificationSettings } from '../types/notification';

/**
 * Tela/componente principal de configurações de notificação
 */
export function NotificationSettingsScreen() {
  const colors = useThemeColors();
  const { user } = useAuth();
  const { permissionStatus, requestPermissions } = useNotificationPermissions();
  const { deviceToken, registerToken, getDeviceToken, isLoading: tokenLoading } = useDeviceToken();
  const {
    settings: apiSettings,
    isLoading: settingsLoading,
    updateSettings,
    registerDeviceToken,
    isUpdating,
    isRegisteringDevice,
  } = useNotificationSettings();
  const router = useRouter();

  // Estado local das configurações (fallback para valores padrão)
  const [settings, setSettings] = useState<NotificationSettings>({
    enablePush: false,
    enableEmail: false,
    reminderBefore: 0,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sincronizar estado local com dados da API
  useEffect(() => {
    if (apiSettings) {
      setSettings({
        enablePush: apiSettings.enablePush,
        enableEmail: apiSettings.enableEmail,
        reminderBefore: apiSettings.reminderBefore,
        quietHoursStart: apiSettings.quietHoursStart || '22:00',
        quietHoursEnd: apiSettings.quietHoursEnd || '08:00',
      });
    } else if (!settingsLoading && !apiSettings) {
      // Fallback para valores padrão se não conseguir carregar da API
      setSettings({
        enablePush: permissionStatus.granted,
        enableEmail: false,
        reminderBefore: 15,
        quietHoursStart: '22:00',
        quietHoursEnd: '08:00',
      });
    }
  }, [apiSettings, settingsLoading, permissionStatus.granted]);

  const updateSetting = async <K extends keyof NotificationSettings>(
    key: K,
    value: NotificationSettings[K]
  ) => {
    try {
      setIsLoading(true);

      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);

      // Salvar no backend usando o hook
      await updateSettings({
        ...newSettings,
        quietHoursStart: newSettings.quietHoursStart || null,
        quietHoursEnd: newSettings.quietHoursEnd || null,
      });
      Alert.alert('Sucesso', 'Configuração salva com sucesso.');
      // Reverter mudança em caso de erro
      setSettings(settings);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePushToggle = async (enabled: boolean) => {
    if (enabled && !permissionStatus.granted) {
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
          await registerDeviceToken({
            token: token.token,
            platform: token.platform,
            userId: user.id,
          });
        } else {
          Alert.alert(
            'Erro',
            'Não foi possível ativar notificações push. Usuário não autenticado.'
          );
          // Reverter a configuração em caso de erro
          await updateSetting('enablePush', false);
        }
      } catch (error) {
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

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ padding: 16 }}>
      <Text className="mb-6 text-xl font-bold" style={{ color: colors.textPrimary }}>
        Notificações
      </Text>

      {/* Notificações Push */}
      <PushNotificationToggle
        enabled={settings.enablePush}
        onToggle={handlePushToggle}
        hasPermission={permissionStatus.granted}
        onRequestPermission={requestPermissions}
      />

      {/* Notificações por Email */}
      <NotificationToggle
        enabled={settings.enableEmail}
        onToggle={(enabled) => updateSetting('enableEmail', enabled)}
        title="Notificações por Email"
        description="Receba lembretes também no seu email"
        disabled={isLoading}
      />

      {/* Lembrete antecipado */}
      <View className="mb-4">
        <Text className="mb-2 text-base font-medium" style={{ color: colors.textPrimary }}>
          Lembrete antecipado
        </Text>
        <Text className="mb-3 text-sm" style={{ color: colors.textSecondary }}>
          Minutos antes do horário programado
        </Text>

        <View className="flex-row space-x-2">
          {[0, 5, 15, 30, 60].map((minutes) => (
            <Pressable
              key={minutes}
              onPress={() => updateSetting('reminderBefore', minutes)}
              className={`rounded-lg border px-4 py-2 ${
                settings.reminderBefore === minutes ? 'border-primary' : 'border-border'
              }`}
              style={{
                backgroundColor: settings.reminderBefore === minutes ? colors.primary : colors.card,
                borderColor: settings.reminderBefore === minutes ? colors.primary : colors.border,
              }}
              disabled={isLoading || isUpdating}>
              <Text
                className={`text-sm font-medium ${
                  settings.reminderBefore === minutes ? 'text-white' : ''
                }`}
                style={{
                  color:
                    settings.reminderBefore === minutes
                      ? colors.primaryForeground
                      : colors.textPrimary,
                }}>
                {minutes === 0 ? 'No horário' : `${minutes}min`}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Horário de silêncio */}
      <QuietHoursPicker
        startTime={settings.quietHoursStart}
        endTime={settings.quietHoursEnd}
        onChange={handleQuietHoursChange}
        enabled={settings.enablePush}
      />

      {/* Status do dispositivo */}
      <View
        className="mt-6 rounded-lg border p-4"
        style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Text className="mb-2 text-sm font-medium" style={{ color: colors.textPrimary }}>
          Status do dispositivo
        </Text>

        <View className="space-y-2">
          <View className="flex-row justify-between">
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Permissões concedidas
            </Text>
            <Text
              className={`text-sm font-medium ${
                permissionStatus.granted ? 'text-green-600' : 'text-red-600'
              }`}>
              {permissionStatus.granted ? 'Sim' : 'Não'}
            </Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Token registrado
            </Text>
            <Text
              className={`text-sm font-medium ${
                deviceToken ? 'text-green-600' : 'text-yellow-600'
              }`}>
              {deviceToken ? 'Sim' : tokenLoading ? 'Carregando...' : 'Não'}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

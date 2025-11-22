import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DeviceToken } from '../types/notification';
import { notificationService } from '../services/notification-service';
import { useAuth } from '../contexts/auth-context';

/**
 * Hook para gerenciar tokens de dispositivo para notificações push
 */
export function useDeviceToken() {
  const [deviceToken, setDeviceToken] = useState<DeviceToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  // Carregar token automaticamente quando o componente monta
  useEffect(() => {
    if (user?.id) {
      loadExistingToken();
    } else {
      setIsLoading(false);
    }
  }, [user?.id]);

  // Carregar token existente do dispositivo
  const loadExistingToken = async () => {
    try {
      // Verificar se as permissões foram concedidas
      const { status } = await Notifications.getPermissionsAsync();

      if (status !== 'granted') {
        setDeviceToken(null);
        setIsLoading(false);
        return;
      }

      // Tentar obter token do dispositivo
      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;

      const deviceTokenData: DeviceToken = {
        token,
        platform: Platform.OS as 'ios' | 'android',
        userId: user?.id || '', // Usar user ID se disponível
      };

      setDeviceToken(deviceTokenData);
    } catch (error: any) {
      setError(error.message || 'Erro ao carregar token');
      setDeviceToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Obter token do dispositivo (apenas quando permissões são concedidas)
  const getDeviceToken = async () => {
    try {
      setError(null);

      // Verificar se as permissões foram concedidas
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        setDeviceToken(null);
        return null;
      }

      // Obter token
      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;

      const deviceTokenData: DeviceToken = {
        token,
        platform: Platform.OS as 'ios' | 'android',
        userId: user?.id || '', // Usar user ID se disponível
      };

      setDeviceToken(deviceTokenData);

      return deviceTokenData;
    } catch (error: any) {
      setError(error.message || 'Erro ao obter token do dispositivo');
      return null;
    }
  };

  // Registrar token no backend
  const registerToken = async (tokenData: DeviceToken, userId: string) => {
    if (!tokenData) {
      return false;
    }

    try {
      const tokenWithUser = { ...tokenData, userId };
      setDeviceToken(tokenWithUser);

      const response = await notificationService.registerDeviceToken(tokenWithUser);

      return true;
    } catch (error: any) {
      setError(error.message || 'Erro ao registrar token');
      return false;
    }
  };

  // Limpar token (logout)
  const clearToken = () => {
    setDeviceToken(null);
    setError(null);
  };

  return {
    deviceToken,
    isLoading,
    error,
    getDeviceToken,
    registerToken,
    clearToken,
  };
}

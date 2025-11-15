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
    console.log('[DeviceToken] Hook inicializado, userId:', user?.id);
    if (user?.id) {
      loadExistingToken();
    } else {
      console.log('[DeviceToken] Usuário não autenticado, aguardando...');
      setIsLoading(false);
    }
  }, [user?.id]);

  // Carregar token existente do dispositivo
  const loadExistingToken = async () => {
    try {
      console.log('[DeviceToken] Verificando se já existe token registrado para userId:', user?.id);

      // Verificar se as permissões foram concedidas
      const { status } = await Notifications.getPermissionsAsync();
      console.log('[DeviceToken] Status das permissões:', status);

      if (status !== 'granted') {
        console.log('[DeviceToken] Permissões não concedidas');
        setDeviceToken(null);
        setIsLoading(false);
        return;
      }

      // Tentar obter token do dispositivo
      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;
      console.log('[DeviceToken] Token obtido do dispositivo:', token.substring(0, 20) + '...');

      const deviceTokenData: DeviceToken = {
        token,
        platform: Platform.OS as 'ios' | 'android',
        userId: user?.id || '', // Usar user ID se disponível
      };

      setDeviceToken(deviceTokenData);
      console.log('[DeviceToken] Token definido no state:', deviceTokenData);
    } catch (error: any) {
      console.error('[DeviceToken] Erro ao carregar token existente:', error);
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
        console.log('[DeviceToken] Permissões não concedidas, pulando obtenção do token');
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
      console.log('[DeviceToken] Token obtido:', token.substring(0, 20) + '...');

      return deviceTokenData;
    } catch (error: any) {
      console.error('[DeviceToken] Erro ao obter token:', error);
      setError(error.message || 'Erro ao obter token do dispositivo');
      return null;
    }
  };

  // Registrar token no backend
  const registerToken = async (tokenData: DeviceToken, userId: string) => {
    if (!tokenData) {
      console.warn('[DeviceToken] Nenhum token fornecido para registrar');
      return false;
    }

    try {
      const tokenWithUser = { ...tokenData, userId };
      setDeviceToken(tokenWithUser);

      const response = await notificationService.registerDeviceToken(tokenWithUser);

      console.log('[DeviceToken] Token registrado com sucesso no backend');
      return true;
    } catch (error: any) {
      console.error('[DeviceToken] Erro ao registrar token:', error.message || error);
      setError(error.message || 'Erro ao registrar token');
      return false;
    }
  };

  // Limpar token (logout)
  const clearToken = () => {
    setDeviceToken(null);
    setError(null);
    console.log('[DeviceToken] Token limpo');
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

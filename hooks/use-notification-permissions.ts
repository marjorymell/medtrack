import { useState, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { NotificationPermissionStatus } from '../types/notification';

/**
 * Hook para gerenciar permissões de notificação
 */
export function useNotificationPermissions() {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermissionStatus>({
    granted: false,
    canAskAgain: true,
    status: 'undetermined',
  });
  const [isLoading, setIsLoading] = useState(true);

  // Verificar status atual das permissões
  const checkPermissions = async () => {
    try {
      console.log('[NotificationPermissions] Verificando status das permissões...');
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      const granted = existingStatus === 'granted';

      console.log('[NotificationPermissions] Status obtido:', existingStatus, 'Granted:', granted);

      setPermissionStatus({
        granted,
        canAskAgain: existingStatus !== 'denied',
        status: existingStatus,
      });
    } catch (error) {
      console.error('[NotificationPermissions] Erro ao verificar permissões:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Solicitar permissões
  const requestPermissions = async () => {
    try {
      setIsLoading(true);

      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowCriticalAlerts: true,
          allowProvisional: false,
        },
        android: {},
      });

      const granted = status === 'granted';
      const canAskAgain = status !== 'denied';

      setPermissionStatus({
        granted,
        canAskAgain,
        status,
      });

      return { granted, canAskAgain, status };
    } catch (error) {
      console.error('[Notifications] Erro ao solicitar permissões:', error);
      return { granted: false, canAskAgain: false, status: 'denied' as const };
    } finally {
      setIsLoading(false);
    }
  };

  // Verificar permissões automaticamente quando o hook é inicializado
  useEffect(() => {
    console.log('[NotificationPermissions] Hook inicializado, verificando permissões...');
    checkPermissions();
  }, []);

  return {
    permissionStatus,
    isLoading,
    checkPermissions,
    requestPermissions,
  };
}

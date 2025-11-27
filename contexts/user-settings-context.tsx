import { createContext, Dispatch, SetStateAction, useContext, useEffect } from 'react';
import { useState } from 'react';
import type { NotificationSettings } from '../types/notification'
import { notificationService } from '@/lib/services/notification-service';
import { Alert } from 'react-native';
import { useNotificationPermissions } from '@/hooks/use-notification-permissions';
import { useAuth } from './auth-context';

interface UserSettingsContextType {
  settings: NotificationSettings
  setSettings: Dispatch<SetStateAction<NotificationSettings>>;
  updateSetting: <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => Promise<void>;
  isLoading: boolean;
  enablePush: (value: boolean) => Promise<void>;
}

const UserSettingsContext = createContext<UserSettingsContextType | undefined>(undefined);

export const useUserSettings = () => {
  const context = useContext(UserSettingsContext);
  if (context === undefined) throw new Error(
    "useUserSettings must be used withing a UserSettingsProvider"
  );
  return context;
}

interface UserSettingsProviderProps {
  children: React.ReactNode;
}

export function UserSettingsProvider({ children }: UserSettingsProviderProps) {
  const [settings, setSettings] = useState<NotificationSettings>({
    enablePush: false,
    enableEmail: false,
    reminderBefore: 0,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { permissionStatus, requestPermissions } = useNotificationPermissions();
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    notificationService.getNotificationSettings()
      .then((data) => {
        console.info(`[UserSettingsProvider] Configurações do usuário definidas com sucesso!`);
        setSettings(data);
      })
      .catch((error) => {
        console.error(`[UserSettingsProvider] Não foi possível buscar informações do usuário!`, error);
      }).finally(() => setIsLoading(false));
  }, [token])

  const updateSettings = async <K extends keyof NotificationSettings>(key: K, value: NotificationSettings[K]) => {
    const newSettings = { ...settings, [key]: value };

    try {
      setIsLoading(true);

      await notificationService.updateNotificationSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error(`Erro ao atualizar ${String(key)}:`, error);

      if (settings === newSettings) setSettings((prev) => prev);
      Alert.alert('Erro', 'Não foi possível salvar a configuração. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }

  const enablePush = async (value: boolean) => {
    const newSettings: NotificationSettings = { ...settings, enablePush: value };

    try {
      setIsLoading(true);
      if (!permissionStatus.granted) {
        const newPermission = await requestPermissions();
        console.info(`[UserSettingsProvider] permission - ${newPermission.granted}`)

        if (!newPermission.granted) {
          Alert.alert(
            'Permissões necessárias',
            'Para receber notificações, permita o acesso nas configurações do dispositivo.'
          );
          throw new Error("Não foi possível ativar as notificações");
        }
      }

      await notificationService.updateNotificationSettings(newSettings)
      setSettings(newSettings);
    } catch (error) {
      console.error(`[UserSettingsProvider] Erro ao ativar notificações: `, error);
      if (settings === newSettings) setSettings((prev) => prev);

      Alert.alert('Erro', 'Não foi possível salvar a configuração. Tente novamente.');
    } finally {
      console.log(`[UserSettingsProvider] enablePush - Notificações ligadas com sucesso!`);
      setIsLoading(false);
    }
  }

  return (
    <UserSettingsContext.Provider
      value={{ settings, setSettings, updateSetting: updateSettings, isLoading, enablePush }}
    >
      {children}
    </UserSettingsContext.Provider>
  )
}


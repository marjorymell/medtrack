import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { NotificationSettings } from '@/types/notification';
import { notificationService } from '@/lib/services/notification-service';
import { showToast } from '@/utils/toast';
import { useAuth } from '@/contexts/auth-context';
import { ApiResponse } from '@/types/api';

export function useNotificationSettings() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Query para buscar configurações de notificação
  const {
    data: settings,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const response = await notificationService.getNotificationSettings();
      return response;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutation para atualizar configurações
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: NotificationSettings) => {
      // Converter null para undefined para compatibilidade com a API
      const apiSettings = {
        ...newSettings,
        quietHoursStart: newSettings.quietHoursStart || undefined,
        quietHoursEnd: newSettings.quietHoursEnd || undefined,
      };
      return await notificationService.updateNotificationSettings(apiSettings);
    },
    onSuccess: (_response: ApiResponse<NotificationSettings>, variables: NotificationSettings) => {
      // Atualizar cache com novas configurações
      queryClient.setQueryData(['notification-settings'], variables);
      showToast('Configurações atualizadas com sucesso', 'success');
    },
    onError: (err: any) => {
      showToast('Erro ao atualizar configurações', 'error');
    },
  });

  // Mutation para registrar token do dispositivo
  const registerDeviceTokenMutation = useMutation({
    mutationFn: async (deviceToken: {
      token: string;
      platform: 'ios' | 'android';
      userId: string;
    }) => {
      return await notificationService.registerDeviceToken(deviceToken);
    },
    onSuccess: () => {
      showToast('Dispositivo registrado para notificações', 'success');
    },
    onError: (err: any) => {
      showToast('Erro ao registrar dispositivo', 'error');
    },
  });

  // Função wrapper para manter compatibilidade
  const updateSettings = async (newSettings: NotificationSettings) => {
    return updateSettingsMutation.mutateAsync(newSettings);
  };

  const registerDeviceToken = async (deviceToken: {
    token: string;
    platform: 'ios' | 'android';
    userId: string;
  }) => {
    return registerDeviceTokenMutation.mutateAsync(deviceToken);
  };

  return {
    settings,
    isLoading,
    error: error?.message || null,
    refetch,
    updateSettings,
    registerDeviceToken,
    // Estados das mutations para feedback na UI
    isUpdating: updateSettingsMutation.isPending,
    isRegisteringDevice: registerDeviceTokenMutation.isPending,
  };
}

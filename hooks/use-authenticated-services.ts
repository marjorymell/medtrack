import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth-context';
import { notificationService } from '@/lib/services/notification-service';
import { medicationService } from '@/lib/services/medication-service';
import { historyService } from '@/lib/services/history-service';
import { HistoryAction } from '@/types/history';
import { showToast } from '@/utils/toast';

/**
 * Hook que fornece serviços autenticados com mutations do TanStack Query
 */
export function useAuthenticatedServices() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Mutation para confirmar medicamento
  const confirmMedicationMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      const result = await historyService.confirmMedication(scheduleId);
      if (!result.success) {
        throw new Error(result.error?.message || 'Erro ao confirmar medicamento');
      }
      return result;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['today-medications'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
      showToast('Medicamento confirmado com sucesso!', 'success');
    },
    onError: (err: any) => {
      showToast('Não foi possível confirmar o medicamento', 'error');
    },
  });

  // Mutation para adiar medicamento
  const postponeMedicationMutation = useMutation({
    mutationFn: async ({
      scheduleId,
      minutes,
      scheduledFor,
    }: {
      scheduleId: string;
      minutes?: number;
      scheduledFor?: string;
    }) => {
      const result = await historyService.postponeMedication(
        scheduleId,
        minutes || 30,
        scheduledFor
      );
      if (!result.success) {
        throw new Error(result.error?.message || 'Erro ao adiar medicamento');
      }
      return result;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['today-medications'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['history'] });
    },
    onError: (err: any) => {
      showToast('Não foi possível adiar o medicamento', 'error');
    },
  });

  // Mutation para registrar token do dispositivo
  const registerDeviceTokenMutation = useMutation({
    mutationFn: async (deviceToken: any) => {
      return await notificationService.registerDeviceToken(deviceToken);
    },
    onSuccess: () => {
      showToast('Dispositivo registrado para notificações', 'success');
    },
    onError: (err: any) => {
      showToast('Erro ao registrar dispositivo', 'error');
    },
  });

  // Mutation para agendar notificação
  const scheduleNotificationMutation = useMutation({
    mutationFn: async (request: any) => {
      return await notificationService.scheduleNotification(request);
    },
    onSuccess: () => {
      showToast('Notificação agendada com sucesso', 'success');
    },
    onError: (err: any) => {
      showToast('Erro ao agendar notificação', 'error');
    },
  });

  // Mutation para cancelar notificação
  const cancelNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      return await notificationService.cancelNotification(notificationId);
    },
    onSuccess: () => {
      showToast('Notificação cancelada com sucesso', 'success');
    },
    onError: (err: any) => {
      showToast('Erro ao cancelar notificação', 'error');
    },
  });

  // Mutation para atualizar configurações de notificação
  const updateNotificationSettingsMutation = useMutation({
    mutationFn: async (settings: any) => {
      return await notificationService.updateNotificationSettings(settings);
    },
    onSuccess: () => {
      // Invalidar query de configurações
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      showToast('Configurações atualizadas com sucesso', 'success');
    },
    onError: (err: any) => {
      showToast('Erro ao atualizar configurações', 'error');
    },
  });

  return {
    medicationService: {
      getTodayMedications: () => medicationService.getTodayMedications(),
      confirmMedication: (scheduleId: string) => confirmMedicationMutation.mutateAsync(scheduleId),
      postponeMedication: (scheduleId: string, minutes?: number, scheduledFor?: string) =>
        postponeMedicationMutation.mutateAsync({ scheduleId, minutes, scheduledFor }),
    },
    historyService: {
      getMyHistory: (startDate?: string, endDate?: string) =>
        historyService.getMyHistory({ startDate, endDate }),
      getRecentHistory: (days?: number) => historyService.getRecentHistory(days),
      getAdherenceStats: (medicationId: string, startDate?: string, endDate?: string) =>
        historyService.getAdherenceStats(medicationId, startDate, endDate),
    },
    notificationService: {
      registerDeviceToken: (deviceToken: any) =>
        registerDeviceTokenMutation.mutateAsync(deviceToken),
      scheduleNotification: (request: any) => scheduleNotificationMutation.mutateAsync(request),
      cancelNotification: (notificationId: string) =>
        cancelNotificationMutation.mutateAsync(notificationId),
      updateNotificationSettings: (settings: any) =>
        updateNotificationSettingsMutation.mutateAsync(settings),
    },
    // Estados das mutations para feedback na UI
    isConfirmingMedication: confirmMedicationMutation.isPending,
    isPostponingMedication: postponeMedicationMutation.isPending,
    isRegisteringDevice: registerDeviceTokenMutation.isPending,
    isSchedulingNotification: scheduleNotificationMutation.isPending,
    isCancelingNotification: cancelNotificationMutation.isPending,
    isUpdatingSettings: updateNotificationSettingsMutation.isPending,
  };
}

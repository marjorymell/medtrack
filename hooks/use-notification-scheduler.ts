import { useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { ScheduledNotification, ScheduleNotificationRequest } from '../types/notification';
import { notificationService } from '../services/notification-service';

/**
 * Hook para agendar notificações de medicamentos
 */
export function useNotificationScheduler() {
  const [scheduledNotifications, setScheduledNotifications] = useState<ScheduledNotification[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Agendar notificação local para medicamento
   */
  const scheduleMedicationNotification = useCallback(
    async (
      medicationId: string,
      scheduleId: string,
      medicationName: string,
      dosage: string,
      scheduledTime: Date,
      reminderBefore: number = 0 // minutos antes do horário
    ): Promise<string | null> => {
      try {
        setIsScheduling(true);
        setError(null);

        // Calcular horário do lembrete
        const reminderTime = new Date(scheduledTime.getTime() - reminderBefore * 60 * 1000);

        // Verificar se o horário já passou
        if (reminderTime <= new Date()) {
          console.warn('[NotificationScheduler] Horário já passou, pulando agendamento');
          return null;
        }

        // Criar conteúdo da notificação
        const notificationContent: Notifications.NotificationContentInput = {
          title: `Lembrete: ${medicationName}`,
          body: `Hora de tomar ${dosage} de ${medicationName}`,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: {
            medicationId,
            scheduleId,
            type: 'medication_reminder',
            scheduledTime: scheduledTime.toISOString(),
          },
        };

        // Agendar notificação local
        const notificationId = await Notifications.scheduleNotificationAsync({
          content: notificationContent,
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: reminderTime,
          },
        });

        // Criar objeto de notificação agendada
        const scheduledNotification: ScheduledNotification = {
          id: notificationId,
          medicationId,
          scheduleId,
          scheduledTime,
          notificationId,
        };

        // Adicionar à lista
        setScheduledNotifications((prev) => [...prev, scheduledNotification]);

        console.log(
          `[NotificationScheduler] Notificação agendada: ${medicationName} às ${scheduledTime.toLocaleTimeString()}`
        );

        // Tentar agendar também no backend (se disponível)
        try {
          const backendRequest: ScheduleNotificationRequest = {
            medicationId,
            scheduleId,
            scheduledTime: scheduledTime.toISOString(),
            medicationName,
            dosage,
          };

          await notificationService.scheduleNotification(backendRequest);
          console.log('[NotificationScheduler] Notificação também agendada no backend');
        } catch (backendError) {
          console.warn(
            '[NotificationScheduler] Backend não disponível, mantendo apenas local:',
            backendError
          );
        }

        return notificationId;
      } catch (error: any) {
        console.error('[NotificationScheduler] Erro ao agendar notificação:', error);
        setError(error.message || 'Erro ao agendar notificação');
        return null;
      } finally {
        setIsScheduling(false);
      }
    },
    []
  );

  /**
   * Cancelar notificação específica
   */
  const cancelNotification = useCallback(async (notificationId: string): Promise<boolean> => {
    try {
      setError(null);

      // Cancelar notificação local
      await Notifications.cancelScheduledNotificationAsync(notificationId);

      // Remover da lista
      setScheduledNotifications((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );

      console.log(`[NotificationScheduler] Notificação cancelada: ${notificationId}`);

      // Tentar cancelar no backend também
      try {
        await notificationService.cancelNotification(notificationId);
        console.log('[NotificationScheduler] Notificação cancelada no backend');
      } catch (backendError) {
        console.warn('[NotificationScheduler] Erro ao cancelar no backend:', backendError);
      }

      return true;
    } catch (error: any) {
      console.error('[NotificationScheduler] Erro ao cancelar notificação:', error);
      setError(error.message || 'Erro ao cancelar notificação');
      return false;
    }
  }, []);

  /**
   * Cancelar todas as notificações de um medicamento
   */
  const cancelMedicationNotifications = useCallback(
    async (medicationId: string): Promise<boolean> => {
      try {
        setError(null);

        // Encontrar notificações do medicamento
        const medicationNotifications = scheduledNotifications.filter(
          (notification) => notification.medicationId === medicationId
        );

        // Cancelar cada uma
        const cancelPromises = medicationNotifications.map((notification) =>
          cancelNotification(notification.id)
        );

        await Promise.all(cancelPromises);

        console.log(
          `[NotificationScheduler] Todas as notificações do medicamento ${medicationId} foram canceladas`
        );
        return true;
      } catch (error: any) {
        console.error(
          '[NotificationScheduler] Erro ao cancelar notificações do medicamento:',
          error
        );
        setError(error.message || 'Erro ao cancelar notificações');
        return false;
      }
    },
    [scheduledNotifications, cancelNotification]
  );

  /**
   * Reagendar notificações após mudança de horário
   */
  const rescheduleMedicationNotifications = useCallback(
    async (
      medicationId: string,
      scheduleId: string,
      medicationName: string,
      dosage: string,
      newSchedule: Date[],
      reminderBefore: number = 0
    ): Promise<boolean> => {
      try {
        setError(null);

        // Cancelar notificações existentes
        await cancelMedicationNotifications(medicationId);

        // Agendar novas notificações
        const schedulePromises = newSchedule.map((time) =>
          scheduleMedicationNotification(
            medicationId,
            scheduleId,
            medicationName,
            dosage,
            time,
            reminderBefore
          )
        );

        const results = await Promise.all(schedulePromises);
        const successCount = results.filter((id) => id !== null).length;

        console.log(
          `[NotificationScheduler] Reagendadas ${successCount}/${newSchedule.length} notificações para ${medicationName}`
        );
        return successCount > 0;
      } catch (error: any) {
        console.error('[NotificationScheduler] Erro ao reagendar notificações:', error);
        setError(error.message || 'Erro ao reagendar notificações');
        return false;
      }
    },
    [cancelMedicationNotifications, scheduleMedicationNotification]
  );

  /**
   * Obter notificações agendadas
   */
  const getScheduledNotifications = useCallback(async (): Promise<ScheduledNotification[]> => {
    try {
      // Obter notificações agendadas do sistema
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();

      // Mapear para nosso formato
      const notifications: ScheduledNotification[] = scheduled.map((notification) => ({
        id: notification.identifier,
        medicationId: (notification.content.data?.medicationId as string) || '',
        scheduleId: (notification.content.data?.scheduleId as string) || '',
        scheduledTime: new Date((notification.trigger as any).date || Date.now()),
        notificationId: notification.identifier,
      }));

      setScheduledNotifications(notifications);
      return notifications;
    } catch (error: any) {
      console.error('[NotificationScheduler] Erro ao obter notificações agendadas:', error);
      return [];
    }
  }, []);

  return {
    scheduledNotifications,
    isScheduling,
    error,
    scheduleMedicationNotification,
    cancelNotification,
    cancelMedicationNotifications,
    rescheduleMedicationNotifications,
    getScheduledNotifications,
  };
}

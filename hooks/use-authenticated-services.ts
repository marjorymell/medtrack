import { useAuth } from '@/contexts/auth-context';
import { notificationService } from '@/services/notification-service';
import { medicationService } from '@/lib/services/medication-service';

/**
 * Hook que fornece serviços autenticados com token JWT automático
 */
export function useAuthenticatedServices() {
  const { token } = useAuth();

  return {
    notificationService: {
      registerDeviceToken: (deviceToken: any) =>
        notificationService.registerDeviceToken(deviceToken),

      scheduleNotification: (request: any) => notificationService.scheduleNotification(request),

      cancelNotification: (notificationId: string) =>
        notificationService.cancelNotification(notificationId),

      updateNotificationSettings: (settings: any) =>
        notificationService.updateNotificationSettings(settings),
    },
    medicationService: {
      getTodayMedications: () => medicationService.getTodayMedications(),

      confirmMedication: (scheduleId: string) => medicationService.confirmMedication(scheduleId),

      postponeMedication: (scheduleId: string, minutes?: number) =>
        medicationService.postponeMedication(scheduleId, minutes),

      getMedicationHistory: (startDate?: string, endDate?: string) =>
        medicationService.getMedicationHistory(startDate, endDate),

      getAdherenceRate: (days?: number) => medicationService.getAdherenceRate(days),
    },
  };
}

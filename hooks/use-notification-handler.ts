import { useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { Subscription } from 'expo-notifications';
import { NotificationData } from '@/types/notification';

/**
 * Hook para gerenciar notificações recebidas e interações do usuário
 */
export function useNotificationHandler(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onNotificationResponse?: (response: Notifications.NotificationResponse) => void
) {
  const notificationListener = useRef<Subscription | null>(null);
  const responseListener = useRef<Subscription | null>(null);

  useEffect(() => {
    // Configurar como as notificações são exibidas quando o app está em foreground
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });

    // Listener para notificações recebidas
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    // Listener para respostas/interações do usuário
    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      if (onNotificationResponse) {
        onNotificationResponse(response);
      }

      // Processar ação baseada no tipo de notificação
      const notificationData = response.notification.request.content.data as any;
      const data = notificationData as NotificationData;

      if (notificationData?.type === 'medication_reminder') {
        handleMedicationReminderResponse(response, data);
      }
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [onNotificationReceived, onNotificationResponse]);

  /**
   * Processar resposta de lembrete de medicamento
   */
  const handleMedicationReminderResponse = (
    response: Notifications.NotificationResponse,
    data: NotificationData
  ) => {
    const actionIdentifier = response.actionIdentifier;

    switch (actionIdentifier) {
      case Notifications.DEFAULT_ACTION_IDENTIFIER:
        // Usuário tocou na notificação (ação padrão)// Aqui você pode navegar para a tela de confirmação de dose
        break;

      case 'TAKE_DOSE':
        // Usuário confirmou que tomou a dose

        // Aqui você pode registrar a dose tomada
        break;

      case 'SNOOZE':
        // Usuário adiou o lembrete

        // Aqui você pode reagendar a notificação
        break;

      default:
    }
  };

  /**
   * Criar categoria de ações para notificações de medicamento
   */
  const setupMedicationNotificationCategory = async () => {
    try {
      await Notifications.setNotificationCategoryAsync('medication_reminder', [
        {
          identifier: 'TAKE_DOSE',
          buttonTitle: 'Confirmar Dose',
          options: {
            opensAppToForeground: true,
          },
        },
        {
          identifier: 'SNOOZE',
          buttonTitle: 'Lembrar Depois',
          options: {
            opensAppToForeground: false,
          },
        },
      ]);
    } catch (error) {}
  };

  /**
   * Limpar todas as notificações
   */
  const clearAllNotifications = async () => {
    try {
      await Notifications.dismissAllNotificationsAsync();
    } catch (error) {}
  };

  /**
   * Obter notificações apresentadas
   */
  const getPresentedNotifications = async (): Promise<Notifications.Notification[]> => {
    try {
      const notifications = await Notifications.getPresentedNotificationsAsync();
      return notifications;
    } catch (error) {
      return [];
    }
  };

  return {
    setupMedicationNotificationCategory,
    clearAllNotifications,
    getPresentedNotifications,
  };
}

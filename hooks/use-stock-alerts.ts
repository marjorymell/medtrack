import { useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { medicationService } from '@/lib/services/medication-service';
import { useAuth } from '@/contexts/auth-context';
import { showToast } from '@/utils/toast';

/**
 * Hook para gerenciar alertas automáticos de estoque
 */
export function useStockAlerts() {
  const { token } = useAuth();

  /**
   * Verifica medicamentos com estoque baixo e mostra alertas
   */
  const checkLowStockAlerts = useCallback(async () => {
    if (!token) return;

    try {
      // Buscar medicamentos com estoque baixo (threshold = 5)
      const lowStockResponse = await medicationService.getLowStockMedications(5);

      if (lowStockResponse.success && lowStockResponse.data && lowStockResponse.data.length > 0) {
        const lowStockMeds = lowStockResponse.data;

        // Mostrar toast para cada medicamento com estoque baixo
        lowStockMeds.forEach((med: any) => {
          if (med.stock > 0 && med.stock <= 5) {
            showToast(`${med.name}: Apenas ${med.stock} unidades restantes`, 'error');
          }
        });
      }

      // Buscar medicamentos sem estoque
      const outOfStockResponse = await medicationService.getOutOfStockMedications();

      if (
        outOfStockResponse.success &&
        outOfStockResponse.data &&
        outOfStockResponse.data.length > 0
      ) {
        const outOfStockMeds = outOfStockResponse.data;

        // Mostrar toast para cada medicamento sem estoque
        outOfStockMeds.forEach((med: any) => {
          showToast(`${med.name}: Estoque esgotado!`, 'error');
        });
      }
    } catch (error) {

    }
  }, [token]);

  /**
   * Agenda notificações locais para alertas de estoque
   */
  const scheduleStockNotifications = useCallback(async () => {
    if (!token) return;

    try {
      // Cancelar notificações anteriores de estoque
      await Notifications.cancelScheduledNotificationAsync('stock-alert-low');
      await Notifications.cancelScheduledNotificationAsync('stock-alert-out');

      // Buscar medicamentos com alertas
      const [lowStockResponse, outOfStockResponse] = await Promise.all([
        medicationService.getLowStockMedications(5),
        medicationService.getOutOfStockMedications(),
      ]);

      const alerts: string[] = [];

      if (lowStockResponse.success && lowStockResponse.data) {
        const lowStockMeds = lowStockResponse.data.filter(
          (med: any) => med.stock > 0 && med.stock <= 5
        );
        if (lowStockMeds.length > 0) {
          alerts.push(`${lowStockMeds.length} medicamento(s) com estoque baixo`);
        }
      }

      if (outOfStockResponse.success && outOfStockResponse.data) {
        const outOfStockMeds = outOfStockResponse.data;
        if (outOfStockMeds.length > 0) {
          alerts.push(`${outOfStockMeds.length} medicamento(s) sem estoque`);
        }
      }

      if (alerts.length > 0) {
        // Agendar notificação local para amanhã às 9:00
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(9, 0, 0, 0);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Alerta de Estoque',
            body: alerts.join('. '),
            sound: 'default',
            priority: Notifications.AndroidNotificationPriority.DEFAULT,
            data: {
              type: 'stock_alert',
              timestamp: new Date().toISOString(),
            },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: tomorrow,
          },
        });


      }
    } catch (error) {

    }
  }, [token]);

  /**
   * Verifica alertas quando a tela ganha foco
   */
  useFocusEffect(
    useCallback(() => {
      checkLowStockAlerts();
    }, [checkLowStockAlerts])
  );

  /**
   * Agenda verificações periódicas de estoque
   */
  useEffect(() => {
    // Verificar alertas a cada 30 minutos quando o app está em foreground
    const interval = setInterval(
      () => {
        checkLowStockAlerts();
      },
      30 * 60 * 1000
    ); // 30 minutos

    return () => clearInterval(interval);
  }, [checkLowStockAlerts]);

  /**
   * Agenda notificações diárias ao inicializar
   */
  useEffect(() => {
    scheduleStockNotifications();

    // Re-agendar notificações diariamente
    const dailyInterval = setInterval(
      () => {
        scheduleStockNotifications();
      },
      24 * 60 * 60 * 1000
    ); // 24 horas

    return () => clearInterval(dailyInterval);
  }, [scheduleStockNotifications]);

  return {
    checkLowStockAlerts,
    scheduleStockNotifications,
  };
}

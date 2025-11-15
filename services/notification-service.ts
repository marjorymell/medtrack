import {
  DeviceToken,
  RegisterDeviceResponse,
  ScheduleNotificationRequest,
  ScheduleNotificationResponse,
} from '../types/notification';
import { ApiService } from '@/lib/services/api-service';

/**
 * Serviço para integração com APIs de notificação do backend
 */
class NotificationService extends ApiService {
  constructor() {
    super();
  }

  /**
   * Registrar token do dispositivo no backend
   */
  async registerDeviceToken(deviceToken: DeviceToken): Promise<RegisterDeviceResponse> {
    try {
      console.log('[NotificationService] Registrando token no backend...');

      const response = await this.post<RegisterDeviceResponse>('/notifications/register-device', {
        token: deviceToken.token,
        platform: deviceToken.platform,
      });

      console.log('[NotificationService] Token registrado com sucesso');
      return response.data!;
    } catch (error: any) {
      console.error('[NotificationService] Erro ao registrar token:', error);
      throw error;
    }
  }

  /**
   * Agendar notificação no backend
   */
  async scheduleNotification(
    request: ScheduleNotificationRequest
  ): Promise<ScheduleNotificationResponse> {
    try {
      console.log('[NotificationService] Agendando notificação:', request.medicationName);

      const response = await this.post<ScheduleNotificationResponse>(
        '/notifications/schedule',
        request
      );

      console.log('[NotificationService] Notificação agendada:', response.data?.notificationId);
      return response.data!;
    } catch (error: any) {
      console.error('[NotificationService] Erro ao agendar notificação:', error);
      throw error;
    }
  }

  /**
   * Cancelar notificação agendada
   */
  async cancelNotification(notificationId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('[NotificationService] Cancelando notificação:', notificationId);

      const response = await this.delete<{ success: boolean; message: string }>(
        `/notifications/cancel/${notificationId}`
      );

      console.log('[NotificationService] Notificação cancelada');
      return response.data!;
    } catch (error: any) {
      console.error('[NotificationService] Erro ao cancelar notificação:', error);
      throw error;
    }
  }

  /**
   * Atualizar configurações de notificação do usuário
   */
  async updateNotificationSettings(settings: {
    enablePush: boolean;
    enableEmail: boolean;
    reminderBefore: number;
    quietHoursStart?: string;
    quietHoursEnd?: string;
  }): Promise<{ success: boolean; message: string }> {
    try {
      console.log('[NotificationService] Atualizando configurações...');

      const response = await this.put<{ success: boolean; message: string }>(
        '/notifications/settings',
        settings
      );

      console.log('[NotificationService] Configurações atualizadas');
      return response.data!;
    } catch (error: any) {
      console.error('[NotificationService] Erro ao atualizar configurações:', error);
      throw error;
    }
  }

  /**
   * Buscar configurações de notificação do usuário
   */
  async getNotificationSettings(): Promise<{
    enablePush: boolean;
    enableEmail: boolean;
    reminderBefore: number;
    quietHoursStart: string | null;
    quietHoursEnd: string | null;
  }> {
    try {
      console.log('[NotificationService] Buscando configurações...');
      console.log('[NotificationService] Fazendo GET para /notifications/settings');

      const response = await this.get<{
        settings: {
          enablePush: boolean;
          enableEmail: boolean;
          reminderBefore: number;
          quietHoursStart: string | null;
          quietHoursEnd: string | null;
        };
      }>('/notifications/settings');

      console.log('[NotificationService] Resposta completa da API:', response);
      console.log('[NotificationService] Dados da resposta:', response.data);
      console.log('[NotificationService] Configurações retornadas:', response.data!.settings);

      return response.data!.settings;
    } catch (error: any) {
      console.error('[NotificationService] Erro ao buscar configurações:', error);
      console.error(
        '[NotificationService] Detalhes do erro:',
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

// Exporta uma instância singleton
export const notificationService = new NotificationService();

// Exporta também a classe para casos de uso avançados
export default NotificationService;

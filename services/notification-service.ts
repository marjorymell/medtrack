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


      const response = await this.post<RegisterDeviceResponse>('/notifications/register-device', {
        token: deviceToken.token,
        platform: deviceToken.platform,
      });


      return response.data!;
    } catch (error: any) {

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


      const response = await this.post<ScheduleNotificationResponse>(
        '/notifications/schedule',
        request
      );


      return response.data!;
    } catch (error: any) {

      throw error;
    }
  }

  /**
   * Cancelar notificação agendada
   */
  async cancelNotification(notificationId: string): Promise<{ success: boolean; message: string }> {
    try {


      const response = await this.delete<{ success: boolean; message: string }>(
        `/notifications/cancel/${notificationId}`
      );


      return response.data!;
    } catch (error: any) {

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


      const response = await this.put<{ success: boolean; message: string }>(
        '/notifications/settings',
        settings
      );


      return response.data!;
    } catch (error: any) {

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



      const response = await this.get<{
        settings: {
          enablePush: boolean;
          enableEmail: boolean;
          reminderBefore: number;
          quietHoursStart: string | null;
          quietHoursEnd: string | null;
        };
      }>('/notifications/settings');





      return response.data!.settings;
    } catch (error: any) {
      throw error;
    }
  }
}

// Exporta uma instância singleton
export const notificationService = new NotificationService();

// Exporta também a classe para casos de uso avançados
export default NotificationService;

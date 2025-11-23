import { ApiService } from './api-service';
import {
  NotificationSettings,
  DeviceToken,
  RegisterDeviceRequest,
  RegisterDeviceResponse,
  ScheduleNotificationRequest,
  ScheduleNotificationResponse,
} from '@/types/notification';
import { ApiResponse } from '@/types/api';

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
  async registerDeviceToken(deviceToken: RegisterDeviceRequest): Promise<RegisterDeviceResponse> {
    try {
      const response = await this.post<DeviceToken>('/notifications/register-device', deviceToken);

      return {
        success: response.success,
        message: response.error?.message || 'Dispositivo registrado com sucesso',
      };
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
      const response = await this.post<any>('/notifications/schedule', request);

      return {
        success: response.success,
        notificationId: response.data?.notificationId,
        message: response.error?.message || 'Notificação agendada com sucesso',
      };
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Cancelar notificação agendada
   */
  async cancelNotification(notificationId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.delete<void>(`/notifications/cancel/${notificationId}`);

      return response;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Atualizar configurações de notificação do usuário
   */
  async updateNotificationSettings(
    settings: Partial<NotificationSettings>
  ): Promise<NotificationSettings> {
    try {
      const response = await this.put<NotificationSettings>('/notifications/settings', settings);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.error?.message || 'Erro ao atualizar configurações');
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Buscar configurações de notificação do usuário
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await this.get<{ settings: NotificationSettings }>(
        '/notifications/settings'
      );

      if (response.success && response.data) {
        return response.data.settings;
      }

      throw new Error(response.error?.message || 'Erro ao buscar configurações');
    } catch (error: any) {
      throw error;
    }
  }
}

// Exporta uma instância singleton
export const notificationService = new NotificationService();

// Exporta também a classe para casos de uso avançados
export default NotificationService;

import { ApiResponse } from '@/types/api';
import { Schedule, CreateScheduleData, UpdateScheduleData } from '@/types/schedule';
import { ApiService } from './api-service';
import { SyncResponse } from '@/types/sync';

/**
 * Serviço para gerenciamento de agendamentos (schedules)
 * Integra com o módulo schedules do backend
 */
class ScheduleService extends ApiService {
  constructor() {
    super();
  }

  async getSyncData(): Promise<ApiResponse<SyncResponse>> {
    try {
      const response = await this.get<SyncResponse>('/schedules/sync');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca todos os agendamentos de um medicamento
   * GET /api/schedules/medication/:medicationId
   */
  async getSchedulesByMedication(
    medicationId: string,
    isActive?: boolean
  ): Promise<ApiResponse<Schedule[]>> {
    try {
      const params = isActive !== undefined ? `?isActive=${isActive}` : '';
      const response = await this.get<Schedule[]>(`/schedules/medication/${medicationId}${params}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca todos os agendamentos dos medicamentos de um usuário
   * GET /api/schedules/user/:userId
   */
  async getSchedulesByUser(userId: string, isActive?: boolean): Promise<ApiResponse<Schedule[]>> {
    try {
      const params = isActive !== undefined ? `?isActive=${isActive}` : '';
      const response = await this.get<Schedule[]>(`/schedules/user/${userId}${params}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca um agendamento específico por ID
   * GET /api/schedules/:id
   */
  async getScheduleById(scheduleId: string): Promise<ApiResponse<Schedule>> {
    try {
      const response = await this.get<Schedule>(`/schedules/${scheduleId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cria um agendamento customizado
   * POST /api/schedules
   */
  async createCustomSchedule(data: CreateScheduleData): Promise<ApiResponse<Schedule>> {
    try {
      const response = await this.post<Schedule>('/schedules', data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza um agendamento existente
   * PATCH /api/schedules/:id
   */
  async updateSchedule(
    scheduleId: string,
    data: UpdateScheduleData
  ): Promise<ApiResponse<Schedule>> {
    try {
      const response = await this.patch<Schedule>(`/schedules/${scheduleId}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Ativa/desativa um agendamento
   * PATCH /api/schedules/:id/toggle
   */
  async toggleSchedule(scheduleId: string): Promise<ApiResponse<Schedule>> {
    try {
      const response = await this.patch<Schedule>(`/schedules/${scheduleId}/toggle`, {});
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deleta um agendamento
   * DELETE /api/schedules/:id
   */
  async deleteSchedule(scheduleId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.delete<void>(`/schedules/${scheduleId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca os agendamentos ativos de um medicamento
   * Alias conveniente para getSchedulesByMedication com isActive=true
   */
  async getActiveSchedules(medicationId: string): Promise<ApiResponse<Schedule[]>> {
    return this.getSchedulesByMedication(medicationId, true);
  }

  /**
   * Busca os agendamentos inativos de um medicamento
   * Alias conveniente para getSchedulesByMedication com isActive=false
   */
  async getInactiveSchedules(medicationId: string): Promise<ApiResponse<Schedule[]>> {
    return this.getSchedulesByMedication(medicationId, false);
  }
}

// Exporta uma instância singleton
export const scheduleService = new ScheduleService();

// Exporta também a classe para casos de uso avançados
export default ScheduleService;

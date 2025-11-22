import { ApiResponse } from '@/types/api';
import { MedicationHistory } from '@/types/medication';
import { HistoryAction, CreateHistoryInput, AdherenceStats, HistoryFilters } from '@/types/history';
import { ApiService } from './api-service';

/**
 * Serviço para gerenciamento de histórico de medicamentos
 * Segue a arquitetura modular do backend (módulo history separado)
 */
class HistoryService extends ApiService {
  constructor() {
    super();
  }

  /**
   * Cria um novo registro de histórico
   * POST /api/history
   *
   * @example
   * // Confirmar dose tomada
   * await historyService.createHistory({
   *   scheduleId: 'schedule_id',
   *   action: HistoryAction.TAKEN,
   *   quantity: 1,
   *   notes: 'Tomado com água'
   * });
   *
   * @example
   * // Adiar medicamento
   * await historyService.createHistory({
   *   scheduleId: 'schedule_id',
   *   action: HistoryAction.POSTPONED,
   *   postponedTo: new Date(Date.now() + 30*60*1000).toISOString()
   * });
   */
  async createHistory(data: CreateHistoryInput): Promise<ApiResponse<MedicationHistory>> {
    try {
      const response = await this.post<MedicationHistory>('/history', data);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca histórico do usuário autenticado
   * GET /api/history/me
   */
  async getMyHistory(filters?: HistoryFilters): Promise<ApiResponse<MedicationHistory[]>> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.action) params.append('action', filters.action);
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const endpoint = `/history/me?${params.toString()}`;
      const response = await this.get<MedicationHistory[]>(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca histórico de um medicamento específico
   * GET /api/history/medication/:medicationId
   */
  async getHistoryByMedication(
    medicationId: string,
    filters?: HistoryFilters
  ): Promise<ApiResponse<MedicationHistory[]>> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.action) params.append('action', filters.action);
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const endpoint = `/history/medication/${medicationId}?${params.toString()}`;
      const response = await this.get<MedicationHistory[]>(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca histórico de um usuário específico (admin)
   * GET /api/history/user/:userId
   */
  async getHistoryByUser(
    userId: string,
    filters?: HistoryFilters
  ): Promise<ApiResponse<MedicationHistory[]>> {
    try {
      const params = new URLSearchParams();
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      if (filters?.action) params.append('action', filters.action);
      if (filters?.limit) params.append('limit', filters.limit.toString());

      const endpoint = `/history/user/${userId}?${params.toString()}`;
      const response = await this.get<MedicationHistory[]>(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca um registro de histórico específico por ID
   * GET /api/history/:id
   */
  async getHistoryById(historyId: string): Promise<ApiResponse<MedicationHistory>> {
    try {
      const response = await this.get<MedicationHistory>(`/history/${historyId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deleta um registro de histórico
   * DELETE /api/history/:id
   */
  async deleteHistory(historyId: string): Promise<ApiResponse<{ message: string }>> {
    try {
      const response = await this.delete<{ message: string }>(`/history/${historyId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca estatísticas de adesão de um medicamento
   * GET /api/history/medication/:medicationId/adherence
   */
  async getAdherenceStats(
    medicationId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<AdherenceStats>> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const endpoint = `/history/medication/${medicationId}/adherence?${params.toString()}`;
      const response = await this.get<AdherenceStats>(endpoint);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ========== MÉTODOS DE CONVENIÊNCIA ==========

  /**
   * Confirma que uma dose foi tomada
   * Wrapper conveniente para createHistory com action=TAKEN
   */
  async confirmMedication(
    scheduleId: string,
    quantity: number = 1
  ): Promise<ApiResponse<MedicationHistory>> {
    return this.createHistory({
      scheduleId,
      action: HistoryAction.TAKEN,
      quantity,
      notes: `Confirmado em ${new Date().toLocaleString('pt-BR')}`,
    });
  }

  /**
   * Adia um medicamento para mais tarde
   * Wrapper conveniente para createHistory com action=POSTPONED
   */
  async postponeMedication(
    scheduleId: string,
    postponeMinutes: number = 30
  ): Promise<ApiResponse<MedicationHistory>> {
    const postponedTo = new Date();
    postponedTo.setMinutes(postponedTo.getMinutes() + postponeMinutes);

    return this.createHistory({
      scheduleId,
      action: HistoryAction.POSTPONED,
      postponedTo: postponedTo.toISOString(),
      notes: `Adiado por ${postponeMinutes} minutos`,
    });
  }

  /**
   * Marca medicamento como pulado
   * Wrapper conveniente para createHistory com action=SKIPPED
   */
  async skipMedication(
    scheduleId: string,
    reason?: string
  ): Promise<ApiResponse<MedicationHistory>> {
    return this.createHistory({
      scheduleId,
      action: HistoryAction.SKIPPED,
      notes: reason || 'Pulado pelo usuário',
    });
  }

  /**
   * Marca medicamento como perdido/esquecido
   * Wrapper conveniente para createHistory com action=MISSED
   */
  async markAsMissed(scheduleId: string): Promise<ApiResponse<MedicationHistory>> {
    return this.createHistory({
      scheduleId,
      action: HistoryAction.MISSED,
      notes: 'Marcado como perdido automaticamente',
    });
  }

  /**
   * Registra reabastecimento de estoque
   * Wrapper conveniente para createHistory com action=RESTOCKED
   */
  async restockMedication(
    medicationId: string,
    quantity: number,
    notes?: string
  ): Promise<ApiResponse<MedicationHistory>> {
    return this.createHistory({
      medicationId,
      action: HistoryAction.RESTOCKED,
      quantity,
      notes: notes || `Reabastecido: +${quantity} unidades`,
    });
  }

  /**
   * Busca histórico dos últimos N dias
   * Wrapper conveniente para getMyHistory com filtro de data
   */
  async getRecentHistory(days: number = 7): Promise<ApiResponse<MedicationHistory[]>> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.getMyHistory({
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });
  }

  /**
   * Busca apenas medicamentos tomados
   * Wrapper conveniente para getMyHistory com filtro action=TAKEN
   */
  async getTakenMedications(
    filters?: Omit<HistoryFilters, 'action'>
  ): Promise<ApiResponse<MedicationHistory[]>> {
    return this.getMyHistory({
      ...filters,
      action: HistoryAction.TAKEN,
    });
  }

  /**
   * Busca apenas medicamentos pulados/perdidos
   * Wrapper conveniente para getMyHistory com filtro action=SKIPPED ou MISSED
   */
  async getMissedMedications(
    filters?: Omit<HistoryFilters, 'action'>
  ): Promise<ApiResponse<MedicationHistory[]>> {
    // Nota: Backend precisa suportar múltiplos valores em 'action' ou fazer duas chamadas
    return this.getMyHistory({
      ...filters,
      action: HistoryAction.MISSED,
    });
  }
}

// Exporta uma instância singleton
export const historyService = new HistoryService();

// Exporta também a classe para casos de uso avançados
export default HistoryService;

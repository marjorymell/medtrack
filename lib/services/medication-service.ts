import { TodayMedication, MedicationHistory } from '@/types/medication';
import { ApiResponse } from '@/types/api';
import { ApiService } from './api-service';

/**
 * Serviço para comunicação com a API do backend
 * Substitui o medication-service-mock.ts quando EXPO_PUBLIC_USE_MOCK_API=false
 */
class MedicationService extends ApiService {
  constructor() {
    super();
  }

  /**
   * Busca os medicamentos programados para hoje
   * GET /api/medications/today
   */
  async getTodayMedications(): Promise<TodayMedication[]> {
    try {
      const response = await this.get<TodayMedication[]>('/medications/today');
      return response.data || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * @deprecated Use historyService.confirmMedication() ao invés
   * Mantido para retrocompatibilidade - será removido na v7.0
   */
  async confirmMedication(scheduleId: string): Promise<ApiResponse<void>> {
    console.warn(
      '⚠️ medicationService.confirmMedication() está deprecated. Use historyService.confirmMedication()'
    );
    const { historyService } = await import('./history-service');
    return historyService.confirmMedication(scheduleId) as any;
  }

  /**
   * @deprecated Use historyService.postponeMedication() ao invés
   * Mantido para retrocompatibilidade - será removido na v7.0
   */
  async postponeMedication(
    scheduleId: string,
    postponeMinutes: number = 30
  ): Promise<ApiResponse<void>> {
    console.warn(
      '⚠️ medicationService.postponeMedication() está deprecated. Use historyService.postponeMedication()'
    );
    const { historyService } = await import('./history-service');
    return historyService.postponeMedication(scheduleId, postponeMinutes) as any;
  }

  /**
   * @deprecated Use historyService.getMyHistory() ao invés
   * Mantido para retrocompatibilidade - será removido na v7.0
   */
  async getMedicationHistory(startDate?: string, endDate?: string): Promise<MedicationHistory[]> {
    console.warn(
      '⚠️ medicationService.getMedicationHistory() está deprecated. Use historyService.getMyHistory()'
    );
    const { historyService } = await import('./history-service');
    const response = await historyService.getMyHistory({ startDate, endDate });
    return response.data || [];
  }

  /**
   * @deprecated Use historyService.getHistoryByMedication() ao invés
   * Mantido para retrocompatibilidade - será removido na v7.0
   */
  async getHistoryByMedication(
    medicationId: string,
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<MedicationHistory[]>> {
    console.warn(
      '⚠️ medicationService.getHistoryByMedication() está deprecated. Use historyService.getHistoryByMedication()'
    );
    const { historyService } = await import('./history-service');
    return historyService.getHistoryByMedication(medicationId, { startDate, endDate });
  }

  /**
   * @deprecated Use historyService.getAdherenceStats() ao invés
   * Mantido para retrocompatibilidade - será removido na v7.0
   */
  async getMedicationAdherence(
    medicationId: string,
    days: number = 7
  ): Promise<ApiResponse<number>> {
    console.warn(
      '⚠️ medicationService.getMedicationAdherence() está deprecated. Use historyService.getAdherenceStats()'
    );
    const { historyService } = await import('./history-service');
    const response = await historyService.getAdherenceStats(medicationId);
    return { success: true, data: parseFloat(response.data?.adherenceRate || '0') } as any;
  }

  /**
   * @deprecated Use historyService.deleteHistory() ao invés
   * Mantido para retrocompatibilidade - será removido na v7.0
   */
  async deleteHistoryEntry(historyId: string): Promise<ApiResponse<void>> {
    console.warn(
      '⚠️ medicationService.deleteHistoryEntry() está deprecated. Use historyService.deleteHistory()'
    );
    const { historyService } = await import('./history-service');
    return historyService.deleteHistory(historyId) as any;
  }

  /**
   * Busca todos os medicamentos do usuário
   * GET /api/medications
   */
  async getMedications(): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.get<any[]>('/medications');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca um medicamento específico por ID
   * GET /api/medications/:id
   */
  async getMedicationById(medicationId: string): Promise<ApiResponse<any>> {
    try {
      const response = await this.get<any>(`/medications/${medicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza o estoque de um medicamento
   * PUT /api/medications/:id/stock
   */
  async updateMedicationStock(medicationId: string, newStock: number): Promise<ApiResponse<any>> {
    try {
      const response = await this.put<any>(`/medications/${medicationId}/stock`, {
        stock: newStock,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca medicamentos com estoque baixo
   * GET /api/medications/stock/low
   */
  async getLowStockMedications(threshold: number = 5): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.get<any[]>(`/medications/stock/low?threshold=${threshold}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca medicamentos sem estoque
   * GET /api/medications/stock/out
   */
  async getOutOfStockMedications(): Promise<ApiResponse<any[]>> {
    try {
      const response = await this.get<any[]>('/medications/stock/out');
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Cria um novo medicamento
   * POST /api/medications
   */
  async createMedication(medicationData: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.post<any>('/medications', medicationData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Atualiza um medicamento
   * PUT /api/medications/:id
   */
  async updateMedication(medicationId: string, medicationData: any): Promise<ApiResponse<any>> {
    try {
      const response = await this.put<any>(`/medications/${medicationId}`, medicationData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Deleta um medicamento
   * DELETE /api/medications/:id
   */
  async deleteMedication(medicationId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.delete<void>(`/medications/${medicationId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

// Exporta uma instância singleton
export const medicationService = new MedicationService();

// Exporta também a classe para casos de uso avançados
export default MedicationService;

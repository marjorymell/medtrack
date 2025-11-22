import { TodayMedication, ApiResponse, MedicationHistory } from '@/types/medication';
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
   * Confirma que uma dose foi tomada
   * POST /api/history
   */
  async confirmMedication(scheduleId: string): Promise<ApiResponse<void>> {
    try {
      const response = await this.post<void>('/history', {
        scheduleId,
        action: 'TAKEN',
        quantity: 1, // Quantidade padrão para decremento de estoque
        notes: `Confirmado em ${new Date().toLocaleString('pt-BR')}`,
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Adia uma dose para mais tarde
   * POST /api/history
   */
  async postponeMedication(
    scheduleId: string,
    postponeMinutes: number = 30
  ): Promise<ApiResponse<void>> {
    try {
      const postponedTo = new Date();
      postponedTo.setMinutes(postponedTo.getMinutes() + postponeMinutes);

      const response = await this.post<void>('/history', {
        scheduleId,
        action: 'POSTPONED',
        postponedTo: postponedTo.toISOString(),
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Busca o histórico de medicamentos
   * GET /api/history
   */
  async getMedicationHistory(startDate?: string, endDate?: string): Promise<MedicationHistory[]> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const endpoint = `/history/me?${params.toString()}`;
      const response = await this.get<MedicationHistory[]>(endpoint);
      return response.data || [];
    } catch (error) {
      throw error;
    }
  }

  /**
   * Calcula a taxa de adesão ao tratamento
   * GET /api/history/adherence
   */
  async getAdherenceRate(days: number = 7): Promise<number> {
    try {
      const response = await this.get<number>(`/history/adherence?days=${days}`);
      return response.data || 0;
    } catch (error) {
      throw error;
    }
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

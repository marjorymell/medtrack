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
      console.log('[MedicationService] Buscando medicamentos de hoje...');

      const response = await this.get<TodayMedication[]>('/medications/today');

      console.log(`[MedicationService] ✓ Retornando ${response.data?.length || 0} medicamentos`);
      return response.data || [];
    } catch (error) {
      console.error('[MedicationService] ✗ Erro ao buscar medicamentos:', error);
      throw error;
    }
  }

  /**
   * Confirma que uma dose foi tomada
   * POST /api/history
   */
  async confirmMedication(scheduleId: string): Promise<ApiResponse<void>> {
    try {
      console.log(`[MedicationService] Confirmando medicamento: ${scheduleId}`);

      const response = await this.post<void>('/history', {
        scheduleId,
        action: 'taken',
        confirmedAt: new Date().toISOString(),
      });

      console.log('[MedicationService] ✓ Medicamento confirmado com sucesso');
      return response;
    } catch (error) {
      console.error('[MedicationService] ✗ Erro ao confirmar medicamento:', error);
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
      console.log(
        `[MedicationService] Adiando medicamento: ${scheduleId} por ${postponeMinutes} minutos`
      );

      const postponedTo = new Date();
      postponedTo.setMinutes(postponedTo.getMinutes() + postponeMinutes);

      const response = await this.post<void>('/history', {
        scheduleId,
        action: 'postponed',
        postponedTo: postponedTo.toISOString(),
      });

      console.log(
        `[MedicationService] ✓ Medicamento adiado para ${postponedTo.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
      );
      return response;
    } catch (error) {
      console.error('[MedicationService] ✗ Erro ao adiar medicamento:', error);
      throw error;
    }
  }

  /**
   * Busca o histórico de medicamentos
   * GET /api/history
   */
  async getMedicationHistory(startDate?: string, endDate?: string): Promise<MedicationHistory[]> {
    try {
      console.log('[MedicationService] Buscando histórico de medicamentos');

      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const endpoint = `/history/me?${params.toString()}`;
      const response = await this.get<MedicationHistory[]>(endpoint);

      console.log(`[MedicationService] ✓ Retornando ${response.data?.length || 0} registros`);
      return response.data || [];
    } catch (error) {
      console.error('[MedicationService] ✗ Erro ao buscar histórico:', error);
      throw error;
    }
  }

  /**
   * Calcula a taxa de adesão ao tratamento
   * GET /api/history/adherence
   */
  async getAdherenceRate(days: number = 7): Promise<number> {
    try {
      console.log(`[MedicationService] Calculando taxa de adesão dos últimos ${days} dias`);

      const response = await this.get<number>(`/history/adherence?days=${days}`);

      console.log(`[MedicationService] ✓ Taxa de adesão: ${response.data?.toFixed(1)}%`);
      return response.data || 0;
    } catch (error) {
      console.error('[MedicationService] ✗ Erro ao calcular adesão:', error);
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
      console.error('[MedicationService] ✗ Erro ao buscar medicamentos:', error);
      throw error;
    }
  }

  /**
   * Atualiza o estoque de um medicamento
   * PUT /api/medications/:id/stock
   */
  async updateMedicationStock(medicationId: string, newStock: number): Promise<ApiResponse<any>> {
    try {
      console.log(
        `[MedicationService] Atualizando estoque do medicamento ${medicationId} para ${newStock}`
      );

      const response = await this.put<any>(`/medications/${medicationId}/stock`, {
        stock: newStock,
      });

      console.log('[MedicationService] ✓ Estoque atualizado com sucesso');
      return response;
    } catch (error) {
      console.error('[MedicationService] ✗ Erro ao atualizar estoque:', error);
      throw error;
    }
  }

  /**
   * Busca medicamentos com estoque baixo
   * GET /api/medications/stock/low
   */
  async getLowStockMedications(threshold: number = 5): Promise<ApiResponse<any[]>> {
    try {
      console.log(`[MedicationService] Buscando medicamentos com estoque baixo (<= ${threshold})`);

      const response = await this.get<any[]>(`/medications/stock/low?threshold=${threshold}`);

      console.log(
        `[MedicationService] ✓ Retornando ${response.data?.length || 0} medicamentos com estoque baixo`
      );
      return response;
    } catch (error) {
      console.error('[MedicationService] ✗ Erro ao buscar medicamentos com estoque baixo:', error);
      throw error;
    }
  }

  /**
   * Busca medicamentos sem estoque
   * GET /api/medications/stock/out
   */
  async getOutOfStockMedications(): Promise<ApiResponse<any[]>> {
    try {
      console.log('[MedicationService] Buscando medicamentos sem estoque');

      const response = await this.get<any[]>('/medications/stock/out');

      console.log(
        `[MedicationService] ✓ Retornando ${response.data?.length || 0} medicamentos sem estoque`
      );
      return response;
    } catch (error) {
      console.error('[MedicationService] ✗ Erro ao buscar medicamentos sem estoque:', error);
      throw error;
    }
  }

  /**
   * Cria um novo medicamento
   * POST /api/medications
   */
  async createMedication(medicationData: any): Promise<ApiResponse<any>> {
    try {
      console.log('[MedicationService] Criando novo medicamento:', medicationData.name);

      const response = await this.post<any>('/medications', medicationData);

      console.log('[MedicationService] ✓ Medicamento criado com sucesso');
      return response;
    } catch (error) {
      console.error('[MedicationService] ✗ Erro ao criar medicamento:', error);
      throw error;
    }
  }

  /**
   * Atualiza um medicamento
   * PUT /api/medications/:id
   */
  async updateMedication(medicationId: string, medicationData: any): Promise<ApiResponse<any>> {
    try {
      console.log(
        `[MedicationService] Atualizando medicamento ${medicationId}:`,
        medicationData.name
      );

      const response = await this.put<any>(`/medications/${medicationId}`, medicationData);

      console.log('[MedicationService] ✓ Medicamento atualizado com sucesso');
      return response;
    } catch (error) {
      console.error('[MedicationService] ✗ Erro ao atualizar medicamento:', error);
      throw error;
    }
  }

  /**
   * Deleta um medicamento
   * DELETE /api/medications/:id
   */
  async deleteMedication(medicationId: string): Promise<ApiResponse<void>> {
    try {
      console.log(`[MedicationService] Deletando medicamento ${medicationId}`);

      const response = await this.delete<void>(`/medications/${medicationId}`);

      console.log('[MedicationService] ✓ Medicamento deletado com sucesso');
      return response;
    } catch (error) {
      console.error('[MedicationService] ✗ Erro ao deletar medicamento:', error);
      throw error;
    }
  }
}

// Exporta uma instância singleton
export const medicationService = new MedicationService();

// Exporta também a classe para casos de uso avançados
export default MedicationService;

import { 
  TodayMedication, 
  ApiResponse,
  MedicationHistory,
  MedicationStock 
} from '@/types/medication';
import { 
  MOCK_TODAY_MEDICATIONS, 
  MOCK_MEDICATION_HISTORY,
  MOCK_MEDICATION_STOCK 
} from './medication-data';
import { simulateNetworkDelay, generateMockId } from './utils';

/**
 * Serviço Mock que simula a API do backend
 * Use este serviço durante o desenvolvimento até que a API real esteja pronta
 * 
 * Para alternar entre mock e API real:
 * 1. Crie o arquivo lib/services/medication-service.ts com a implementação real
 * 2. No hook use-today-medications.ts, importe o serviço desejado
 */
class MedicationServiceMock {
  // Estado interno para simular persistência de dados
  private medications: TodayMedication[] = [...MOCK_TODAY_MEDICATIONS];
  private history: MedicationHistory[] = [...MOCK_MEDICATION_HISTORY];
  private stock: MedicationStock[] = [...MOCK_MEDICATION_STOCK];

  /**
   * Busca os medicamentos programados para hoje
   * Simula: GET /v1/medications/today
   */
  async getTodayMedications(): Promise<TodayMedication[]> {
    console.log('[MOCK API] Buscando medicamentos de hoje...');
    
    // Simula latência de rede
    await simulateNetworkDelay();

    // Ordena por horário
    const sorted = [...this.medications].sort((a, b) => 
      a.time.localeCompare(b.time)
    );

    console.log('[MOCK API] ✓ Retornando', sorted.length, 'medicamentos');
    return sorted;
  }

  /**
   * Confirma que uma dose foi tomada
   * Simula: POST /v1/history
   */
  async confirmMedication(scheduleId: string): Promise<ApiResponse<void>> {
    console.log('[MOCK API] Confirmando medicamento:', scheduleId);
    
    await simulateNetworkDelay(300);

    const medication = this.medications.find((m) => m.scheduleId === scheduleId);
    
    if (!medication) {
      console.error('[MOCK API] ✗ Medicamento não encontrado');
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Medicamento não encontrado',
        },
      };
    }

    // Atualiza o estado do medicamento
    medication.status = 'confirmed';
    medication.taken = true;

    // Adiciona ao histórico
    this.history.push({
      id: generateMockId(),
      scheduleId,
      medicationName: medication.name,
      dosage: medication.dosage,
      scheduledTime: medication.scheduledTime,
      status: 'confirmed',
      confirmedAt: new Date().toISOString(),
    });

    // Decrementa estoque (RN02)
    const stockItem = this.stock.find(
      (s) => s.name === medication.name && s.dosage === medication.dosage
    );
    if (stockItem && stockItem.currentStock > 0) {
      stockItem.currentStock--;
      console.log('[MOCK API] Estoque decrementado:', stockItem.name, 'restam', stockItem.currentStock);
    }

    console.log('[MOCK API] ✓ Medicamento confirmado com sucesso');
    return {
      success: true,
      message: 'Medicamento confirmado com sucesso',
    };
  }

  /**
   * Adia uma dose para mais tarde
   * Simula: POST /v1/history (com status postponed)
   */
  async postponeMedication(
    scheduleId: string, 
    postponeMinutes: number = 30
  ): Promise<ApiResponse<void>> {
    console.log('[MOCK API] Adiando medicamento:', scheduleId, 'por', postponeMinutes, 'minutos');
    
    await simulateNetworkDelay(300);

    const medication = this.medications.find((m) => m.scheduleId === scheduleId);
    
    if (!medication) {
      console.error('[MOCK API] ✗ Medicamento não encontrado');
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Medicamento não encontrado',
        },
      };
    }

    const postponedTo = new Date();
    postponedTo.setMinutes(postponedTo.getMinutes() + postponeMinutes);

    // Atualiza o estado do medicamento
    medication.status = 'postponed';
    medication.postponed = true;
    medication.scheduledTime = postponedTo.toISOString();
    medication.time = postponedTo.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Adiciona ao histórico
    this.history.push({
      id: generateMockId(),
      scheduleId,
      medicationName: medication.name,
      dosage: medication.dosage,
      scheduledTime: medication.scheduledTime,
      status: 'postponed',
      postponedTo: postponedTo.toISOString(),
    });

    console.log('[MOCK API] ✓ Medicamento adiado para', medication.time);
    return {
      success: true,
      message: `Medicamento adiado para ${medication.time}`,
    };
  }

  /**
   * Busca o histórico de medicamentos
   * Simula: GET /v1/history
   */
  async getMedicationHistory(
    startDate?: string,
    endDate?: string
  ): Promise<MedicationHistory[]> {
    console.log('[MOCK API] Buscando histórico de medicamentos');
    
    await simulateNetworkDelay();

    let filteredHistory = [...this.history];

    // Filtra por data se fornecido
    if (startDate) {
      filteredHistory = filteredHistory.filter(
        (h) => new Date(h.scheduledTime) >= new Date(startDate)
      );
    }
    if (endDate) {
      filteredHistory = filteredHistory.filter(
        (h) => new Date(h.scheduledTime) <= new Date(endDate)
      );
    }

    // Ordena por data (mais recente primeiro)
    filteredHistory.sort(
      (a, b) => new Date(b.scheduledTime).getTime() - new Date(a.scheduledTime).getTime()
    );

    console.log('[MOCK API] ✓ Retornando', filteredHistory.length, 'registros');
    return filteredHistory;
  }

  /**
   * Busca o estoque de medicamentos
   * Simula: GET /v1/medications/stock
   */
  async getMedicationStock(): Promise<MedicationStock[]> {
    console.log('[MOCK API] Buscando estoque de medicamentos');
    
    await simulateNetworkDelay();

    console.log('[MOCK API] ✓ Retornando', this.stock.length, 'itens em estoque');
    return [...this.stock];
  }

  /**
   * Calcula a taxa de adesão ao tratamento
   * Simula: GET /v1/history/adherence
   */
  async getAdherenceRate(days: number = 7): Promise<number> {
    console.log('[MOCK API] Calculando taxa de adesão dos últimos', days, 'dias');
    
    await simulateNetworkDelay();

    const confirmedCount = this.history.filter(
      (h) => h.status === 'confirmed'
    ).length;

    const totalCount = this.history.length;

    const adherenceRate = totalCount > 0 
      ? (confirmedCount / totalCount) * 100 
      : 0;

    console.log('[MOCK API] ✓ Taxa de adesão:', adherenceRate.toFixed(1) + '%');
    return Math.round(adherenceRate * 10) / 10; // Arredonda para 1 casa decimal
  }

  /**
   * Reseta os dados mockados para o estado inicial
   * Útil para testes
   */
  resetMockData(): void {
    console.log('[MOCK API] Resetando dados mockados...');
    this.medications = [...MOCK_TODAY_MEDICATIONS];
    this.history = [...MOCK_MEDICATION_HISTORY];
    this.stock = [...MOCK_MEDICATION_STOCK];
    console.log('[MOCK API] ✓ Dados resetados');
  }
}

// Exporta uma instância singleton
export const medicationServiceMock = new MedicationServiceMock();

// Exporta também a classe para casos de uso avançados
export default MedicationServiceMock;

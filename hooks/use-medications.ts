import { useState, useEffect, useCallback } from 'react';
import { medicationService } from '@/lib/services/medication-service';
import { showToast } from '@/utils/toast';
import { useAuth } from '@/contexts/auth-context';
import { useMedicationsContext } from '@/contexts/medications-context';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startTime: string;
  intervalHours: number;
  stock: number;
  expiresAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export function useMedications() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();
  const {
    medications,
    invalidateMedications,
    updateMedicationLocally,
    addMedicationLocally,
    removeMedicationLocally,
    refreshCompleted
  } = useMedicationsContext();

  // Função para sincronizar dados da API com o contexto global
  const syncMedicationsWithContext = useCallback((apiMedications: Medication[]) => {
    // Limpar medicamentos existentes no contexto
    medications.forEach(med => removeMedicationLocally(med.id));
    // Adicionar medicamentos da API
    apiMedications.forEach(med => addMedicationLocally(med));
  }, [medications, removeMedicationLocally, addMedicationLocally]);

  const fetchMedications = async () => {
    console.log('[useMedications] ===== fetchMedications INICIADO =====');
    try {
      setLoading(true);
      setError(null);

      console.log('[useMedications] Iniciando fetchMedications...');
      console.log('[useMedications] isAuthenticated:', isAuthenticated);
      console.log('[useMedications] user:', user);

      if (!isAuthenticated) {
        console.log('[useMedications] Usuário não autenticado, pulando busca');
        // Não podemos limpar o contexto global aqui, pois outras telas podem estar usando
        return;
      }

      console.log('[useMedications] Fazendo chamada para medicationService.getMedications()...');
      const response = await medicationService.getMedications();
      console.log('[useMedications] Response completa:', JSON.stringify(response, null, 2));

      // Verificar se a resposta indica erro
      if (!response.success) {
        console.log('[useMedications] API retornou erro:', response.error);
        throw new Error(response.error?.message || 'Erro na API');
      }

      // O backend retorna: { success: true, data: { total, page, limit, items }, message }
      // O ApiService já fez o unwrap, então response.data é o objeto paginado
      let medicationsData: Medication[] = [];

      if (response.data) {
        const data = response.data as any;
        console.log('[useMedications] Data recebida:', typeof data, Object.keys(data));

        // Tentar diferentes formatos de resposta
        if (data.items && Array.isArray(data.items)) {
          medicationsData = data.items;
          console.log(
            '[useMedications] ✓ Usando data.items:',
            medicationsData.length,
            'medicamentos'
          );
        } else if (Array.isArray(data)) {
          medicationsData = data;
          console.log(
            '[useMedications] ✓ Data é array direto:',
            medicationsData.length,
            'medicamentos'
          );
        } else if (data.total !== undefined && data.page !== undefined) {
          // É um objeto paginado mas sem items - pode ser erro
          console.log('[useMedications] ⚠️ Data é paginada mas sem items. Estrutura:', data);
          medicationsData = [];
        } else {
          console.log('[useMedications] ⚠️ Formato de data inesperado:', data);
          medicationsData = [];
        }
      } else {
        console.log('[useMedications] ⚠️ Response sem data');
        medicationsData = [];
      }

      console.log('[useMedications] Definindo medicamentos:', medicationsData.length, 'itens');
      // Sincronizar com contexto global
      syncMedicationsWithContext(medicationsData);
      // Marcar que o refresh foi concluído
      refreshCompleted();
      console.log('[useMedications] ===== fetchMedications CONCLUÍDO =====');
    } catch (err: any) {
      console.error('[useMedications] Erro completo:', err);
      console.error('[useMedications] Tipo do erro:', typeof err);
      console.error('[useMedications] Propriedades do erro:', Object.keys(err));
      console.error('[useMedications] Mensagem do erro:', err.message);
      console.error('[useMedications] Stack do erro:', err.stack);

      let errorMessage = 'Erro ao carregar medicamentos';

      if (err.message?.includes('Token')) {
        errorMessage = 'Sessão expirada. Faça login novamente.';
      } else if (err.message?.includes('Network')) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      } else if (err.message?.includes('500')) {
        errorMessage = 'Erro interno do servidor. Tente novamente em alguns instantes.';
      } else if (err.message) {
        errorMessage = err.message;
      }

      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const createMedication = async (
    medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const response = await medicationService.createMedication(medicationData);

      // Recarregar medicamentos da API após criar
      await fetchMedications();

      showToast('Medicamento criado com sucesso', 'success');
      return response.data;
    } catch (err: any) {
      console.error('Erro ao criar medicamento:', err);
      showToast('Erro ao criar medicamento', 'error');
      throw err;
    }
  };

  const updateMedication = async (medicationId: string, medicationData: Partial<Medication>) => {
    try {
      console.log(`[useMedications] Atualizando medicamento: ${medicationId}`, medicationData);
      const response = await medicationService.updateMedication(medicationId, medicationData);
      console.log(`[useMedications] Medicamento atualizado com sucesso, fazendo fetch...`);

      // Recarregar medicamentos da API após atualizar
      await fetchMedications();
      console.log(`[useMedications] Fetch concluído após update`);

      showToast('Medicamento atualizado com sucesso', 'success');
      return response.data;
    } catch (err: any) {
      console.error('[useMedications] Erro ao atualizar medicamento:', err);
      showToast(`Erro ao atualizar medicamento: ${err.message || 'Erro desconhecido'}`, 'error');
      throw err;
    }
  };

  const deleteMedication = async (medicationId: string) => {
    try {
      console.log(`[useMedications] Deletando medicamento: ${medicationId}`);
      const response = await medicationService.deleteMedication(medicationId);
      console.log(`[useMedications] Response do delete:`, response);

      if (!response.success) {
        throw new Error(response.error?.message || 'Erro na resposta da API');
      }

      console.log(`[useMedications] Medicamento deletado com sucesso, fazendo fetch...`);

      // Recarregar medicamentos da API após deletar
      await fetchMedications();
      console.log(`[useMedications] Fetch concluído após delete`);

      showToast('Medicamento removido com sucesso', 'success');
    } catch (err: any) {
      console.error('[useMedications] Erro ao deletar medicamento:', err);
      const errorMessage = err.message || err.error?.message || 'Erro desconhecido';
      showToast(`Erro ao remover medicamento: ${errorMessage}`, 'error');
      throw err;
    }
  };

  const updateStock = async (medicationId: string, newStock: number) => {
    try {
      console.log(
        `[useMedications] Iniciando updateStock para ${medicationId} com valor ${newStock}`
      );
      await medicationService.updateMedicationStock(medicationId, newStock);
      console.log(`[useMedications] updateMedicationStock concluído, chamando fetchMedications...`);

      // Recarregar medicamentos da API após atualizar estoque
      await fetchMedications();
      console.log(`[useMedications] fetchMedications concluído após updateStock`);

      showToast('Estoque atualizado com sucesso', 'success');
    } catch (err: any) {
      console.error('[useMedications] Erro em updateStock:', err);
      showToast('Erro ao atualizar estoque', 'error');
      throw err;
    }
  };

  useEffect(() => {
    fetchMedications();
  }, []);

  return {
    medications,
    loading,
    error,
    refetch: fetchMedications,
    createMedication,
    updateMedication,
    deleteMedication,
    updateStock,
  };
}

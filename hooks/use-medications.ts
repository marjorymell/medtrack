import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationService } from '@/lib/services/medication-service';
import { showToast } from '@/utils/toast';
import { useAuth } from '@/contexts/auth-context';

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
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Query para buscar medicamentos
  const {
    data: medications = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['medications'],
    queryFn: async () => {
      console.log('[useMedications] Fazendo chamada para medicationService.getMedications()...');
      const response = await medicationService.getMedications();

      if (!response.success) {
        throw new Error(response.error?.message || 'Erro na API');
      }

      // Extrair dados da resposta paginada
      const data = response.data as any;
      let medicationsData: Medication[] = [];

      if (data.items && Array.isArray(data.items)) {
        medicationsData = data.items;
      } else if (Array.isArray(data)) {
        medicationsData = data;
      }

      console.log('[useMedications] Retornando medicamentos:', medicationsData.length, 'itens');
      return medicationsData;
    },
    enabled: isAuthenticated, // Só executar se estiver autenticado
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutation para criar medicamento
  const createMedicationMutation = useMutation({
    mutationFn: async (medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
      const response = await medicationService.createMedication(medicationData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar e refetch da query de medicamentos
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      showToast('Medicamento criado com sucesso', 'success');
    },
    onError: (err: any) => {
      console.error('Erro ao criar medicamento:', err);
      showToast('Erro ao criar medicamento', 'error');
    },
  });

  // Mutation para atualizar medicamento
  const updateMedicationMutation = useMutation({
    mutationFn: async ({
      medicationId,
      medicationData,
    }: {
      medicationId: string;
      medicationData: Partial<Medication>;
    }) => {
      const response = await medicationService.updateMedication(medicationId, medicationData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['today-medications'] });
      showToast('Medicamento atualizado com sucesso', 'success');
    },
    onError: (err: any) => {
      console.error('Erro ao atualizar medicamento:', err);
      showToast(`Erro ao atualizar medicamento: ${err.message || 'Erro desconhecido'}`, 'error');
    },
  });

  // Mutation para deletar medicamento
  const deleteMedicationMutation = useMutation({
    mutationFn: async (medicationId: string) => {
      const response = await medicationService.deleteMedication(medicationId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Erro na resposta da API');
      }
      return response;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['today-medications'] });
      showToast('Medicamento removido com sucesso', 'success');
    },
    onError: (err: any) => {
      console.error('Erro ao deletar medicamento:', err);
      const errorMessage = err.message || err.error?.message || 'Erro desconhecido';
      showToast(`Erro ao remover medicamento: ${errorMessage}`, 'error');
    },
  });

  // Mutation para atualizar estoque
  const updateStockMutation = useMutation({
    mutationFn: async ({ medicationId, newStock }: { medicationId: string; newStock: number }) => {
      await medicationService.updateMedicationStock(medicationId, newStock);
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      showToast('Estoque atualizado com sucesso', 'success');
    },
    onError: (err: any) => {
      console.error('Erro ao atualizar estoque:', err);
      showToast('Erro ao atualizar estoque', 'error');
    },
  });

  // Funções wrapper para manter compatibilidade com código existente
  const createMedication = async (
    medicationData: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    return createMedicationMutation.mutateAsync(medicationData);
  };

  const updateMedication = async (medicationId: string, medicationData: Partial<Medication>) => {
    return updateMedicationMutation.mutateAsync({ medicationId, medicationData });
  };

  const deleteMedication = async (medicationId: string) => {
    return deleteMedicationMutation.mutateAsync(medicationId);
  };

  const updateStock = async (medicationId: string, newStock: number) => {
    return updateStockMutation.mutateAsync({ medicationId, newStock });
  };

  return {
    medications,
    loading,
    error: error?.message || null,
    refetch,
    createMedication,
    updateMedication,
    deleteMedication,
    updateStock,
    // Expor estados das mutations para feedback na UI
    isCreating: createMedicationMutation.isPending,
    isUpdating: updateMedicationMutation.isPending,
    isDeleting: deleteMedicationMutation.isPending,
    isUpdatingStock: updateStockMutation.isPending,
  };
}

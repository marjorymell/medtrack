import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Medication, CreateMedicationData, UpdateMedicationData } from '@/types/medication';
import { medicationService } from '@/lib/services/medication-service';
import { showToast } from '@/utils/toast';
import { useAuth } from '@/contexts/auth-context';

export function useMedications() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: medications = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['medications'],
    queryFn: async () => {
      const response = await medicationService.getMedications();

      if (!response.success) {
        throw new Error(response.error?.message || 'Erro na API');
      }

      const data = response.data as any;
      let medicationsData: Medication[] = [];

      if (data.items && Array.isArray(data.items)) {
        medicationsData = data.items;
      } else if (Array.isArray(data)) {
        medicationsData = data;
      }

      return medicationsData;
    },
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const createMedicationMutation = useMutation({
    mutationFn: async (medicationData: CreateMedicationData) => {
      const response = await medicationService.createMedication(medicationData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      showToast('Medicamento criado com sucesso', 'success');
    },
    onError: () => {
      showToast('Erro ao criar medicamento', 'error');
    },
  });

  const updateMedicationMutation = useMutation({
    mutationFn: async ({
      medicationId,
      medicationData,
    }: {
      medicationId: string;
      medicationData: UpdateMedicationData;
    }) => {
      const response = await medicationService.updateMedication(medicationId, medicationData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['today-medications'] });
      showToast('Medicamento atualizado com sucesso', 'success');
    },
    onError: (err: any) => {
      showToast(`Erro ao atualizar medicamento: ${err.message || 'Erro desconhecido'}`, 'error');
    },
  });

  const deleteMedicationMutation = useMutation({
    mutationFn: async (medicationId: string) => {
      const response = await medicationService.deleteMedication(medicationId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Erro na resposta da API');
      }
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['today-medications'] });
      showToast('Medicamento removido com sucesso', 'success');
    },
    onError: (err: any) => {
      const errorMessage = err.message || err.error?.message || 'Erro desconhecido';
      showToast(`Erro ao remover medicamento: ${errorMessage}`, 'error');
    },
  });

  const updateStockMutation = useMutation({
    mutationFn: async ({ medicationId, newStock }: { medicationId: string; newStock: number }) => {
      await medicationService.updateMedicationStock(medicationId, newStock);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      showToast('Estoque atualizado com sucesso', 'success');
    },
    onError: () => {
      showToast('Erro ao atualizar estoque', 'error');
    },
  });

  // Funções wrapper para manter compatibilidade com código existente
  const createMedication = async (medicationData: CreateMedicationData) => {
    return createMedicationMutation.mutateAsync(medicationData);
  };

  const updateMedication = async (medicationId: string, medicationData: UpdateMedicationData) => {
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
    isCreating: createMedicationMutation.isPending,
    isUpdating: updateMedicationMutation.isPending,
    isDeleting: deleteMedicationMutation.isPending,
    isUpdatingStock: updateStockMutation.isPending,
  };
}

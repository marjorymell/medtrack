import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationService } from '@/lib/services/medication-service';
import { showToast } from '@/utils/toast';
import { useAuth } from '@/contexts/auth-context';

export interface StockMedication {
  id: string;
  name: string;
  dosage: string;
  stock: number;
  expiresAt?: string;
}

export function useStock() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Usar a mesma query dos medicamentos para compartilhar cache
  const {
    data: medications = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ['medications'],
    queryFn: async () => {
      const response = await medicationService.getMedications();
      if (!response.success) {
        throw new Error(response.error?.message || 'Erro na API');
      }

      const data = response.data as any;
      return data.items && Array.isArray(data.items) ? data.items : data;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Transformar medicamentos para formato de estoque
  const stockMedications: StockMedication[] = medications.map((med: any) => ({
    id: med.id,
    name: med.name,
    dosage: med.dosage,
    stock: med.stock,
    expiresAt: med.expiresAt,
  }));

  // Mutation para atualizar estoque
  const updateStockMutation = useMutation({
    mutationFn: async ({ medicationId, newStock }: { medicationId: string; newStock: number }) => {
      await medicationService.updateMedicationStock(medicationId, newStock);
    },
    onSuccess: () => {
      // Invalidar query de medicamentos para atualizar todas as telas
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      showToast('Estoque atualizado com sucesso', 'success');
    },
    onError: (err: any) => {

      showToast('Erro ao atualizar estoque', 'error');
    },
  });

  // Query para medicamentos com estoque baixo
  const { data: lowStockMedications = [], refetch: refetchLowStock } = useQuery({
    queryKey: ['low-stock-medications'],
    queryFn: async () => {
      const response = await medicationService.getLowStockMedications(5);
      return response.data || [];
    },
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Query para medicamentos sem estoque
  const { data: outOfStockMedications = [], refetch: refetchOutOfStock } = useQuery({
    queryKey: ['out-of-stock-medications'],
    queryFn: async () => {
      const response = await medicationService.getOutOfStockMedications();
      return response.data || [];
    },
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  // Função wrapper para manter compatibilidade
  const updateStock = async (medicationId: string, newStock: number) => {
    return updateStockMutation.mutateAsync({ medicationId, newStock });
  };

  const getLowStockMedications = async (threshold: number = 5) => {
    // Refetch se necessário, mas geralmente os dados já estarão no cache
    await refetchLowStock();
    return lowStockMedications;
  };

  const getOutOfStockMedications = async () => {
    // Refetch se necessário, mas geralmente os dados já estarão no cache
    await refetchOutOfStock();
    return outOfStockMedications;
  };

  return {
    medications: stockMedications,
    loading,
    error: error?.message || null,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['medications'] }),
    updateStock,
    getLowStockMedications,
    getOutOfStockMedications,
    lowStockMedications,
    outOfStockMedications,
    // Expor estado da mutation para feedback na UI
    isUpdatingStock: updateStockMutation.isPending,
  };
}

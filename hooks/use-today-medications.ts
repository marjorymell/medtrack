import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TodayMedication, ApiResponse } from '@/types/medication';
import { medicationServiceMock } from '@/mocks/medication-service-mock';
import { medicationService } from '@/lib/services/medication-service';
import { useAuth } from '@/contexts/auth-context';
import { showToast } from '@/utils/toast';

/**
 * Hook customizado para gerenciar os medicamentos do dia
 *
 * Usa serviço MOCK ou API real baseado na variável EXPO_PUBLIC_USE_MOCK_API
 */
export function useTodayMedications() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  // Determina qual serviço usar baseado na variável de ambiente
  const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';
  const service = USE_MOCK ? medicationServiceMock : medicationService;

  // Query para buscar medicamentos do dia
  const {
    data: medications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['today-medications'],
    queryFn: async () => {
      const data = await service.getTodayMedications();
      return data;
    },
    enabled: !!token, // Só executar se tiver token
    staleTime: 2 * 60 * 1000, // 2 minutos (dados do dia mudam com frequência)
    gcTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para confirmar medicamento
  const confirmMedicationMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      const result = await service.confirmMedication(scheduleId);
      if (!result.success) {
        throw new Error(result.error?.message || 'Erro ao confirmar medicamento');
      }
      return result;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['today-medications'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      showToast('Medicamento confirmado com sucesso!', 'success');
    },
    onError: (err: any) => {
      console.error('Erro ao confirmar medicamento:', err);
      showToast('Não foi possível confirmar o medicamento', 'error');
    },
  });

  // Mutation para adiar medicamento
  const postponeMedicationMutation = useMutation({
    mutationFn: async ({ scheduleId, minutes = 30 }: { scheduleId: string; minutes?: number }) => {
      const result = await service.postponeMedication(scheduleId, minutes);
      if (!result.success) {
        throw new Error(result.error?.message || 'Erro ao adiar medicamento');
      }
      return result;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['today-medications'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
    onError: (err: any) => {
      console.error('Erro ao adiar medicamento:', err);
      showToast('Não foi possível adiar o medicamento', 'error');
    },
  });

  // Funções wrapper para manter compatibilidade
  const confirmMedication = async (scheduleId: string) => {
    return confirmMedicationMutation.mutateAsync(scheduleId);
  };

  const postponeMedication = async (scheduleId: string, minutes = 30) => {
    return postponeMedicationMutation.mutateAsync({ scheduleId, minutes });
  };

  return {
    medications,
    isLoading,
    error: error?.message || null,
    refetch,
    confirmMedication,
    postponeMedication,
    // Expor estados das mutations para feedback na UI
    isConfirming: confirmMedicationMutation.isPending,
    isPostponing: postponeMedicationMutation.isPending,
  };
}

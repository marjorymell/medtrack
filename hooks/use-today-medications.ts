import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TodayMedication, ApiResponse } from '@/types/medication';
import { medicationServiceMock } from '@/mocks/medication-service-mock';
import { medicationService } from '@/lib/services/medication-service';
import { useAuth } from '@/contexts/auth-context';
import { showToast } from '@/utils/toast';

/**
 * Hook customizado para gerenciar os medicamentos do dia
 */
export function useTodayMedications() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';
  const service = USE_MOCK ? medicationServiceMock : medicationService;

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
    enabled: !!token,
    staleTime: 1 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  const confirmMedicationMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      const result = await service.confirmMedication(scheduleId);
      if (!result.success) {
        throw new Error(result.error?.message || 'Erro ao confirmar medicamento');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-medications'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      showToast('Medicamento confirmado com sucesso!', 'success');
    },
    onError: () => {
      showToast('Não foi possível confirmar o medicamento', 'error');
    },
  });

  const postponeMedicationMutation = useMutation({
    mutationFn: async ({ scheduleId, minutes = 30 }: { scheduleId: string; minutes?: number }) => {
      const result = await service.postponeMedication(scheduleId, minutes);
      if (!result.success) {
        throw new Error(result.error?.message || 'Erro ao adiar medicamento');
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['today-medications'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
    },
    onError: () => {
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
    isConfirming: confirmMedicationMutation.isPending,
    isPostponing: postponeMedicationMutation.isPending,
  };
}

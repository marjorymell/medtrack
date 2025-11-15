import { useState, useEffect, useCallback } from 'react';
import { TodayMedication, ApiResponse } from '@/types/medication';
import { medicationServiceMock } from '@/mocks/medication-service-mock';
import { medicationService } from '@/lib/services/medication-service';
import { useAuth } from '@/contexts/auth-context';
import { useMedicationsContext } from '@/contexts/medications-context';

/**
 * Hook customizado para gerenciar os medicamentos do dia
 *
 * Usa serviço MOCK ou API real baseado na variável EXPO_PUBLIC_USE_MOCK_API
 */
export function useTodayMedications() {
  const { token } = useAuth();
  const [medications, setMedications] = useState<TodayMedication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Determina qual serviço usar baseado na variável de ambiente
  const USE_MOCK = process.env.EXPO_PUBLIC_USE_MOCK_API === 'true';
  const service = USE_MOCK ? medicationServiceMock : medicationService;
  const { invalidateMedications } = useMedicationsContext();

  const fetchMedications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await service.getTodayMedications();
      setMedications(data);
    } catch (err) {
      setError('Não foi possível carregar os medicamentos');
      console.error('Erro ao buscar medicamentos:', err);
    } finally {
      setIsLoading(false);
    }
  }, [service]);

  const confirmMedication = useCallback(
    async (scheduleId: string) => {
      try {
        const result = await service.confirmMedication(scheduleId);

        if (result.success) {
          // Recarregar lista após confirmar
          await fetchMedications();

          // Invalidar contexto global para forçar atualização do estoque em outras telas
          invalidateMedications();
        } else {
          throw new Error(result.error?.message || 'Erro ao confirmar medicamento');
        }
      } catch (err) {
        setError('Não foi possível confirmar o medicamento');
        console.error('Erro ao confirmar medicamento:', err);
        throw err; // Re-throw para o componente tratar
      }
    },
    [service, fetchMedications, invalidateMedications]
  );

  const postponeMedication = useCallback(
    async (scheduleId: string, minutes = 30) => {
      try {
        const result = await service.postponeMedication(scheduleId, minutes);

        if (result.success) {
          // Recarregar lista para pegar o novo horário
          await fetchMedications();
        } else {
          throw new Error(result.error?.message || 'Erro ao adiar medicamento');
        }
      } catch (err) {
        setError('Não foi possível adiar o medicamento');
        console.error('Erro ao adiar medicamento:', err);
        throw err; // Re-throw para o componente tratar
      }
    },
    [service, fetchMedications]
  );

  useEffect(() => {
    fetchMedications();
  }, [fetchMedications]);

  return {
    medications,
    isLoading,
    error,
    refetch: fetchMedications,
    confirmMedication,
    postponeMedication,
  };
}

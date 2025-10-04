import { useState, useEffect, useCallback } from 'react';
import { TodayMedication, ApiResponse } from '@/types/medication';
import { medicationServiceMock } from '@/mocks/medication-service-mock';

/**
 * Hook customizado para gerenciar os medicamentos do dia
 *
 * Atualmente usa o serviço MOCK. Quando o backend estiver pronto:
 * 1. Crie lib/services/medication-service.ts com a implementação real
 * 2. Importe o serviço real aqui
 * 3. Use variável de ambiente para alternar entre mock e real
 */
export function useTodayMedications() {
  const [medications, setMedications] = useState<TodayMedication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Usando serviço MOCK - trocar por serviço real quando backend estiver pronto
      const data = await medicationServiceMock.getTodayMedications();
      setMedications(data);
    } catch (err) {
      setError('Não foi possível carregar os medicamentos');
      console.error('Erro ao buscar medicamentos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const confirmMedication = useCallback(async (scheduleId: string) => {
    try {
      // Usando serviço MOCK - trocar por serviço real quando backend estiver pronto
      const result = await medicationServiceMock.confirmMedication(scheduleId);

      if (result.success) {
        // Atualizar estado local
        setMedications((prev) =>
          prev.map((med) =>
            med.scheduleId === scheduleId
              ? { ...med, status: 'confirmed' as const, taken: true }
              : med
          )
        );
      } else {
        throw new Error(result.error?.message || 'Erro ao confirmar medicamento');
      }
    } catch (err) {
      setError('Não foi possível confirmar o medicamento');
      console.error('Erro ao confirmar medicamento:', err);
      throw err; // Re-throw para o componente tratar
    }
  }, []);

  const postponeMedication = useCallback(
    async (scheduleId: string, minutes = 30) => {
      try {
        // Usando serviço MOCK - trocar por serviço real quando backend estiver pronto
        const result = await medicationServiceMock.postponeMedication(scheduleId, minutes);

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
    [fetchMedications]
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

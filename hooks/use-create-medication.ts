import { useMutation, useQueryClient } from '@tanstack/react-query';
import { medicationService } from '@/lib/services/medication-service';
import { showToast } from '@/utils/toast';
import { useAuth } from '@/contexts/auth-context';

export interface CreateMedicationData {
  name: string;
  dosage: string;
  frequency: string;
  startTime: string;
  intervalHours: number;
  stock: number;
  expiresAt?: string;
  notes?: string;
}

export function useCreateMedication() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const createMedicationMutation = useMutation({
    mutationFn: async (data: CreateMedicationData) => {
      // Preparar dados para o backend (enviar enum values diretamente)
      const medicationData = {
        name: data.name,
        dosage: data.dosage,
        frequency: data.frequency, // Já vem como enum value correto
        startTime: data.startTime,
        intervalHours: data.intervalHours || 24, // padrão 24 horas
        stock: data.stock,
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString() : undefined,
        notes: data.notes,
      };

      // Chamar API real
      const response = await medicationService.createMedication(medicationData);
      return response;
    },
    onSuccess: () => {
      // Invalidar queries relacionadas para atualizar a UI automaticamente
      queryClient.invalidateQueries({ queryKey: ['today-medications'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      showToast('Medicamento criado com sucesso!', 'success');
    },
    onError: (err: any) => {

      showToast('Erro ao criar medicamento', 'error');
    },
  });

  // Wrapper para manter compatibilidade com código existente
  const createMedication = async (data: CreateMedicationData) => {
    return createMedicationMutation.mutateAsync(data);
  };

  return {
    createMedication,
    loading: createMedicationMutation.isPending,
    error: createMedicationMutation.error?.message || null,
    isCreating: createMedicationMutation.isPending,
  };
}

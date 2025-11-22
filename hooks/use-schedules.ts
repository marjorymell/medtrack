import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { scheduleService } from '@/lib/services/schedule-service';
import { Schedule, CreateScheduleData, UpdateScheduleData } from '@/types/schedule';
import { showToast } from '@/utils/toast';

/**
 * Hook para gerenciar agendamentos de medicamentos
 */
export function useSchedules() {
  const queryClient = useQueryClient();

  /**
   * Busca agendamentos de um medicamento
   */
  const useSchedulesByMedication = (medicationId: string, isActive?: boolean) => {
    return useQuery({
      queryKey: ['schedules', 'medication', medicationId, isActive],
      queryFn: async () => {
        const response = await scheduleService.getSchedulesByMedication(medicationId, isActive);
        return response.data || [];
      },
      enabled: !!medicationId,
    });
  };

  /**
   * Busca agendamentos de um usuário
   */
  const useSchedulesByUser = (userId: string, isActive?: boolean) => {
    return useQuery({
      queryKey: ['schedules', 'user', userId, isActive],
      queryFn: async () => {
        const response = await scheduleService.getSchedulesByUser(userId, isActive);
        return response.data || [];
      },
      enabled: !!userId,
    });
  };

  /**
   * Busca um agendamento específico
   */
  const useScheduleById = (scheduleId: string) => {
    return useQuery({
      queryKey: ['schedules', scheduleId],
      queryFn: async () => {
        const response = await scheduleService.getScheduleById(scheduleId);
        return response.data;
      },
      enabled: !!scheduleId,
    });
  };

  /**
   * Criar agendamento customizado
   */
  const createScheduleMutation = useMutation({
    mutationFn: async (data: CreateScheduleData) => {
      const response = await scheduleService.createCustomSchedule(data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Erro ao criar agendamento');
      }
      return response.data;
    },
    onSuccess: (_data: Schedule | undefined, variables: CreateScheduleData) => {
      queryClient.invalidateQueries({
        queryKey: ['schedules', 'medication', variables.medicationId],
      });
      queryClient.invalidateQueries({ queryKey: ['schedules', 'user'] });
      showToast('Agendamento criado com sucesso!', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Erro ao criar agendamento', 'error');
    },
  });

  /**
   * Atualizar agendamento
   */
  const updateScheduleMutation = useMutation({
    mutationFn: async ({ scheduleId, data }: { scheduleId: string; data: UpdateScheduleData }) => {
      const response = await scheduleService.updateSchedule(scheduleId, data);
      if (!response.success) {
        throw new Error(response.error?.message || 'Erro ao atualizar agendamento');
      }
      return response.data;
    },
    onSuccess: (_data: Schedule | undefined) => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      showToast('Agendamento atualizado com sucesso!', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Erro ao atualizar agendamento', 'error');
    },
  });

  /**
   * Ativar/desativar agendamento
   */
  const toggleScheduleMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      const response = await scheduleService.toggleSchedule(scheduleId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Erro ao alternar agendamento');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      showToast('Status do agendamento alterado!', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Erro ao alternar agendamento', 'error');
    },
  });

  /**
   * Deletar agendamento
   */
  const deleteScheduleMutation = useMutation({
    mutationFn: async (scheduleId: string) => {
      const response = await scheduleService.deleteSchedule(scheduleId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Erro ao deletar agendamento');
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      showToast('Agendamento removido com sucesso!', 'success');
    },
    onError: (error: Error) => {
      showToast(error.message || 'Erro ao deletar agendamento', 'error');
    },
  });

  return {
    // Queries
    useSchedulesByMedication,
    useSchedulesByUser,
    useScheduleById,

    // Mutations
    createSchedule: createScheduleMutation.mutateAsync,
    updateSchedule: updateScheduleMutation.mutateAsync,
    toggleSchedule: toggleScheduleMutation.mutateAsync,
    deleteSchedule: deleteScheduleMutation.mutateAsync,

    // Estados
    isCreating: createScheduleMutation.isPending,
    isUpdating: updateScheduleMutation.isPending,
    isToggling: toggleScheduleMutation.isPending,
    isDeleting: deleteScheduleMutation.isPending,
  };
}

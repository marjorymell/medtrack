import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, User } from '@/services/user-service';
import { authService } from '@/services/auth-service';
import { showToast } from '@/utils/toast';
import { useAuth } from '@/contexts/auth-context';

export function useUser() {
  const { token, logout } = useAuth();
  const queryClient = useQueryClient();

  // Query para buscar dados do usuário atual
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['current-user'],
    queryFn: async () => {
      if (!token) throw new Error('Token não disponível');
      return await userService.getCurrentUser(token);
    },
    enabled: !!token, // Só executar se tiver token
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutation para atualizar usuário
  const updateUserMutation = useMutation({
    mutationFn: async ({
      userId,
      data,
    }: {
      userId: string;
      data: { name?: string; email?: string };
    }) => {
      if (!token) throw new Error('Token não disponível');
      return await userService.updateUser(userId, data, token);
    },
    onSuccess: (updatedUser) => {
      // Atualizar cache com dados novos
      queryClient.setQueryData(['current-user'], updatedUser);
      showToast('Dados atualizados com sucesso', 'success');
    },
    onError: (err: any) => {

      showToast('Erro ao atualizar dados', 'error');
    },
  });

  // Mutation para deletar usuário
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!token) throw new Error('Token não disponível');
      await userService.deleteUser(userId, token);
    },
    onSuccess: () => {
      // Limpar cache e fazer logout
      queryClient.removeQueries({ queryKey: ['current-user'] });
      logout();
      showToast('Conta deletada com sucesso', 'success');
    },
    onError: (err: any) => {

      showToast('Erro ao deletar conta', 'error');
    },
  });

  // Funções wrapper para manter compatibilidade
  const updateUser = async (data: { name?: string; email?: string }) => {
    if (!user) return;
    return updateUserMutation.mutateAsync({ userId: user.id, data });
  };

  const deleteUser = async () => {
    if (!user) return;
    return deleteUserMutation.mutateAsync(user.id);
  };

  return {
    user,
    loading: isLoading,
    error: error?.message || null,
    refetch,
    updateUser,
    deleteUser,
    // Estados das mutations para feedback na UI
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  };
}

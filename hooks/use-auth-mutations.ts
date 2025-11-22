import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, LoginRequest, RegisterRequest } from '@/services/auth-service';
import { showToast } from '@/utils/toast';

/**
 * Hook para operações de autenticação usando TanStack Query
 */
export function useAuthMutations() {
  const queryClient = useQueryClient();

  // Mutation para login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      return await authService.login(credentials);
    },
    onSuccess: (response) => {
      // Invalidar queries que dependem do estado de autenticação
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['today-medications'] });
      showToast('Login realizado com sucesso!', 'success');
    },
    onError: (err: any) => {

      showToast(err.message || 'Erro no login', 'error');
    },
  });

  // Mutation para registro
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterRequest) => {
      return await authService.register(userData);
    },
    onSuccess: (response) => {
      // Invalidar queries que dependem do estado de autenticação
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
      queryClient.invalidateQueries({ queryKey: ['medications'] });
      queryClient.invalidateQueries({ queryKey: ['today-medications'] });
      showToast('Conta criada com sucesso!', 'success');
    },
    onError: (err: any) => {

      showToast(err.message || 'Erro ao criar conta', 'error');
    },
  });

  // Mutation para logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await authService.logout();
    },
    onSuccess: () => {
      // Limpar todas as queries em cache
      queryClient.clear();
      showToast('Logout realizado com sucesso', 'success');
    },
    onError: (err: any) => {

      showToast('Erro ao fazer logout', 'error');
    },
  });

  return {
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    // Estados das mutations para feedback na UI
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}

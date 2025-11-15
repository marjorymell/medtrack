import { useState, useEffect } from 'react';
import { userService, User } from '@/services/user-service';
import { authService } from '@/services/auth-service';
import { showToast } from '@/utils/toast';

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = await authService.getToken();
      if (!token) {
        setUser(null);
        return;
      }

      const userData = await userService.getCurrentUser(token);
      setUser(userData);
    } catch (err: any) {
      console.error('Erro ao buscar dados do usuário:', err);
      setError(err.message || 'Erro ao carregar dados do usuário');
      showToast('Erro ao carregar dados do usuário', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (data: { name?: string; email?: string }) => {
    if (!user) return;

    try {
      setLoading(true);
      const updatedUser = await userService.updateUser(user.id, data);
      setUser(updatedUser);
      showToast('Dados atualizados com sucesso', 'success');
    } catch (err: any) {
      console.error('Erro ao atualizar usuário:', err);
      setError(err.message || 'Erro ao atualizar dados');
      showToast('Erro ao atualizar dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!user) return;

    try {
      setLoading(true);
      await userService.deleteUser(user.id);
      setUser(null);
      showToast('Conta deletada com sucesso', 'success');
    } catch (err: any) {
      console.error('Erro ao deletar usuário:', err);
      setError(err.message || 'Erro ao deletar conta');
      showToast('Erro ao deletar conta', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
    updateUser,
    deleteUser,
  };
}

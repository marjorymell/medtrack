import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useAuthMutations } from '@/hooks/use-auth-mutations';
import { authService } from '@/lib/services/auth-service';
import { showToast } from '@/utils/toast';

jest.mock('@/lib/services/auth-service');
jest.mock('@/utils/toast', () => ({ showToast: jest.fn() }));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  return Wrapper;
};

describe('useAuthMutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve fazer login com sucesso', async () => {
    const mockResponse = {
      success: true,
      data: {
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          createdAt: '',
          updatedAt: '',
        },
        token: 'mock-token',
      },
    };
    (authService.login as jest.Mock).mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useAuthMutations(), { wrapper: createWrapper() });
    await result.current.login({ email: 'test@example.com', password: '123456' });
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalled();
      expect(showToast).toHaveBeenCalled();
    });
  });
});

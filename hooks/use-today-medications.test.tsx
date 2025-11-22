import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useTodayMedications } from './use-today-medications';
import { medicationServiceMock } from '@/mocks/medication-service-mock';

// Mock do contexto de autenticação
jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    token: 'mock-token',
    user: { id: 'user-1', name: 'Test User' },
  }),
}));

// Mock do serviço para forçar uso do mock
jest.mock('@/lib/services/medication-service', () => ({
  medicationService: {},
}));

// Mock do toast
jest.mock('@/utils/toast', () => ({
  showToast: jest.fn(),
}));

// Helper para criar wrapper do QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return Wrapper;
};

describe('useTodayMedications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.EXPO_PUBLIC_USE_MOCK_API = 'true';
  });

  it('deve retornar medicamentos do dia corretamente', async () => {
    const { result } = renderHook(() => useTodayMedications(), {
      wrapper: createWrapper(),
    });

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 }
    );

    expect(result.current.medications).toBeDefined();
    expect(Array.isArray(result.current.medications)).toBe(true);
    expect(result.current.medications.length).toBeGreaterThan(0);
  });

  it('deve ter estado de loading inicial', () => {
    const { result } = renderHook(() => useTodayMedications(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('deve fornecer função de confirmação de medicamento', async () => {
    const { result } = renderHook(() => useTodayMedications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 });

    expect(result.current.confirmMedication).toBeDefined();
    expect(typeof result.current.confirmMedication).toBe('function');
  });

  it('deve fornecer função de adiamento de medicamento', async () => {
    const { result } = renderHook(() => useTodayMedications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 });

    expect(result.current.postponeMedication).toBeDefined();
    expect(typeof result.current.postponeMedication).toBe('function');
  });

  it('deve fornecer função de refetch', async () => {
    const { result } = renderHook(() => useTodayMedications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 });

    expect(result.current.refetch).toBeDefined();
    expect(typeof result.current.refetch).toBe('function');
  });

  it('deve ter estados de loading para mutações', async () => {
    const { result } = renderHook(() => useTodayMedications(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false), { timeout: 3000 });

    expect(result.current.isConfirming).toBeDefined();
    expect(result.current.isPostponing).toBeDefined();
    expect(result.current.isConfirming).toBe(false);
    expect(result.current.isPostponing).toBe(false);
  });
});

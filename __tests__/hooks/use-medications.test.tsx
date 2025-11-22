import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useMedications } from '@/hooks/use-medications';
import * as medicationService from '@/lib/services/medication-service';
import { showToast } from '@/utils/toast';

// Mock do contexto de autenticação
jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    token: 'mock-token',
    user: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
  }),
}));

// Mock do medication service
jest.mock('@/lib/services/medication-service');

// Mock do toast
jest.mock('@/utils/toast', () => ({
  showToast: jest.fn(),
}));

const mockMedications = [
  {
    id: '1',
    name: 'Paracetamol',
    dosage: '750mg',
    frequency: 'daily',
    startTime: '08:00',
    intervalHours: 8,
    stock: 30,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Ibuprofeno',
    dosage: '600mg',
    frequency: 'twice-daily',
    startTime: '09:00',
    intervalHours: 12,
    stock: 20,
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
];

// Helper para criar wrapper do QueryClient
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

describe('useMedications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query - Listar medicamentos', () => {
    it('deve carregar medicamentos com sucesso', async () => {
      (medicationService.medicationService.getMedications as jest.Mock).mockResolvedValue({
        success: true,
        data: mockMedications,
      });

      const { result } = renderHook(() => useMedications(), {
        wrapper: createWrapper(),
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.medications).toEqual(mockMedications);
      expect(result.current.error).toBeNull();
    });

    it('deve tratar medicamentos com estrutura de items', async () => {
      (medicationService.medicationService.getMedications as jest.Mock).mockResolvedValue({
        success: true,
        data: { items: mockMedications, total: 2 },
      });

      const { result } = renderHook(() => useMedications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.medications).toEqual(mockMedications);
    });

    it('deve tratar erro ao carregar medicamentos', async () => {
      (medicationService.medicationService.getMedications as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Erro ao carregar' },
      });

      const { result } = renderHook(() => useMedications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.error).toBe('Erro ao carregar');
    });
  });

  describe('Mutation - Criar medicamento', () => {
    it('deve criar medicamento com sucesso', async () => {
      const newMedication = {
        name: 'Aspirina',
        dosage: '100mg',
        frequency: 'daily',
        startTime: '10:00',
        intervalHours: 24,
        stock: 15,
      };

      (medicationService.medicationService.createMedication as jest.Mock).mockResolvedValue({
        success: true,
        data: { id: '3', ...newMedication },
      });

      const { result } = renderHook(() => useMedications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await result.current.createMedication(newMedication);

      expect(medicationService.medicationService.createMedication).toHaveBeenCalledWith(
        newMedication
      );
      expect(showToast).toHaveBeenCalledWith('Medicamento criado com sucesso', 'success');
    });

    it('deve tratar erro ao criar medicamento', async () => {
      const newMedication = {
        name: 'Aspirina',
        dosage: '100mg',
        frequency: 'daily',
        startTime: '10:00',
        intervalHours: 24,
        stock: 15,
      };

      (medicationService.medicationService.createMedication as jest.Mock).mockRejectedValue(
        new Error('Erro ao criar')
      );

      const { result } = renderHook(() => useMedications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await expect(result.current.createMedication(newMedication)).rejects.toThrow();
      expect(showToast).toHaveBeenCalledWith('Erro ao criar medicamento', 'error');
    });
  });

  describe('Mutation - Atualizar medicamento', () => {
    it('deve atualizar medicamento com sucesso', async () => {
      (medicationService.medicationService.updateMedication as jest.Mock).mockResolvedValue({
        success: true,
        data: { ...mockMedications[0], name: 'Paracetamol Atualizado' },
      });

      const { result } = renderHook(() => useMedications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await result.current.updateMedication('1', { name: 'Paracetamol Atualizado' });

      expect(medicationService.medicationService.updateMedication).toHaveBeenCalledWith('1', {
        name: 'Paracetamol Atualizado',
      });
      expect(showToast).toHaveBeenCalledWith('Medicamento atualizado com sucesso', 'success');
    });

    it('deve tratar erro ao atualizar medicamento', async () => {
      (medicationService.medicationService.updateMedication as jest.Mock).mockRejectedValue(
        new Error('Erro ao atualizar')
      );

      const { result } = renderHook(() => useMedications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await expect(result.current.updateMedication('1', { name: 'Novo Nome' })).rejects.toThrow();
      expect(showToast).toHaveBeenCalledWith(
        expect.stringContaining('Erro ao atualizar medicamento'),
        'error'
      );
    });
  });

  describe('Mutation - Deletar medicamento', () => {
    it('deve deletar medicamento com sucesso', async () => {
      (medicationService.medicationService.deleteMedication as jest.Mock).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useMedications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await result.current.deleteMedication('1');

      expect(medicationService.medicationService.deleteMedication).toHaveBeenCalledWith('1');
      expect(showToast).toHaveBeenCalledWith('Medicamento removido com sucesso', 'success');
    });

    it('deve tratar erro ao deletar medicamento', async () => {
      (medicationService.medicationService.deleteMedication as jest.Mock).mockResolvedValue({
        success: false,
        error: { message: 'Não encontrado' },
      });

      const { result } = renderHook(() => useMedications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await expect(result.current.deleteMedication('1')).rejects.toThrow();
      expect(showToast).toHaveBeenCalledWith(
        expect.stringContaining('Erro ao remover medicamento'),
        'error'
      );
    });
  });

  describe('Mutation - Atualizar estoque', () => {
    it('deve atualizar estoque com sucesso', async () => {
      (medicationService.medicationService.updateMedicationStock as jest.Mock).mockResolvedValue({
        success: true,
      });

      const { result } = renderHook(() => useMedications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await result.current.updateStock('1', 50);

      expect(medicationService.medicationService.updateMedicationStock).toHaveBeenCalledWith(
        '1',
        50
      );
      expect(showToast).toHaveBeenCalledWith('Estoque atualizado com sucesso', 'success');
    });

    it('deve tratar erro ao atualizar estoque', async () => {
      (medicationService.medicationService.updateMedicationStock as jest.Mock).mockRejectedValue(
        new Error('Erro ao atualizar estoque')
      );

      const { result } = renderHook(() => useMedications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      await expect(result.current.updateStock('1', 50)).rejects.toThrow();
      expect(showToast).toHaveBeenCalledWith('Erro ao atualizar estoque', 'error');
    });
  });

  describe('Estados de loading', () => {
    it('deve ter flags de loading para cada operação', async () => {
      (medicationService.medicationService.getMedications as jest.Mock).mockResolvedValue({
        success: true,
        data: mockMedications,
      });

      const { result } = renderHook(() => useMedications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.isCreating).toBe(false);
      expect(result.current.isUpdating).toBe(false);
      expect(result.current.isDeleting).toBe(false);
      expect(result.current.isUpdatingStock).toBe(false);
    });
  });

  describe('Refetch', () => {
    it('deve fornecer função de refetch', async () => {
      (medicationService.medicationService.getMedications as jest.Mock).mockResolvedValue({
        success: true,
        data: mockMedications,
      });

      const { result } = renderHook(() => useMedications(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.loading).toBe(false));

      expect(result.current.refetch).toBeDefined();
      expect(typeof result.current.refetch).toBe('function');
    });
  });
});

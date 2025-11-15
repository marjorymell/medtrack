import { useState } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createMedication = async (data: CreateMedicationData) => {
    try {
      setLoading(true);
      setError(null);

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

      showToast('Medicamento criado com sucesso!', 'success');
      return { success: true, data: response.data };
    } catch (err: any) {
      console.error('Erro ao criar medicamento:', err);
      setError(err.message || 'Erro ao criar medicamento');
      showToast('Erro ao criar medicamento', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    createMedication,
    loading,
    error,
  };
}

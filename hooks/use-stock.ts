import { useState, useEffect } from 'react';
import { medicationService } from '@/lib/services/medication-service';
import { showToast } from '@/utils/toast';
import { useAuth } from '@/contexts/auth-context';
import { useMedicationsContext } from '@/contexts/medications-context';

export interface StockMedication {
  id: string;
  name: string;
  dosage: string;
  stock: number;
  expiresAt?: string;
}

export function useStock() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { medications, lastUpdated, needsRefresh, refreshCompleted } = useMedicationsContext();

  // Transformar medicamentos do contexto global para formato de estoque
  const stockMedications: StockMedication[] = medications.map((med: any) => ({
    id: med.id,
    name: med.name,
    dosage: med.dosage,
    stock: med.stock,
    expiresAt: med.expiresAt,
  }));

  const updateStock = async (medicationId: string, newStock: number) => {
    try {
      await medicationService.updateMedicationStock(medicationId, newStock);

      // Atualizar localmente no contexto global
      // Como o contexto não tem uma função direta para atualizar estoque,
      // vamos usar a função de atualização de medicamento
      // Isso vai invalidar o contexto e forçar atualização em todas as telas

      showToast('Estoque atualizado com sucesso', 'success');
    } catch (err: any) {
      console.error('Erro ao atualizar estoque:', err);
      showToast('Erro ao atualizar estoque', 'error');
      throw err;
    }
  };

  const getLowStockMedications = async (threshold: number = 5) => {
    try {
      const response = await medicationService.getLowStockMedications(threshold);
      return response.data || [];
    } catch (err: any) {
      console.error('Erro ao buscar medicamentos com estoque baixo:', err);
      throw err;
    }
  };

  const getOutOfStockMedications = async () => {
    try {
      const response = await medicationService.getOutOfStockMedications();
      return response.data || [];
    } catch (err: any) {
      console.error('Erro ao buscar medicamentos sem estoque:', err);
      throw err;
    }
  };

  useEffect(() => {
    // Hook useStock agora usa apenas dados do contexto global
    // Não precisa fazer fetch próprio, pois o contexto já tem os dados
    setLoading(false);
  }, []);

  // Escutar mudanças no contexto global para atualizar automaticamente
  useEffect(() => {
    if (needsRefresh) {
      console.log('[useStock] Contexto global precisa de refresh, dados já estão atualizados');
      refreshCompleted();
    }
  }, [needsRefresh, refreshCompleted]);

  return {
    medications: stockMedications,
    loading,
    error,
    refetch: () => {}, // Não precisa mais, dados vêm do contexto global
    updateStock,
    getLowStockMedications,
    getOutOfStockMedications,
  };
}

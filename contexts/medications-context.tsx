import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Interface baseada no hook use-medications.ts
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startTime: string;
  intervalHours: number;
  stock: number;
  expiresAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface MedicationsContextType {
  // Estado global
  medications: Medication[];
  lastUpdated: Date | null;

  // Ações
  invalidateMedications: () => void;
  updateMedicationLocally: (medicationId: string, updates: Partial<Medication>) => void;
  addMedicationLocally: (medication: Medication) => void;
  removeMedicationLocally: (medicationId: string) => void;

  // Utilitários
  getMedicationById: (id: string) => Medication | undefined;
  getStockForMedication: (id: string) => number;
}

const MedicationsContext = createContext<MedicationsContextType | undefined>(undefined);

interface MedicationsProviderProps {
  children: ReactNode;
}

export function MedicationsProvider({ children }: MedicationsProviderProps) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const invalidateMedications = useCallback(() => {
    console.log('[MedicationsContext] Invalidando cache de medicamentos');
    setLastUpdated(new Date());
  }, []);

  const updateMedicationLocally = useCallback(
    (medicationId: string, updates: Partial<Medication>) => {
      console.log(
        `[MedicationsContext] Atualizando medicamento localmente: ${medicationId}`,
        updates
      );
      setMedications((prev) =>
        prev.map((med) => (med.id === medicationId ? { ...med, ...updates } : med))
      );
      invalidateMedications();
    },
    [invalidateMedications]
  );

  const addMedicationLocally = useCallback(
    (medication: Medication) => {
      console.log(`[MedicationsContext] Adicionando medicamento localmente: ${medication.id}`);
      setMedications((prev) => [...prev, medication]);
      invalidateMedications();
    },
    [invalidateMedications]
  );

  const removeMedicationLocally = useCallback(
    (medicationId: string) => {
      console.log(`[MedicationsContext] Removendo medicamento localmente: ${medicationId}`);
      setMedications((prev) => prev.filter((med) => med.id !== medicationId));
      invalidateMedications();
    },
    [invalidateMedications]
  );

  const getMedicationById = useCallback(
    (id: string) => {
      return medications.find((med) => med.id === id);
    },
    [medications]
  );

  const getStockForMedication = useCallback(
    (id: string) => {
      const medication = medications.find((med) => med.id === id);
      return medication?.stock || 0;
    },
    [medications]
  );

  const value: MedicationsContextType = {
    medications,
    lastUpdated,
    invalidateMedications,
    updateMedicationLocally,
    addMedicationLocally,
    removeMedicationLocally,
    getMedicationById,
    getStockForMedication,
  };

  return <MedicationsContext.Provider value={value}>{children}</MedicationsContext.Provider>;
}

export function useMedicationsContext() {
  const context = useContext(MedicationsContext);
  if (context === undefined) {
    throw new Error('useMedicationsContext must be used within a MedicationsProvider');
  }
  return context;
}

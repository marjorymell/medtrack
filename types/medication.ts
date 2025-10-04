/**
 * Interface base para um medicamento
 */
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  postponed: boolean;
  userId: string;
}

/**
 * Interface para agendamento de medicamento
 */
export interface MedicationSchedule {
  id: string;
  medicationId: string;
  scheduledTime: string; // ISO 8601 format
  status: 'pending' | 'confirmed' | 'postponed' | 'missed';
  confirmedAt?: string;
  postponedTo?: string;
}

/**
 * Interface para medicamentos do dia (união de Medication + Schedule)
 */
export interface TodayMedication extends Medication {
  scheduleId: string;
  scheduledTime: string;
  status: MedicationSchedule['status'];
}

/**
 * Interface para resposta da API
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
}

/**
 * Interface para histórico de medicamentos
 */
export interface MedicationHistory {
  id: string;
  scheduleId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
  status: 'confirmed' | 'missed' | 'postponed';
  confirmedAt?: string;
  postponedTo?: string;
}

/**
 * Interface para estoque de medicamentos
 */
export interface MedicationStock {
  id: string;
  name: string;
  dosage: string;
  currentStock: number;
  minStock: number;
  expiryDate: string;
}

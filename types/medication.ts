/**
 * Interface base para um medicamento
 */
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startTime: string;
  intervalHours: number;
  stock: number;
  expiresAt?: string;
  notes?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Dados para criar novo medicamento
 */
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

/**
 * Dados para atualizar medicamento
 */
export interface UpdateMedicationData {
  name?: string;
  dosage?: string;
  frequency?: string;
  startTime?: string;
  intervalHours?: number;
  stock?: number;
  expiresAt?: string;
  notes?: string;
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

// REMOVIDO: ApiResponse movido para types/api.ts

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

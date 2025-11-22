/**
 * Tipos de agendamento de medicamentos
 * Consolidado de lib/services/schedule-service.ts
 */

export interface Schedule {
  id: string;
  medicationId: string;
  scheduledTime: string; // ISO 8601 time string (HH:mm)
  daysOfWeek?: number[]; // 0-6 (domingo-sábado)
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleData {
  medicationId: string;
  scheduledTime: string;
  daysOfWeek?: number[];
  isActive?: boolean;
}

export interface UpdateScheduleData {
  scheduledTime?: string;
  daysOfWeek?: number[];
  isActive?: boolean;
}

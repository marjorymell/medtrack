/**
 * Tipos de histórico e adesão
 * Consolidado de lib/services/history-service.ts
 */

export enum HistoryAction {
  TAKEN = 'TAKEN',
  SKIPPED = 'SKIPPED',
  MISSED = 'MISSED',
  POSTPONED = 'POSTPONED',
  RESTOCKED = 'RESTOCKED',
}

export interface CreateHistoryInput {
  medicationId?: string;
  scheduleId?: string;
  scheduledFor?: string;
  action: HistoryAction;
  quantity?: number;
  notes?: string;
  postponedTo?: string;
}

export interface AdherenceStats {
  total: number;
  taken: number;
  skipped: number;
  missed: number;
  adherenceRate: string; // Percentual formatado (ex: "85.5%")
}

export interface HistoryFilters {
  startDate?: string;
  endDate?: string;
  action?: HistoryAction;
  limit?: number;
}

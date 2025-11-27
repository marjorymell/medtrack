import { Frequency } from './medication';

export interface SyncSchedule {
  id: string;
  medicationId: string;
  name: string;
  dosage: string;
  frequency: Frequency
  days: string[];
  time: string;
  startDate: string;
  intervalHours?: number;
  endDate?: string;
  stock: number;
}

export interface SyncSettings {
  enablePush: boolean;
  reminderBefore: number;
}

export interface SyncResponse {
  timestamp: string;
  schedules: SyncSchedule[];
  settings: SyncSettings;
}

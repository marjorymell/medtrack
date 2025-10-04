import { TodayMedication } from '@/types/medication';

/**
 * Dados mockados de medicamentos para desenvolvimento
 * Simula a resposta da API /v1/medications/today
 */
export const MOCK_TODAY_MEDICATIONS: TodayMedication[] = [
  {
    id: '1',
    scheduleId: 'schedule-1',
    name: 'Paracetamol',
    dosage: '500mg',
    time: '08:00',
    scheduledTime: new Date().setHours(8, 0, 0, 0).toString(),
    status: 'pending',
    taken: false,
    postponed: false,
    userId: 'user-1',
  },
  {
    id: '2',
    scheduleId: 'schedule-2',
    name: 'Ibuprofeno',
    dosage: '200mg',
    time: '12:00',
    scheduledTime: new Date().setHours(12, 0, 0, 0).toString(),
    status: 'pending',
    taken: false,
    postponed: false,
    userId: 'user-1',
  },
  {
    id: '3',
    scheduleId: 'schedule-3',
    name: 'Amoxicilina',
    dosage: '250mg',
    time: '18:00',
    scheduledTime: new Date().setHours(18, 0, 0, 0).toString(),
    status: 'pending',
    taken: false,
    postponed: false,
    userId: 'user-1',
  },
  {
    id: '4',
    scheduleId: 'schedule-4',
    name: 'Omeprazol',
    dosage: '20mg',
    time: '07:30',
    scheduledTime: new Date().setHours(7, 30, 0, 0).toString(),
    status: 'pending',
    taken: false,
    postponed: false,
    userId: 'user-1',
  },
  {
    id: '5',
    scheduleId: 'schedule-5',
    name: 'Losartana',
    dosage: '50mg',
    time: '20:00',
    scheduledTime: new Date().setHours(20, 0, 0, 0).toString(),
    status: 'pending',
    taken: false,
    postponed: false,
    userId: 'user-1',
  },
];

/**
 * Simula dados de histórico de medicamentos
 */
export const MOCK_MEDICATION_HISTORY = [
  {
    id: 'hist-1',
    scheduleId: 'schedule-old-1',
    medicationName: 'Paracetamol',
    dosage: '500mg',
    scheduledTime: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
    status: 'confirmed' as const,
    confirmedAt: new Date(Date.now() - 86400000 + 300000).toISOString(),
  },
  {
    id: 'hist-2',
    scheduleId: 'schedule-old-2',
    medicationName: 'Ibuprofeno',
    dosage: '200mg',
    scheduledTime: new Date(Date.now() - 86400000).toISOString(),
    status: 'confirmed' as const,
    confirmedAt: new Date(Date.now() - 86400000 + 600000).toISOString(),
  },
  {
    id: 'hist-3',
    scheduleId: 'schedule-old-3',
    medicationName: 'Amoxicilina',
    dosage: '250mg',
    scheduledTime: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
    status: 'missed' as const,
  },
];

/**
 * Simula dados de estoque de medicamentos
 */
export const MOCK_MEDICATION_STOCK = [
  {
    id: '1',
    name: 'Paracetamol',
    dosage: '500mg',
    currentStock: 15,
    minStock: 5,
    expiryDate: '2025-12-31',
  },
  {
    id: '2',
    name: 'Ibuprofeno',
    dosage: '200mg',
    currentStock: 8,
    minStock: 10,
    expiryDate: '2025-11-15',
  },
  {
    id: '3',
    name: 'Amoxicilina',
    dosage: '250mg',
    currentStock: 20,
    minStock: 5,
    expiryDate: '2026-03-20',
  },
  {
    id: '4',
    name: 'Omeprazol',
    dosage: '20mg',
    currentStock: 3,
    minStock: 5,
    expiryDate: '2025-10-30',
  },
  {
    id: '5',
    name: 'Losartana',
    dosage: '50mg',
    currentStock: 25,
    minStock: 10,
    expiryDate: '2026-06-15',
  },
];

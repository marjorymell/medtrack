import { NotificationRequestInput } from 'expo-notifications';

/**
 * Tipos para o sistema de notificações MedTrack
 */

export interface NotificationData {
  medicationId: string;
  scheduleId: string;
  medicationName: string;
  dosage: string;
  scheduledTime: string;
}

export interface NotificationSettings {
  enablePush: boolean;
  enableEmail: boolean;
  reminderBefore: number; // minutos antes
  quietHoursStart?: string; // HH:MM
  quietHoursEnd?: string; // HH:MM
}

export interface DeviceToken {
  token: string;
  platform: 'ios' | 'android';
  userId: string;
}

export interface ScheduledNotification {
  id: string;
  medicationId: string;
  scheduleId: string;
  scheduledTime: Date;
  notificationId?: string; // ID da notificação agendada no dispositivo
}

export interface NotificationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  status: 'granted' | 'denied' | 'undetermined';
}

// Tipos para API do backend
export interface RegisterDeviceRequest {
  token: string;
  platform: 'ios' | 'android';
}

export interface RegisterDeviceResponse {
  success: boolean;
  message: string;
}

export interface ScheduleNotificationRequest {
  medicationId: string;
  scheduleId: string;
  scheduledTime: string;
  medicationName: string;
  dosage: string;
}

export interface ScheduleNotificationResponse {
  success: boolean;
  notificationId?: string;
  message: string;
}
/**
 * Módulos de Notificação - MedTrack
 *
 * Este arquivo centraliza as exportações de todos os módulos
 * relacionados ao sistema de notificações push.
 */

// Hooks
export { useNotificationPermissions } from './hooks/use-notification-permissions';
export { useDeviceToken } from './hooks/use-device-token';
export { useNotificationScheduler } from './hooks/use-notification-scheduler';
export { useNotificationHandler } from './hooks/use-notification-handler';

// Serviços
export { notificationService } from './services/notification-service';

// Componentes
export { NotificationToggle, PushNotificationToggle } from './components/notification-toggle';
export { QuietHoursPicker } from './components/quiet-hours-picker';
export { NotificationSettingsScreen } from './components/notification-settings';

// Tipos
export type {
  NotificationData,
  NotificationSettings,
  DeviceToken,
  ScheduledNotification,
  NotificationPermissionStatus,
  RegisterDeviceRequest,
  RegisterDeviceResponse,
  ScheduleNotificationRequest,
  ScheduleNotificationResponse,
} from './types/notification';

// Utilitários
export * from './utils/notification-utils';

/**
 * Utilitários para o sistema de notificações
 */

/**
 * Verificar se uma data está dentro do horário de silêncio
 */
export function isInQuietHours(
  date: Date,
  quietHoursStart?: string,
  quietHoursEnd?: string
): boolean {
  if (!quietHoursStart || !quietHoursEnd) {
    return false;
  }

  const [startHour, startMinute] = quietHoursStart.split(':').map(Number);
  const [endHour, endMinute] = quietHoursEnd.split(':').map(Number);

  const startTime = new Date(date);
  startTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, endMinute, 0, 0);

  // Se o horário de fim é menor que o início, significa que cruza a meia-noite
  if (endTime < startTime) {
    endTime.setDate(endTime.getDate() + 1);
    return date >= startTime || date <= endTime;
  }

  return date >= startTime && date <= endTime;
}

/**
 * Calcular o próximo horário válido para notificação (fora do horário de silêncio)
 */
export function getNextValidNotificationTime(
  scheduledTime: Date,
  quietHoursStart?: string,
  quietHoursEnd?: string
): Date {
  if (!isInQuietHours(scheduledTime, quietHoursStart, quietHoursEnd)) {
    return scheduledTime;
  }

  // Se está no horário de silêncio, adiar para depois do horário de silêncio
  if (!quietHoursEnd) {
    return scheduledTime;
  }

  const [endHour, endMinute] = quietHoursEnd.split(':').map(Number);
  const nextTime = new Date(scheduledTime);
  nextTime.setHours(endHour, endMinute, 0, 0);

  // Se o horário de fim já passou hoje, mover para amanhã
  if (nextTime <= scheduledTime) {
    nextTime.setDate(nextTime.getDate() + 1);
  }

  return nextTime;
}

/**
 * Formatar horário para exibição
 */
export function formatNotificationTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Calcular minutos até o próximo lembrete
 */
export function getMinutesUntilReminder(reminderTime: Date): number {
  const now = new Date();
  const diffMs = reminderTime.getTime() - now.getTime();
  return Math.max(0, Math.floor(diffMs / (1000 * 60)));
}

/**
 * Verificar se uma notificação deve ser silenciosa
 */
export function shouldBeSilentNotification(
  scheduledTime: Date,
  quietHoursStart?: string,
  quietHoursEnd?: string
): boolean {
  return isInQuietHours(scheduledTime, quietHoursStart, quietHoursEnd);
}
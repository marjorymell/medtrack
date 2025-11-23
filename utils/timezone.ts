/**
 * Timezone utilities for React Native using Expo Localization
 * Handles device timezone and sends to backend
 */

import * as Localization from 'expo-localization';

/**
 * Get device timezone offset in minutes using Expo Localization
 * Returns negative for timezones west of UTC (e.g., -180 for UTC-3)
 * Returns positive for timezones east of UTC (e.g., 60 for UTC+1)
 *
 * @example
 * // Brazil (UTC-3)
 * getTimezoneOffset() // -180
 *
 * // London (UTC+0)
 * getTimezoneOffset() // 0
 *
 * // Tokyo (UTC+9)
 * getTimezoneOffset() // 540
 */
export function getTimezoneOffset(): number {
  try {
    // Tenta usar Expo Localization primeiro
    const calendar = Localization.getCalendars()[0];

    if (calendar?.timeZone) {
      // MÉTODO SIMPLES: Usar Date.getTimezoneOffset() que funciona
      // mesmo com timezone do Expo detectado
      const offset = -new Date().getTimezoneOffset();
      return offset;
    }
  } catch (error) {
    console.warn('⚠️ Erro ao obter timezone do Expo Localization:', error);
  }

  // Fallback para API nativa do JavaScript
  // ATENÇÃO: JavaScript inverte o sinal (positivo para oeste)
  const offset = -new Date().getTimezoneOffset();
  return offset;
}

/**
 * Get timezone name (e.g., "America/Sao_Paulo")
 */
export function getTimezoneName(): string {
  try {
    const timezone = Localization.getCalendars()[0]?.timeZone;
    if (timezone) return timezone;
  } catch (error) {
    console.warn('Erro ao obter nome do timezone:', error);
  }

  // Fallback
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

/**
 * Get current time in user's timezone
 */
export function getCurrentTime(): Date {
  return new Date();
}

/**
 * Format time to HH:mm in user's timezone
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

/**
 * Check if a time has passed today
 * @param timeString - Time in HH:mm format
 */
export function hasTimePassed(timeString: string): boolean {
  const now = new Date();
  const [hours, minutes] = timeString.split(':').map(Number);

  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);

  return now > scheduledTime;
}

/**
 * Get timezone info for debugging
 */
export function getTimezoneInfo() {
  const offset = getTimezoneOffset();
  const hours = Math.floor(Math.abs(offset) / 60);
  const minutes = Math.abs(offset) % 60;
  const sign = offset >= 0 ? '+' : '-';

  // Debug: pegar informações do Expo
  let expoTimezone = 'N/A';
  let expoCalendar = null;
  try {
    const calendar = Localization.getCalendars()[0];
    expoCalendar = calendar;
    expoTimezone = calendar?.timeZone || 'N/A';
  } catch (error) {
    console.error('Erro ao acessar Expo Localization:', error);
  }

  return {
    offset,
    offsetHours: hours,
    offsetMinutes: minutes,
    offsetString: `UTC${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
    timezoneName: getTimezoneName(),
    currentTime: getCurrentTime().toISOString(),
    localTime: getCurrentTime().toLocaleString('pt-BR'),
    // Debug adicional
    expoTimezone,
    expoCalendar,
    jsTimezoneOffset: new Date().getTimezoneOffset(),
    jsTimezoneOffsetInverted: -new Date().getTimezoneOffset(),
  };
}

import { useState, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { scheduleService } from '@/lib/services/schedule-service';
import { showToast } from '@/utils/toast';
import { addMinutes } from 'date-fns';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DateGMT } from '@/utils/get-date-gmt';

const POSTPONED_STORAGE_KEY = 'medtrack_postponed_notifications';

const DAY_MAPPING: Record<string, number> = {
  SUNDAY: 1,
  MONDAY: 2,
  TUESDAY: 3,
  WEDNESDAY: 4,
  THURSDAY: 5,
  FRIDAY: 6,
  SATURDAY: 7,
};

export interface PostponedSchedule {
  id: string;
  originalScheduleId: string,
  medicationName: string;
  dosage: string;
  triggerDate: string;
}

export function useNotificationSync() {
  const [isSyncing, setIsSyncing] = useState(false);

  const postponeNotification = useCallback(async (
    scheduleId: string,
    medicationName: string,
    dosage: string,
    minutes: number = 30,
  ) => {
    try {
      const newTriggerDate = addMinutes(Date.now(), minutes);

      console.log(`[Postpone] Logged to backend for schedule ${scheduleId}`);

      const postponeItem: PostponedSchedule = {
        id: `postpone-${scheduleId}-${DateGMT()}`,
        originalScheduleId: scheduleId,
        medicationName,
        dosage,
        triggerDate: newTriggerDate.toISOString(),
      }
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Lembrete Adiado`,
          body: `Tomar ${medicationName} (${dosage})`,
          data: { ...postponeItem, type: 'postponed_reminder' },
        },
        trigger: { date: newTriggerDate, type: Notifications.SchedulableTriggerInputTypes.DATE }
      });

      const currentStored = await AsyncStorage.getItem(POSTPONED_STORAGE_KEY);
      const list = currentStored ? JSON.parse(currentStored) : [];
      list.push(postponeItem);
      await AsyncStorage.setItem(POSTPONED_STORAGE_KEY, JSON.stringify(list));

      console.info(`[Postpone] Notificação criada para ${newTriggerDate}`);
      showToast('Lembrete adiado com sucesso', 'success');


    } catch (error) {
      console.error(`[Postpone] Error:`, error);
      showToast('Error ao adiar o Lembrete', 'error');
    }
  }, []);

  const syncNotifications = useCallback(async () => {
    try {
      setIsSyncing(true);
      console.log('[useNotificationSync] syncNotifications - 🔄 Starting Notification Sync...');

      const response = await scheduleService.getSyncData();


      if (!response.success || !response.data) {
        console.log(response);
        throw new Error('Failed to fetch sync data');
      }

      const { schedules, settings } = response.data;

      const storedPostponed = await AsyncStorage.getItem(POSTPONED_STORAGE_KEY);
      let postponedList: PostponedSchedule[] = storedPostponed ? JSON.parse(storedPostponed) : [];
      console.log('[useNotificationSync] Postponed list:', postponedList);

      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('[useNotificationSync] syncNotifications - 🗑️ Cleared all notifications');

      if (!settings.enablePush) {
        console.log('[useNotificationSync] syncNotifications - 🔕 Notifications disabled by user settings');
        return;
      }

      let scheduledCount = 0;

      for (const schedule of schedules) {
        const [hours, minutes] = schedule.time.split(':').map(Number);

        const baseDate = new Date();
        baseDate.setHours(hours, minutes, 0, 0);
        const triggerDate = addMinutes(baseDate, -settings.reminderBefore);

        const triggerHour = triggerDate.getHours();
        const triggerMinute = triggerDate.getMinutes();


        for (const dayStr of schedule.days) {
          const weekday = DAY_MAPPING[dayStr];
          if (!weekday) continue;

          console.log(`[useNotificationSync] syncNotifications - Notificação criada para ${triggerHour}:${triggerMinute} ${dayStr} `)



          await Notifications.scheduleNotificationAsync({
            content: {
              title: `Hora do medicamento`,
              body: `Tomar ${schedule.name} (${schedule.dosage})`,
              sound: 'default',
              data: {
                scheduleId: schedule.id,
                medicationId: schedule.medicationId,
                type: 'medication_reminder'
              },
            },
            trigger: {
              hour: hours,
              minute: minutes,
              weekday,
              type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
            },
          });
          scheduledCount++;
        }
      }

      for (const item of postponedList) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: `Lembrete Adiado`,
            body: `Tomar ${item.medicationName} (${item.dosage})`,
            data: { ...item, type: 'postponed_reminder' },
          },
          trigger: {
            date: new Date(item.triggerDate),
            type: Notifications.SchedulableTriggerInputTypes.DATE,
          },
        });
        scheduledCount++;
        console.log(`[Sync] ♻️ Restored postponed item for ${item.triggerDate}`);
      }

      console.log(`[useNotificationSync] syncNotifications - ✅ Scheduled ${scheduledCount} notifications locally`);
    } catch (error) {
      console.error('Sync failed:', error);
      showToast('Erro ao sincronizar notificações', 'error');
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return {
    syncNotifications,
    postponeNotification,
    isSyncing
  };
}

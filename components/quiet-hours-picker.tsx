import React, { useState } from 'react';
import { View, Text, Pressable, Modal, Platform } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Icon } from '@/components/ui/icon';
import { Clock, ChevronDown } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

/**
 * Componente para configuração de horário de silêncio
 */
interface QuietHoursPickerProps {
  startTime?: string;
  endTime?: string;
  onChange: (startTime: string, endTime: string) => void;
  enabled: boolean;
}

export function QuietHoursPicker({
  startTime = '22:00',
  endTime = '08:00',
  onChange,
  enabled,
}: QuietHoursPickerProps) {
  const colors = useThemeColors();
  const [showPicker, setShowPicker] = useState(false);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [tempStartTime, setTempStartTime] = useState(startTime);
  const [tempEndTime, setTempEndTime] = useState(endTime);

  const formatTimeDisplay = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const handleSave = () => {
    onChange(tempStartTime, tempEndTime);
    setShowPicker(false);
  };

  const handleCancel = () => {
    setTempStartTime(startTime);
    setTempEndTime(endTime);
    setShowPicker(false);
    setShowStartPicker(false);
    setShowEndPicker(false);
  };

  const handleStartTimeChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const timeString = selectedDate.toTimeString().slice(0, 5); // HH:MM format
      setTempStartTime(timeString);
    }
  };

  const handleEndTimeChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === 'ios');
    if (selectedDate) {
      const timeString = selectedDate.toTimeString().slice(0, 5); // HH:MM format
      setTempEndTime(timeString);
    }
  };

  const getTimeDate = (timeString: string) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date;
  };

  if (!enabled) {
    return (
      <View
        className="rounded-lg border p-4 opacity-50"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}>
        <View className="flex-row items-center">
          <Icon as={Clock} size="sm" className="mr-3 text-muted-foreground" />
          <View className="flex-1">
            <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
              Horário de Silêncio
            </Text>
            <Text className="text-sm" style={{ color: colors.textSecondary }}>
              Ative as notificações para configurar
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <>
      <Pressable
        onPress={() => setShowPicker(true)}
        className="rounded-lg border p-4"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.border,
        }}
        accessibilityRole="button"
        accessibilityLabel={`Configurar horário de silêncio, atualmente de ${formatTimeDisplay(startTime)} às ${formatTimeDisplay(endTime)}`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <Icon as={Clock} size="sm" className="mr-3 text-primary" />
            <View className="flex-1">
              <Text className="text-base font-medium" style={{ color: colors.textPrimary }}>
                Horário de Silêncio
              </Text>
              <Text className="text-sm" style={{ color: colors.textSecondary }}>
                {formatTimeDisplay(startTime)} - {formatTimeDisplay(endTime)}
              </Text>
            </View>
          </View>
          <Icon as={ChevronDown} size="sm" className="text-muted-foreground" />
        </View>
      </Pressable>

      <Modal visible={showPicker} transparent animationType="slide" onRequestClose={handleCancel}>
        <View className="flex-1 justify-end bg-black bg-opacity-50">
          <View className="rounded-t-2xl p-6" style={{ backgroundColor: colors.card }}>
            <Text
              className="mb-6 text-center text-lg font-semibold"
              style={{ color: colors.textPrimary }}>
              Horário de Silêncio
            </Text>

            <Text className="mb-2 text-sm" style={{ color: colors.textSecondary }}>
              Início
            </Text>
            <Pressable
              onPress={() => setShowStartPicker(true)}
              className="rounded-lg border p-4"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              }}>
              <Text className="text-center font-mono text-lg" style={{ color: colors.textPrimary }}>
                {formatTimeDisplay(tempStartTime)}
              </Text>
            </Pressable>

            <Text className="mb-2 mt-4 text-sm" style={{ color: colors.textSecondary }}>
              Fim
            </Text>
            <Pressable
              onPress={() => setShowEndPicker(true)}
              className="rounded-lg border p-4"
              style={{
                backgroundColor: colors.backgroundSecondary,
                borderColor: colors.border,
              }}>
              <Text className="text-center font-mono text-lg" style={{ color: colors.textPrimary }}>
                {formatTimeDisplay(tempEndTime)}
              </Text>
            </Pressable>

            <View className="mt-6 flex-row space-x-3">
              <Pressable
                onPress={handleCancel}
                className="flex-1 rounded-lg py-3"
                style={{ backgroundColor: colors.backgroundSecondary }}>
                <Text className="text-center font-medium" style={{ color: colors.textPrimary }}>
                  Cancelar
                </Text>
              </Pressable>

              <Pressable
                onPress={handleSave}
                className="flex-1 rounded-lg py-3"
                style={{ backgroundColor: colors.primary }}>
                <Text className="text-center font-medium text-white">Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* DateTimePicker para horário de início */}
        {showStartPicker && (
          <DateTimePicker
            value={getTimeDate(tempStartTime)}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleStartTimeChange}
            textColor={colors.textPrimary}
          />
        )}

        {/* DateTimePicker para horário de fim */}
        {showEndPicker && (
          <DateTimePicker
            value={getTimeDate(tempEndTime)}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleEndTimeChange}
            textColor={colors.textPrimary}
          />
        )}
      </Modal>
    </>
  );
}

/**
 * Seletor de horário simples - REMOVIDO: Substituído por DateTimePicker nativo
 */

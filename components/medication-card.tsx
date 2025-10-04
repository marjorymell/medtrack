import { View, Text, Pressable, ScrollView } from 'react-native';
import { TodayMedication } from '@/types/medication';

interface MedicationCardProps {
  medication: TodayMedication;
  onConfirm: (scheduleId: string) => void;
  onPostpone: (scheduleId: string) => void;
}

export function MedicationCard({ medication, onConfirm, onPostpone }: MedicationCardProps) {
  return (
    <ScrollView className="px-4 py-6">
      <View className="flex-row items-start justify-between gap-4 rounded-lg">
        {/* Informações do medicamento */}
        <View className="flex-1 gap-1">
          <Text className="text-muted-foreground dark:text-muted-foreground-dark text-sm font-normal">
            {medication.time}
          </Text>
          <Text className="text-foreground dark:text-foreground-dark text-base font-bold">
            {medication.name}
          </Text>
          <Text className="text-muted-foreground dark:text-muted-foreground-dark text-sm font-normal">
            {medication.dosage}
          </Text>
        </View>
      </View>

      {/* Botões de ação */}
      <View className="flex-row justify-between gap-3 pt-3">
        <Pressable
          onPress={() => onConfirm(medication.scheduleId)}
          className="bg-primary dark:bg-primary-dark h-10 w-1/3 items-center justify-center rounded-lg px-4"
          accessibilityLabel={`Confirmar dose de ${medication.name}`}
          accessibilityRole="button">
          <Text className="text-primary-foreground dark:text-primary-foreground-dark text-center text-sm font-bold">
            Confirmar
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onPostpone(medication.scheduleId)}
          className="bg-secondary dark:bg-secondary-dark h-10 w-[84px] items-center justify-center rounded-lg px-4"
          accessibilityLabel={`Adiar dose de ${medication.name}`}
          accessibilityRole="button">
          <Text className="text-secondary-foreground dark:text-secondary-foreground-dark text-center text-sm font-bold">
            Adiar
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

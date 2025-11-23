import { View, Text, Pressable } from 'react-native';
import { TodayMedication } from '@/types/medication';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface MedicationCardProps {
  medication: TodayMedication;
  onConfirm: (scheduleId: string) => void;
  onPostpone: (scheduleId: string, scheduledTime: string) => void;
}

export function MedicationCard({ medication, onConfirm, onPostpone }: MedicationCardProps) {
  const colors = useThemeColors();

  // Usar scheduledTime (que já inclui adiamento se aplicável)
  const displayTime = new Date(medication.scheduledTime).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const isTaken = medication.status === 'confirmed';

  const getStatusIcon = () => {
    if (isTaken) {
      return <CheckCircle size={20} color="#10b981" />;
    }
    if (medication.status === 'postponed') {
      return <Clock size={20} color="#f59e0b" />;
    }
    // Verificar se está atrasado
    const now = new Date();
    const scheduledDateTime = new Date(medication.scheduledTime);

    if (now > scheduledDateTime) {
      return <AlertCircle size={20} color="#ef4444" />;
    }

    return null;
  };

  const getStatusText = () => {
    if (isTaken) {
      return { text: 'Tomado', color: '#10b981' };
    }
    if (medication.status === 'postponed') {
      return { text: 'Adiado', color: '#f59e0b' };
    }
    return null;
  };

  const statusInfo = getStatusText();

  return (
    <View className="mx-4 mb-3 rounded-lg bg-card p-4 dark:bg-card-dark">
      {/* Header com horário e status */}
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
            {displayTime}
          </Text>
          {getStatusIcon()}
        </View>

        {statusInfo && (
          <View className="flex-row items-center gap-1">
            <View className="h-2 w-2 rounded-full" style={{ backgroundColor: statusInfo.color }} />
            <Text className="text-sm font-medium" style={{ color: statusInfo.color }}>
              {statusInfo.text}
            </Text>
          </View>
        )}
      </View>

      {/* Informações do medicamento */}
      <View className="mb-4">
        <Text className="mb-1 text-xl font-semibold text-foreground dark:text-foreground-dark">
          {medication.name}
        </Text>
        <Text className="text-base text-muted-foreground dark:text-muted-foreground-dark">
          {medication.dosage}
        </Text>
      </View>

      {/* Botões de ação */}
      {!isTaken && (
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => onConfirm(medication.scheduleId)}
            className="h-12 flex-1 items-center justify-center rounded-lg bg-primary dark:bg-primary-dark"
            accessibilityLabel={`Confirmar dose de ${medication.name}`}
            accessibilityRole="button">
            <Text className="text-base font-semibold text-primary-foreground dark:text-primary-foreground-dark">
              ✓ Confirmar
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onPostpone(medication.scheduleId, medication.scheduledTime)}
            className="h-12 flex-1 items-center justify-center rounded-lg bg-secondary dark:bg-secondary-dark"
            accessibilityLabel={`Adiar dose de ${medication.name}`}
            accessibilityRole="button">
            <Text className="text-base font-semibold text-secondary-foreground dark:text-secondary-foreground-dark">
              ⏰ Adiar
            </Text>
          </Pressable>
        </View>
      )}

      {/* Mensagem quando já tomado */}
      {isTaken && (
        <View className="rounded-lg bg-green-50 p-3 dark:bg-green-900/20">
          <Text className="text-center text-green-700 dark:text-green-300">
            ✓ Dose confirmada com sucesso!
          </Text>
        </View>
      )}
    </View>
  );
}

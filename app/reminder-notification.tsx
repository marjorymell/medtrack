import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { X } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { showToast } from '@/utils/toast';
import { MOCK_TODAY_MEDICATIONS } from '@/mocks/medication-data';
import { useEffect } from 'react';

export default function ReminderNotificationScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  const medication = MOCK_TODAY_MEDICATIONS[0];

  useEffect(() => {
    console.log('[MOCK API] Medicamento:', medication.name, medication.dosage);
    console.log('[MOCK API] Horário programado:', medication.time);
  }, [medication]);

  const handleTakeNow = () => {
    console.log('[MOCK API] Usuário clicou em "Tomar agora"');
    console.log('[MOCK API] Confirmando medicamento:', medication.name);

    // TODO: Implementar lógica de confirmar medicamento
    showToast('Medicamento confirmado!', 'success');

    console.log('[MOCK API] ✓ Medicamento confirmado com sucesso');
    router.back();
  };

  const handlePostpone = () => {
    console.log('[MOCK API] Usuário clicou em "Adiar por 10 minutos"');
    console.log('[MOCK API] Adiando medicamento:', medication.name, 'por 10 minutos');

    // TODO: Implementar lógica de adiar medicamento por 10 minutos
    showToast('Lembrete adiado por 10 minutos', 'success');

    const newTime = new Date();
    newTime.setMinutes(newTime.getMinutes() + 10);
    console.log(
      '[MOCK API] ✓ Medicamento adiado para',
      newTime.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    );
    router.back();
  };

  const handleClose = () => {
    console.log('[MOCK API] Usuário fechou a página de lembrete');
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-background px-6 pt-12 dark:bg-background-dark">
        <View className="mb-12 flex-row items-center">
          <Pressable
            onPress={handleClose}
            accessibilityLabel="Fechar"
            accessibilityRole="button"
            className="p-2">
            <X size={24} color={colors.textPrimary} strokeWidth={2} />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-semibold text-foreground dark:text-foreground-dark">
            Lembrete de Medicamento
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View className="flex-1 items-center justify-center px-4">
          <Text className="mb-4 text-center text-[22px] font-bold text-foreground dark:text-foreground-dark">
            Hora de tomar seu medicamento
          </Text>

          <Text className="mb-12 text-center text-base text-muted-foreground dark:text-muted-foreground-dark">
            Tome 1 comprimido de {medication.name} ({medication.dosage})
          </Text>

          <View className="w-full gap-4">
            <Pressable
              onPress={handleTakeNow}
              className="h-12 w-full items-center justify-center rounded-lg bg-primary dark:bg-primary-dark"
              accessibilityLabel="Tomar agora"
              accessibilityRole="button">
              <Text className="text-base font-bold text-primary-foreground dark:text-primary-foreground-dark">
                Tomar agora
              </Text>
            </Pressable>

            <Pressable
              onPress={handlePostpone}
              className="h-12 w-full items-center justify-center rounded-lg bg-secondary dark:bg-secondary-dark"
              accessibilityLabel="Adiar por 10 minutos"
              accessibilityRole="button">
              <Text className="text-base font-bold text-secondary-foreground dark:text-secondary-foreground-dark">
                Adiar por 10 minutos
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

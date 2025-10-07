'use client';

import { View, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { X } from 'lucide-react-native';
import { useRouter, Stack } from 'expo-router';
import { showToast } from '@/utils/toast';

export default function ReminderNotificationScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  const handleTakeNow = () => {
    // TODO: Implementar lógica de confirmar medicamento
    showToast('Medicamento confirmado!', 'success');
    router.back();
  };

  const handlePostpone = () => {
    // TODO: Implementar lógica de adiar medicamento por 10 minutos
    showToast('Lembrete adiado por 10 minutos', 'success');
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex-1 bg-background px-6 pt-12 dark:bg-background-dark">
        {/* Header com ícone X e título */}
        <View className="mb-12 flex-row items-center gap-2">
          <Pressable onPress={handleClose} accessibilityLabel="Fechar" accessibilityRole="button">
            <X size={24} color={colors.textPrimary} />
          </Pressable>
          <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
            Lembrete de Medicamento
          </Text>
        </View>

        {/* Conteúdo centralizado */}
        <View className="flex-1 items-center justify-center px-4">
          {/* Título principal */}
          <Text className="mb-4 text-center text-[22px] font-bold text-foreground dark:text-foreground-dark">
            Hora de tomar seu medicamento
          </Text>

          {/* Descrição */}
          <Text className="mb-12 text-center text-base text-muted-foreground dark:text-muted-foreground-dark">
            Tome 1 comprimido de Paracetamol para dor de cabeça
          </Text>

          {/* Botões de ação */}
          <View className="w-full gap-4">
            {/* Botão Tomar Agora */}
            <Pressable
              onPress={handleTakeNow}
              className="h-12 w-full items-center justify-center rounded-lg bg-primary dark:bg-primary-dark"
              accessibilityLabel="Tomar agora"
              accessibilityRole="button">
              <Text className="text-base font-bold text-primary-foreground dark:text-primary-foreground-dark">
                Tomar agora
              </Text>
            </Pressable>

            {/* Botão Adiar */}
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

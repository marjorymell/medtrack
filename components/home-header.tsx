import { View, Text, Pressable } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { COLORS, FONTS } from '@/lib/theme';

interface HomeHeaderProps {
  onNotificationPress: () => void;
}

export function HomeHeader({ onNotificationPress }: HomeHeaderProps) {
  const { colorScheme } = useColorScheme();
  const colors = COLORS[colorScheme ?? 'light'];

  return (
    <View className="dark:bg-background-dark flex-row items-center justify-between bg-background px-4 pb-2 pt-4">
      {/* Espaçador para centralizar o título */}
      <View className="w-12" />

      <Text className="dark:text-foreground-dark flex-1 text-center text-lg font-bold text-foreground">
        Medicamentos de Hoje
      </Text>

      <Pressable
        onPress={onNotificationPress}
        className="h-12 w-12 items-center justify-center rounded-lg"
        accessibilityLabel="Notificações"
        accessibilityRole="button">
        <Bell size={24} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
}

import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { ChevronRight, User, Bell, Download } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function ProfileScreen() {
  const colors = useThemeColors();

  const menuItems = [
    {
      id: 'personal-data',
      title: 'Dados pessoais',
      icon: User,
      onPress: () => console.log('Dados pessoais'),
    },
    {
      id: 'notifications',
      title: 'Preferências de notificação',
      icon: Bell,
      onPress: () => console.log('Notificações'),
    },
    {
      id: 'export',
      title: 'Exportar histórico',
      icon: Download,
      onPress: () => console.log('Exportar'),
    },
  ];

  return (
    <ScrollView className="dark:bg-background-dark flex-1 bg-background">
      {/* Header */}
      <View className="items-center px-4 pb-2 pt-4">
        <Text className="dark:text-foreground-dark text-center text-lg font-bold text-foreground">
          Configurações
        </Text>
      </View>

      {/* Profile Info */}
      <View className="items-center gap-4 px-4 py-6">
        <View className="dark:bg-primary-dark h-32 w-32 items-center justify-center rounded-full bg-primary">
          <Text className="dark:text-primary-foreground-dark text-[50px] font-bold leading-[28px] text-primary-foreground">
            S
          </Text>
        </View>

        <View className="items-center gap-1">
          <Text className="dark:text-foreground-dark text-[22px] font-bold leading-7 text-foreground">
            Sofia Almeida
          </Text>
          <Text className="dark:text-muted-foreground-dark text-base text-muted-foreground">
            sofia.almeida@email.com
          </Text>
        </View>
      </View>

      {/* Account Section */}
      <View className="px-4 pb-2 pt-4">
        <Text className="dark:text-foreground-dark text-lg font-bold text-foreground">Conta</Text>
      </View>

      {/* Theme Toggle */}
      <View className="px-4 pb-4">
        <ThemeToggle />
      </View>

      {/* Menu Items */}
      <View className="gap-0 px-4">
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            className="dark:bg-background-dark flex-row items-center justify-between bg-background py-4"
            accessibilityLabel={item.title}
            accessibilityRole="button">
            <View className="flex-row items-center gap-3">
              <item.icon size={24} color={colors.textPrimary} />
              <Text className="dark:text-foreground-dark text-base text-foreground">
                {item.title}
              </Text>
            </View>
            <ChevronRight size={24} color={colors.textSecondary} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

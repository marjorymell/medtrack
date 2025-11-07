import { View, ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { ChevronRight, User, Bell, Download, LogOut } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const colors = useThemeColors();
  const router = useRouter();

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
    {
      id: 'test-reminder',
      title: 'Testar Lembrete (Preview)',
      icon: Bell,
      onPress: () => router.push('/reminder-notification' as any),
    },
  ];

  return (
    <ScrollView className="flex-1 bg-background dark:bg-background-dark">
      {/* 1. Header Padronizado */}
      <View className="items-center px-6 pb-4 pt-12">
        <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
          Configurações
        </Text>
      </View>

      {/* Profile Info */}
      <View className="items-center gap-4 px-4 py-6">
        <View className="h-32 w-32 items-center justify-center rounded-full bg-primary dark:bg-primary-dark">
          <Text className="text-[50px] font-bold leading-[50px] text-primary-foreground dark:text-primary-foreground-dark">
            S
          </Text>
        </View>

        <View className="items-center gap-1">
          <Text className="text-[22px] font-bold leading-7 text-foreground dark:text-foreground-dark">
            Sofia Almeida
          </Text>
          <Text className="text-base text-muted-foreground dark:text-muted-foreground-dark">
            sofia.almeida@email.com
          </Text>
        </View>
      </View>

      {/* Theme Toggle */}
      <View className="px-4 pb-4">
        <ThemeToggle />
      </View>

      {/* 3. Account Section */}
      <View className="px-4 pb-2 pt-4">
        <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">Conta</Text>
      </View>

      {/* Menu Items */}
      <View className="gap-0 px-4">
        {menuItems.map((item) => (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            className="flex-row items-center justify-between border-b border-border/70 bg-background py-4 last:border-b-0 dark:border-border-dark/70 dark:bg-background-dark"
            accessibilityLabel={item.title}
            accessibilityRole="button">
            <View className="flex-row items-center gap-3">
              <item.icon size={24} color={colors.textPrimary} />
              <Text className="text-base text-foreground dark:text-foreground-dark">
                {item.title}
              </Text>
            </View>
            <ChevronRight size={24} color={colors.textSecondary} />
          </Pressable>
        ))}

        <Pressable
          onPress={() => console.log('Deslogar Usuário')}
          className="mt-4 flex-row items-center justify-center py-3"
          accessibilityLabel="Sair da conta"
          accessibilityRole="button">
          <LogOut size={20} color={colors.textPrimary} className="mr-2" />
          <Text className="text-base font-bold text-foreground dark:text-foreground-dark">
            Sair
          </Text>
        </Pressable>
      </View>

      <View className="h-20" />
    </ScrollView>
  );
}

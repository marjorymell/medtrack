import { View, Pressable } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Moon, Sun } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Text } from '@/components/ui/text';

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();
  const colors = useThemeColors();
  const isDark = colorScheme === 'dark';

  const toggleTheme = () => {
    setColorScheme(isDark ? 'light' : 'dark');
  };

  return (
    <View className="dark:bg-card-dark flex-row items-center justify-between rounded-lg bg-card p-4">
      <View className="flex-row items-center gap-3">
        {isDark ? (
          <Moon size={24} color={colors.textPrimary} />
        ) : (
          <Sun size={24} color={colors.textPrimary} />
        )}
        <View>
          <Text className="dark:text-foreground-dark text-base font-semibold text-foreground">
            Tema {isDark ? 'Escuro' : 'Claro'}
          </Text>
          <Text className="dark:text-muted-foreground-dark text-sm text-muted-foreground">
            Alternar entre modo claro e escuro
          </Text>
        </View>
      </View>

      <Pressable
        onPress={toggleTheme}
        className={`h-8 w-14 rounded-full p-1 ${isDark ? 'bg-primary' : 'bg-secondary'}`}
        accessibilityLabel={`Alternar para tema ${isDark ? 'claro' : 'escuro'}`}
        accessibilityRole="switch"
        accessibilityState={{ checked: isDark }}>
        <View
          className={`h-6 w-6 rounded-full bg-white transition-transform ${
            isDark ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </Pressable>
    </View>
  );
}

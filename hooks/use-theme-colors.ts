import { useColorScheme } from 'nativewind';
import { COLORS } from '@/lib/theme';

/**
 * Hook customizado para acessar cores do tema atual (light/dark)
 * Use este hook quando precisar de cores para elementos nativos (ícones, etc)
 */
export function useThemeColors() {
  const { colorScheme } = useColorScheme();
  return COLORS[colorScheme ?? 'light'];
}

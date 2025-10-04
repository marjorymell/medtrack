import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';
import { Platform } from 'react-native';

/**
 * ThemeProvider para aplicar tema em toda a aplicação
 * Este componente garante que o NativeWind aplique as classes dark/light corretamente
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();

  useEffect(() => {
    // Força a aplicação do tema atual
    if (colorScheme) {
      setColorScheme(colorScheme);
    }

    // Para web, aplicar classe no documento
    if (Platform.OS === 'web') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(colorScheme ?? 'light');
    }
  }, [colorScheme, setColorScheme]);

  return <>{children}</>;
}

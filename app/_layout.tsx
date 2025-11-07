import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { ThemeProvider } from '@/components/theme-provider';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useFonts } from 'expo-font';
import { Manrope_400Regular, Manrope_500Medium, Manrope_700Bold } from '@expo-google-fonts/manrope';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider>
      <NavigationThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="add-medication" options={{ headerShown: false }} />
          <Stack.Screen name="reminder-notification" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ headerShown: false }} />
        </Stack>
        <PortalHost />
      </NavigationThemeProvider>
    </ThemeProvider>
  );
}

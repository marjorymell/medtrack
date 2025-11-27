import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/contexts/auth-context';
import { AuthGuard } from '@/components/auth-guard';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useFonts } from 'expo-font';
import { Manrope_400Regular, Manrope_500Medium, Manrope_700Bold } from '@expo-google-fonts/manrope';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import Toast from 'react-native-toast-message';
import { toastConfig } from '@/utils/toast';
import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { NotificationProvider } from '@/contexts/notification-context';
import { UserSettingsProvider } from '@/contexts/user-settings-context';


const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND_NOTIFICATION_TASK";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  async ({ data, error, executionInfo }) => {
    console.log("Received a notification in the background", {
      data,
      error,
      executionInfo,
    });
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

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
    <NotificationProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <UserSettingsProvider>
              <NavigationThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                <AuthGuard>
                  <Stack>
                    <Stack.Screen name="index" options={{ headerShown: false }} />
                    <Stack.Screen name="add-medication" options={{ headerShown: false }} />
                    <Stack.Screen name="edit-medication" options={{ headerShown: false }} />
                    <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
                    <Stack.Screen name="notification-settings" options={{ headerShown: false }} />
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="auth-screen" options={{ headerShown: false }} />
                  </Stack>
                </AuthGuard>
                <PortalHost />
                <Toast config={toastConfig} />
              </NavigationThemeProvider>
            </UserSettingsProvider>
          </AuthProvider>
        </QueryClientProvider>
      </ThemeProvider>
    </NotificationProvider>
  );
}

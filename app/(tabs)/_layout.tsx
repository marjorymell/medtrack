import React from 'react';
import { Tabs } from 'expo-router';
import { BoxIcon, HistoryIcon, HomeIcon, UserIcon } from 'lucide-react-native';
import { THEME } from '@/lib/theme';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: THEME.light.primary }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }: { color: string }) => <HomeIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color }: { color: string }) => <HistoryIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="stock"
        options={{
          title: 'Estoque',
          tabBarIcon: ({ color }: { color: string }) => <BoxIcon color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }: { color: string }) => <UserIcon color={color} />,
        }}
      />
    </Tabs>
  );
}

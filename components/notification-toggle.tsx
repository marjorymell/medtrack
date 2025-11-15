import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Icon } from '@/components/ui/icon';
import { Bell, BellOff } from 'lucide-react-native';

/**
 * Componente de toggle para ativar/desativar notificações
 */
interface NotificationToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  title: string;
  description?: string;
  disabled?: boolean;
}

export function NotificationToggle({
  enabled,
  onToggle,
  title,
  description,
  disabled = false,
}: NotificationToggleProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      onPress={() => !disabled && onToggle(!enabled)}
      className={`flex-row items-center justify-between p-4 rounded-lg border ${
        disabled ? 'opacity-50' : ''
      }`}
      style={{
        backgroundColor: colors.card,
        borderColor: colors.border,
      }}
      disabled={disabled}
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled }}
      accessibilityLabel={`${title}, ${enabled ? 'ativado' : 'desativado'}`}
    >
      <View className="flex-1 mr-3">
        <Text
          className="text-base font-medium"
          style={{ color: colors.textPrimary }}
        >
          {title}
        </Text>
        {description && (
          <Text
            className="text-sm mt-1"
            style={{ color: colors.textSecondary }}
          >
            {description}
          </Text>
        )}
      </View>

      <View
        className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
          enabled ? 'bg-primary' : 'bg-background-secondary'
        }`}
        style={{
          backgroundColor: enabled ? colors.primary : colors.backgroundSecondary,
        }}
      >
        <View
          className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
            enabled ? 'translate-x-6' : 'translate-x-0'
          }`}
          style={{
            transform: [{ translateX: enabled ? 24 : 0 }],
          }}
        />
      </View>
    </Pressable>
  );
}

/**
 * Componente de toggle específico para notificações push
 */
interface PushNotificationToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  hasPermission: boolean;
  onRequestPermission?: () => void;
}

export function PushNotificationToggle({
  enabled,
  onToggle,
  hasPermission,
  onRequestPermission,
}: PushNotificationToggleProps) {
  const colors = useThemeColors();

  const handleToggle = () => {
    if (!hasPermission && onRequestPermission) {
      onRequestPermission();
    } else {
      onToggle(!enabled);
    }
  };

  return (
    <View className="mb-4">
      <NotificationToggle
        enabled={enabled && hasPermission}
        onToggle={handleToggle}
        title="Notificações Push"
        description={
          hasPermission
            ? "Receba lembretes de medicamentos no seu dispositivo"
            : "Permissões necessárias para receber notificações"
        }
        disabled={!hasPermission && !onRequestPermission}
      />

      {!hasPermission && (
        <View
          className="mt-2 p-3 rounded-lg flex-row items-center"
          style={{
            backgroundColor: colors.backgroundSecondary,
            borderColor: colors.border,
            borderWidth: 1,
          }}
        >
          <Icon
            as={BellOff}
            size="sm"
            className="mr-2 text-muted-foreground"
          />
          <Text
            className="text-sm flex-1"
            style={{ color: colors.textSecondary }}
          >
            Permita notificações nas configurações do dispositivo para receber lembretes
          </Text>
        </View>
      )}
    </View>
  );
}
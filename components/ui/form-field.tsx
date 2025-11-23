import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { AlertCircle } from 'lucide-react-native';

interface FormFieldProps extends TextInputProps {
  label: string;
  placeholder: string;
  error?: string;
}

export const FormField = React.memo(({ label, placeholder, error, ...rest }: FormFieldProps) => {
  const colors = useThemeColors();

  return (
    <View className="mb-4 w-full">
      {/* Label */}
      <Text className="mb-2 text-sm font-medium text-foreground dark:text-foreground-dark">
        {label}
      </Text>

      {/* Input Field */}
      <TextInput
        className={`h-12 w-full rounded-lg border px-4 text-foreground dark:text-foreground-dark ${
          error
            ? 'border-red-500 bg-red-50 dark:border-red-500 dark:bg-red-950/20'
            : 'border-transparent bg-secondary focus:border-primary dark:bg-secondary-dark dark:focus:border-primary-dark'
        }`}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        {...rest}
      />

      {/* Error Message */}
      {error && (
        <View className="mt-2 flex-row items-center gap-2">
          <AlertCircle size={14} color="#ef4444" />
          <Text className="flex-1 text-sm text-red-500">{error}</Text>
        </View>
      )}
    </View>
  );
});

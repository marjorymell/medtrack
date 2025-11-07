import React from 'react';
import { View, TextInput, TextInputProps } from 'react-native';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface FormFieldProps extends TextInputProps {
  label: string;
  placeholder: string;
}

export const FormField = React.memo(({ label, placeholder, ...rest }: FormFieldProps) => {
  const colors = useThemeColors();

  return (
    <View className="mb-4 w-full">
      {/* Label */}
      <Text className="mb-2 text-sm font-medium text-foreground dark:text-foreground-dark">
        {label}
      </Text>

      {/* Input Field */}
      <TextInput
        className="h-12 w-full rounded-lg border border-transparent bg-secondary px-4 text-foreground focus:border-primary dark:bg-secondary-dark dark:text-foreground-dark dark:focus:border-primary-dark"
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        {...rest}
      />
    </View>
  );
});

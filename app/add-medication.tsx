import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import {
  X,
  Clock,
  Calendar,
  Package,
  FileText,
  AlertCircle,
  ChevronDown,
} from 'lucide-react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useMedications } from '@/hooks/use-medications';

interface AddMedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  expiryDate: string;
  stock: string;
  notes: string;
}

interface FrequencyOption {
  label: string;
  value: string;
  enumValue: string;
  description: string;
}

interface PickerItem {
  id?: string;
  label: string;
  value?: string;
  isSpacer?: boolean;
}

const FREQUENCY_OPTIONS = [
  { label: 'Diária', value: 'Diária', enumValue: 'ONE_TIME', description: 'Uma vez por dia' },
  {
    label: '2 vezes por dia',
    value: '2x ao dia',
    enumValue: 'TWICE_A_DAY',
    description: 'A cada 12 horas',
  },
  {
    label: '3 vezes por dia',
    value: '3x ao dia',
    enumValue: 'THREE_TIMES_A_DAY',
    description: 'A cada 8 horas',
  },
  {
    label: '4 vezes por dia',
    value: '4x ao dia',
    enumValue: 'FOUR_TIMES_A_DAY',
    description: 'A cada 6 horas',
  },
  { label: 'Semanal', value: 'Semanal', enumValue: 'WEEKLY', description: 'Uma vez por semana' },
  { label: 'Mensal', value: 'Mensal', enumValue: 'MONTHLY', description: 'Uma vez por mês' },
] as const;

export default function AddMedicationScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { createMedication, loading, error } = useMedications();

  // Form state
  const [name, setName] = useState<string>('');
  const [dosage, setDosage] = useState<string>('');
  const [selectedFrequency, setSelectedFrequency] = useState<string>('Diária');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [stock, setStock] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('08:00');
  const [selectedTime, setSelectedTime] = useState<Date>(() => {
    const now = new Date();
    now.setHours(8, 0, 0, 0);
    return now;
  });
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState<boolean>(false);
  const [showStockPicker, setShowStockPicker] = useState<boolean>(false);

  // Validation state
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof AddMedicationFormData, string>>
  >({});

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof AddMedicationFormData, string>> = {};

    if (!name.trim()) {
      errors.name = 'Nome do medicamento é obrigatório';
    } else if (name.trim().length < 2) {
      errors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!dosage.trim()) {
      errors.dosage = 'Dosagem é obrigatória';
    }

    // Validação de frequência
    if (!selectedFrequency) {
      errors.frequency = 'Frequência é obrigatória';
    } else {
      const validFrequencies = FREQUENCY_OPTIONS.map((option) => option.value);
      if (!validFrequencies.includes(selectedFrequency as any)) {
        errors.frequency = 'Frequência selecionada é inválida';
      }
    }

    if (!stock.trim()) {
      errors.stock = 'Quantidade em estoque é obrigatória';
    } else {
      const stockNum = parseInt(stock);
      if (isNaN(stockNum) || stockNum < 0) {
        errors.stock = 'Quantidade deve ser um número positivo';
      }
    }

    if (expiryDate) {
      // Validação básica de formato (já que o DatePicker garante validade)
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      if (!dateRegex.test(expiryDate)) {
        errors.expiryDate = 'Data de validade deve estar no formato DD/MM/AAAA';
      } else {
        // Verificar se a data não é no passado
        const [day, month, year] = expiryDate.split('/');
        const selectedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          errors.expiryDate = 'Data de validade deve ser futura';
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidDate = (dateStr: string): boolean => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = dateStr.match(regex);
    if (!match) return false;

    const [, day, month, year] = match;
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return (
      date.getDate() === parseInt(day) &&
      date.getMonth() === parseInt(month) - 1 &&
      date.getFullYear() === parseInt(year)
    );
  };

  const isValidTime = (timeStr: string): boolean => {
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(timeStr);
  };

  /**
   * Calcula o intervalo em horas baseado na frequência selecionada
   */
  const calculateIntervalHours = (frequency: string): number => {
    switch (frequency) {
      case 'Diária':
        return 24;
      case '2x ao dia':
        return 12;
      case '3x ao dia':
        return 8;
      case '4x ao dia':
        return 6;
      case 'Semanal':
        return 24 * 7; // 168 horas
      case 'Mensal':
        return 24 * 30; // 720 horas (aproximado)
      default:
        return 24; // fallback para diário
    }
  };

  const handleClose = (): void => {
    if (name || dosage || stock) {
      Alert.alert(
        'Descartar alterações?',
        'Você tem alterações não salvas. Deseja realmente sair?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sair', style: 'destructive', onPress: () => router.back() },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      const formattedDate = formatDate(selectedDate);
      setExpiryDate(formattedDate);
      if (formErrors.expiryDate) setFormErrors({ ...formErrors, expiryDate: undefined });
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
      const formattedTime = formatTime(selectedTime);
      setStartTime(formattedTime);
    }
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleSave = async (): Promise<void> => {
    if (!validateForm()) {
      return;
    }

    try {
      // Encontrar o valor do backend correspondente à frequência selecionada
      const selectedOption = FREQUENCY_OPTIONS.find((option) => option.value === selectedFrequency);
      const frequencyEnumValue = selectedOption?.enumValue || 'ONE_TIME';

      const formData = {
        name: name.trim(),
        dosage: dosage.trim(),
        frequency: frequencyEnumValue,
        startTime,
        intervalHours: calculateIntervalHours(selectedFrequency),
        stock: parseInt(stock),
        expiresAt: expiryDate ? convertDateFormat(expiryDate) : undefined,
        notes: notes.trim() || undefined,
      };

      await createMedication(formData);
      router.back();
    } catch (error) {
      console.error('Erro ao salvar medicamento:', error);
      // Toast já é mostrado pelo hook
    }
  };

  const convertDateFormat = (dateStr: string): string => {
    // Converte DD/MM/AAAA para AAAA-MM-DD
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  const FormField = ({
    label,
    required = false,
    error,
    children,
    icon: Icon,
  }: {
    label: string;
    required?: boolean;
    error?: string;
    children: React.ReactNode;
    icon?: any;
  }) => (
    <View className="mb-4">
      <View className="mb-2 flex-row items-center">
        {Icon && <Icon size={16} color={colors.textSecondary} className="mr-2" />}
        <Text className="text-sm font-medium text-foreground dark:text-foreground-dark">
          {label}
          {required && <Text className="text-red-500"> *</Text>}
        </Text>
      </View>
      {children}
      {error && (
        <View className="mt-1 flex-row items-center">
          <AlertCircle size={14} color="#ef4444" />
          <Text className="ml-1 text-sm text-red-500">{error}</Text>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background dark:bg-background-dark">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-background px-4 pb-6 pt-12 dark:bg-background-dark">
        <TouchableOpacity onPress={handleClose} className="p-2">
          <X size={24} color={colors.textPrimary} strokeWidth={2} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
          Adicionar Medicamento
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}>
        {/* Form Fields */}
        <View className="px-4">
          {/* Nome do Medicamento */}
          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-foreground dark:text-foreground-dark">
              Nome do Medicamento
            </Text>
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
              }}
              placeholder="Ex: Paracetamol"
              placeholderTextColor={colors.textSecondary}
              className="h-12 rounded-lg bg-secondary px-4 text-base text-foreground dark:bg-secondary-dark dark:text-foreground-dark"
              autoCapitalize="words"
              autoCorrect={false}
            />
            {formErrors.name && (
              <View className="mt-1 flex-row items-center">
                <AlertCircle size={14} color="#ef4444" />
                <Text className="ml-1 text-sm text-red-500">{formErrors.name}</Text>
              </View>
            )}
          </View>

          {/* Dosagem */}
          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-foreground dark:text-foreground-dark">
              Dosagem (ex: 500mg)
            </Text>
            <TextInput
              value={dosage}
              onChangeText={(text) => {
                setDosage(text);
                if (formErrors.dosage) setFormErrors({ ...formErrors, dosage: undefined });
              }}
              placeholder="Ex: 500mg, 1 comprimido"
              placeholderTextColor={colors.textSecondary}
              className="h-12 rounded-lg bg-secondary px-4 text-base text-foreground dark:bg-secondary-dark dark:text-foreground-dark"
              autoCapitalize="none"
              autoCorrect={false}
            />
            {formErrors.dosage && (
              <View className="mt-1 flex-row items-center">
                <AlertCircle size={14} color="#ef4444" />
                <Text className="ml-1 text-sm text-red-500">{formErrors.dosage}</Text>
              </View>
            )}
          </View>

          {/* Frequência */}
          <View className="mb-4">
            <Text className="mb-3 text-base font-medium text-foreground dark:text-foreground-dark">
              Frequência
            </Text>
            <TouchableOpacity
              onPress={() => setShowFrequencyPicker(true)}
              className="h-12 flex-row items-center justify-between rounded-lg bg-secondary px-4 dark:bg-secondary-dark">
              <Text className="text-base text-foreground dark:text-foreground-dark">
                {selectedFrequency}
              </Text>
              <ChevronDown size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Modal do Picker Customizado */}
            <Modal
              visible={showFrequencyPicker}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowFrequencyPicker(false)}>
              <TouchableOpacity
                className="flex-1 justify-end bg-black/50"
                activeOpacity={1}
                onPress={() => setShowFrequencyPicker(false)}>
                <View className="rounded-t-2xl bg-background p-6 dark:bg-background-dark">
                  <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
                      Selecione a frequência
                    </Text>
                    <TouchableOpacity onPress={() => setShowFrequencyPicker(false)} className="p-2">
                      <X size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                  </View>

                  <View className="space-y-2">
                    {FREQUENCY_OPTIONS.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => {
                          setSelectedFrequency(option.value);
                          setShowFrequencyPicker(false);
                          if (formErrors.frequency)
                            setFormErrors({ ...formErrors, frequency: undefined });
                        }}
                        className={`rounded-lg p-4 ${
                          selectedFrequency === option.value
                            ? 'bg-primary dark:bg-primary-dark'
                            : 'bg-secondary dark:bg-secondary-dark'
                        }`}>
                        <Text
                          className={`text-base font-medium ${
                            selectedFrequency === option.value
                              ? 'text-primary-foreground dark:text-primary-foreground-dark'
                              : 'text-foreground dark:text-foreground-dark'
                          }`}>
                          {option.label}
                        </Text>
                        <Text
                          className={`mt-1 text-sm ${
                            selectedFrequency === option.value
                              ? 'text-primary-foreground/80 dark:text-primary-foreground-dark/80'
                              : 'text-muted-foreground dark:text-muted-foreground-dark'
                          }`}>
                          {option.description}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            </Modal>

            {formErrors.frequency && (
              <View className="mt-1 flex-row items-center">
                <AlertCircle size={14} color="#ef4444" />
                <Text className="ml-1 text-sm text-red-500">{formErrors.frequency}</Text>
              </View>
            )}
          </View>

          {/* Horário de Início */}
          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-foreground dark:text-foreground-dark">
              Horário de Início
            </Text>
            <TouchableOpacity
              onPress={() => setShowTimePicker(true)}
              className="h-12 flex-row items-center justify-between rounded-lg bg-secondary px-4 dark:bg-secondary-dark">
              <Text className="text-base text-foreground dark:text-foreground-dark">
                {startTime}
              </Text>
              <Clock size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="default"
                onChange={handleTimeChange}
                textColor={colors.textPrimary}
              />
            )}
          </View>

          {/* Validade */}
          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-foreground dark:text-foreground-dark">
              Validade
            </Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="h-12 flex-row items-center justify-between rounded-lg bg-secondary px-4 dark:bg-secondary-dark">
              <Text
                className={`text-base ${expiryDate ? 'text-foreground dark:text-foreground-dark' : 'text-muted-foreground dark:text-muted-foreground-dark'}`}>
                {expiryDate || 'Selecionar data'}
              </Text>
              <Calendar size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
                textColor={colors.textPrimary}
              />
            )}

            {formErrors.expiryDate && (
              <View className="mt-1 flex-row items-center">
                <AlertCircle size={14} color="#ef4444" />
                <Text className="ml-1 text-sm text-red-500">{formErrors.expiryDate}</Text>
              </View>
            )}
          </View>

          {/* Quantidade em Estoque */}
          <View className="mb-4">
            <Text className="mb-2 text-base font-medium text-foreground dark:text-foreground-dark">
              Quantidade em Estoque
            </Text>
            <TouchableOpacity
              onPress={() => setShowStockPicker(true)}
              className="h-12 flex-row items-center justify-between rounded-lg bg-secondary px-4 dark:bg-secondary-dark">
              <Text
                className={`text-base ${stock ? 'text-foreground dark:text-foreground-dark' : 'text-muted-foreground dark:text-muted-foreground-dark'}`}>
                {stock || 'Selecionar quantidade'}
              </Text>
              <Package size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {/* Modal do Picker de Estoque */}
            <Modal
              visible={showStockPicker}
              transparent={true}
              animationType="fade"
              onRequestClose={() => setShowStockPicker(false)}>
              <TouchableOpacity
                className="flex-1 justify-end bg-black/50"
                activeOpacity={1}
                onPress={() => setShowStockPicker(false)}>
                <View className="rounded-t-2xl bg-background p-6 dark:bg-background-dark">
                  <View className="mb-4 flex-row items-center justify-between">
                    <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
                      Selecione a quantidade
                    </Text>
                    <TouchableOpacity onPress={() => setShowStockPicker(false)} className="p-2">
                      <X size={24} color={colors.textPrimary} />
                    </TouchableOpacity>
                  </View>

                  <ScrollView showsVerticalScrollIndicator={false} className="max-h-80">
                    <View className="flex-row flex-wrap">
                      {Array.from({ length: 100 }, (_, i) => i + 1).map((number) => (
                        <TouchableOpacity
                          key={number}
                          onPress={() => {
                            setStock(number.toString());
                            setShowStockPicker(false);
                            if (formErrors.stock)
                              setFormErrors({ ...formErrors, stock: undefined });
                          }}
                          className={`m-1 w-16 items-center justify-center rounded-lg p-3 ${
                            stock === number.toString()
                              ? 'bg-primary dark:bg-primary-dark'
                              : 'bg-secondary dark:bg-secondary-dark'
                          }`}>
                          <Text
                            className={`text-base font-medium ${
                              stock === number.toString()
                                ? 'text-primary-foreground dark:text-primary-foreground-dark'
                                : 'text-foreground dark:text-foreground-dark'
                            }`}>
                            {number}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </Modal>

            {formErrors.stock && (
              <View className="mt-1 flex-row items-center">
                <AlertCircle size={14} color="#ef4444" />
                <Text className="ml-1 text-sm text-red-500">{formErrors.stock}</Text>
              </View>
            )}
          </View>

          {/* Observação */}
          <View className="mb-6">
            <Text className="mb-2 text-base font-medium text-foreground dark:text-foreground-dark">
              Observação
            </Text>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Instruções especiais, efeitos colaterais, etc."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="min-h-32 rounded-lg bg-secondary px-4 py-3 text-base text-foreground dark:bg-secondary-dark dark:text-foreground-dark"
              autoCapitalize="sentences"
            />
          </View>

          {/* Error Message */}
          {error && (
            <View className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
              <Text className="text-sm text-red-600 dark:text-red-400">{error}</Text>
            </View>
          )}
        </View>

        {/* Save Button */}
        <View className="px-4 pb-6">
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className="h-12 items-center justify-center rounded-lg bg-primary disabled:opacity-50 dark:bg-primary-dark">
            <Text className="text-base font-bold text-primary-foreground dark:text-primary-foreground-dark">
              {loading ? 'Salvando...' : 'Salvar'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

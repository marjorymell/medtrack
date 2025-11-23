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
import { useRouter, useLocalSearchParams } from 'expo-router';
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
import { Medication, UpdateMedicationData } from '@/types/medication';
import { updateMedicationSchema, formatZodErrors } from '@/lib/validation/medication-schemas';

interface EditMedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  expiryDate: string;
  stock: string;
  notes: string;
  startTime: string;
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

// Mapeamento reverso: enum -> valor em português
const getFrequencyValueFromEnum = (enumValue: string): string => {
  const option = FREQUENCY_OPTIONS.find((opt) => opt.enumValue === enumValue);
  return option?.value || 'Diária';
};

export default function EditMedicationScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const { id } = useLocalSearchParams();
  const { medications, updateMedication, loading, error } = useMedications();

  // Encontrar o medicamento a ser editado
  const medication = medications.find((med: Medication) => med.id === id);

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
    Partial<Record<keyof EditMedicationFormData, string>>
  >({});

  // Carregar dados do medicamento quando disponível
  useEffect(() => {
    if (medication) {
      setName(medication.name || '');
      setDosage(medication.dosage || '');
      setSelectedFrequency(getFrequencyValueFromEnum(medication.frequency || 'ONE_TIME'));
      setStock(medication.stock?.toString() || '');
      setNotes(medication.notes || '');
      setStartTime(medication.startTime || '08:00');

      // Configurar selectedTime baseado no startTime (usar hora local para DateTimePicker)
      const [hours, minutes] = (medication.startTime || '08:00').split(':');
      const timeDate = new Date();
      timeDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      setSelectedTime(timeDate);

      // Converter data para formato DD/MM/AAAA
      if (medication.expiresAt) {
        const date = new Date(medication.expiresAt);
        setSelectedDate(date);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        setExpiryDate(`${day}/${month}/${year}`);
      }
    }
  }, [medication]);

  // Se não encontrou o medicamento, voltar
  useEffect(() => {
    if (!medication && medications.length > 0) {
      Alert.alert('Erro', 'Medicamento não encontrado');
      router.back();
    }
  }, [medication, medications]);

  const validateForm = (): boolean => {
    try {
      // Encontrar o valor do enum correspondente à frequência selecionada
      const selectedOption = FREQUENCY_OPTIONS.find((option) => option.value === selectedFrequency);
      const frequencyEnumValue = selectedOption?.enumValue || 'ONE_TIME';

      const formData: UpdateMedicationData = {
        name: name.trim(),
        dosage: dosage.trim(),
        frequency: frequencyEnumValue,
        startTime: startTime || '08:00',
        intervalHours: calculateIntervalHours(selectedFrequency),
        stock: parseInt(stock) || 0,
        expiresAt: expiryDate ? convertDateFormat(expiryDate) : undefined,
        notes: notes.trim() || undefined,
      };

      // Validar com Zod
      updateMedicationSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const errors = formatZodErrors(error);
        setFormErrors(errors);
        return false;
      }
      // Erros de parsing de número
      if (isNaN(parseInt(stock))) {
        setFormErrors({ stock: 'Quantidade deve ser um número válido' });
        return false;
      }
      if (startTime && !/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(startTime)) {
        setFormErrors({ startTime: 'Horário deve estar no formato HH:MM' });
        return false;
      }
      return false;
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
    // Usar hora local porque DateTimePicker trabalha com hora local
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

  const handleClose = (): void => {
    // Verificar se houve mudanças
    const hasChanges =
      name !== (medication?.name || '') ||
      dosage !== (medication?.dosage || '') ||
      selectedFrequency !== getFrequencyValueFromEnum(medication?.frequency || 'ONE_TIME') ||
      stock !== (medication?.stock?.toString() || '') ||
      notes !== (medication?.notes || '') ||
      startTime !== (medication?.startTime || '08:00') ||
      expiryDate !==
        (medication?.expiresAt
          ? (() => {
              const date = new Date(medication.expiresAt!);
              const day = date.getDate().toString().padStart(2, '0');
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const year = date.getFullYear();
              return `${day}/${month}/${year}`;
            })()
          : '');

    if (hasChanges) {
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

  /**
   * Calcula o intervalo em horas baseado na frequência selecionada
   */
  const calculateIntervalHours = (frequency: string): number => {
    switch (frequency) {
      case 'Diária':
        return 24;
      case '2x ao dia':
      case '12 em 12 horas':
        return 12;
      case '3x ao dia':
      case '8 em 8 horas':
        return 8;
      case '4x ao dia':
      case '6 em 6 horas':
        return 6;
      case 'Semanal':
        return 24 * 7; // 168 horas
      case 'Mensal':
        return 24 * 30; // 720 horas (aproximado)
      default:
        return 24; // fallback para diário
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!validateForm() || !medication) {
      return;
    }

    try {
      // Encontrar o valor do enum correspondente à frequência selecionada
      const selectedOption = FREQUENCY_OPTIONS.find((option) => option.value === selectedFrequency);
      const frequencyEnumValue = selectedOption?.enumValue || 'ONE_TIME';

      const formData: UpdateMedicationData = {
        name: name.trim(),
        dosage: dosage.trim(),
        frequency: frequencyEnumValue,
        startTime: startTime || '08:00',
        intervalHours: calculateIntervalHours(selectedFrequency),
        stock: parseInt(stock),
        expiresAt: expiryDate ? convertDateFormat(expiryDate) : undefined,
        notes: notes.trim() || undefined,
      };

      await updateMedication(medication.id, formData);
      router.back();
    } catch (error) {
      // Toast já é mostrado pelo hook
    }
  };

  const convertDateFormat = (dateStr: string): string => {
    // Converte DD/MM/AAAA para AAAA-MM-DD
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  if (!medication) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <Text className="text-foreground dark:text-foreground-dark">Carregando medicamento...</Text>
      </View>
    );
  }

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
          Editar Medicamento
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

            {formErrors.startTime && (
              <View className="mt-1 flex-row items-center">
                <AlertCircle size={14} color="#ef4444" />
                <Text className="ml-1 text-sm text-red-500">{formErrors.startTime}</Text>
              </View>
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
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

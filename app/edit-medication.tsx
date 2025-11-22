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
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { X, Clock, Calendar, Package, FileText, AlertCircle } from 'lucide-react-native';
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
  {
    label: 'A cada 6 horas',
    value: '6 em 6 horas',
    enumValue: 'FOUR_TIMES_A_DAY',
    description: '4 vezes por dia',
  },
  {
    label: 'A cada 8 horas',
    value: '8 em 8 horas',
    enumValue: 'THREE_TIMES_A_DAY',
    description: '3 vezes por dia',
  },
  {
    label: 'A cada 12 horas',
    value: '12 em 12 horas',
    enumValue: 'TWICE_A_DAY',
    description: '2 vezes por dia',
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
  const [stock, setStock] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('08:00');

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

      // Converter data para formato DD/MM/AAAA
      if (medication.expiresAt) {
        const date = new Date(medication.expiresAt);
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
      className="flex-1">
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View className="flex-row items-center bg-background px-4 pb-6 pt-12 dark:bg-background-dark">
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color={colors.textPrimary} strokeWidth={2} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-center text-lg font-semibold text-foreground dark:text-foreground-dark">
              Editar Medicamento
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Form */}
        <View className="gap-1 px-4 pb-6">
          <FormField label="Nome do Medicamento" required error={formErrors.name}>
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
          </FormField>

          <FormField label="Dosagem" required error={formErrors.dosage} icon={Package}>
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
          </FormField>

          <FormField label="Frequência" required error={formErrors.frequency}>
            <View className="gap-2">
              {FREQUENCY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setSelectedFrequency(option.value)}
                  className={`rounded-lg border p-3 ${
                    selectedFrequency === option.value
                      ? 'border-primary bg-primary/10 dark:border-primary-dark dark:bg-primary-dark/10'
                      : 'border-border bg-secondary dark:border-border-dark dark:bg-secondary-dark'
                  }`}>
                  <Text
                    className={`text-base font-medium ${
                      selectedFrequency === option.value
                        ? 'text-primary dark:text-primary-dark'
                        : 'text-foreground dark:text-foreground-dark'
                    }`}>
                    {option.label}
                  </Text>
                  <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </FormField>

          <FormField label="Horário de Início" required error={formErrors.startTime} icon={Clock}>
            <TextInput
              value={startTime}
              onChangeText={(text) => {
                setStartTime(text);
                if (formErrors.startTime) setFormErrors({ ...formErrors, startTime: undefined });
              }}
              placeholder="08:00"
              placeholderTextColor={colors.textSecondary}
              className="h-12 rounded-lg bg-secondary px-4 text-base text-foreground dark:bg-secondary-dark dark:text-foreground-dark"
              keyboardType="numeric"
            />
          </FormField>

          <FormField label="Data de Validade" error={formErrors.expiryDate} icon={Calendar}>
            <TextInput
              value={expiryDate}
              onChangeText={(text) => {
                setExpiryDate(text);
                if (formErrors.expiryDate) setFormErrors({ ...formErrors, expiryDate: undefined });
              }}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={colors.textSecondary}
              className="h-12 rounded-lg bg-secondary px-4 text-base text-foreground dark:bg-secondary-dark dark:text-foreground-dark"
              keyboardType="numeric"
              maxLength={10}
            />
          </FormField>

          <FormField label="Quantidade em Estoque" required error={formErrors.stock} icon={Package}>
            <TextInput
              value={stock}
              onChangeText={(text) => {
                setStock(text);
                if (formErrors.stock) setFormErrors({ ...formErrors, stock: undefined });
              }}
              placeholder="Ex: 30"
              placeholderTextColor={colors.textSecondary}
              className="h-12 rounded-lg bg-secondary px-4 text-base text-foreground dark:bg-secondary-dark dark:text-foreground-dark"
              keyboardType="numeric"
            />
          </FormField>

          <FormField label="Observações" icon={FileText}>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Instruções especiais, efeitos colaterais, etc."
              placeholderTextColor={colors.textSecondary}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="min-h-20 rounded-lg bg-secondary px-4 py-3 text-base text-foreground dark:bg-secondary-dark dark:text-foreground-dark"
              autoCapitalize="sentences"
            />
          </FormField>

          {/* Error Message */}
          {error && (
            <View className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/20">
              <Text className="text-sm text-red-600 dark:text-red-400">{error}</Text>
            </View>
          )}

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            className="mt-4 h-12 items-center justify-center rounded-lg bg-primary disabled:opacity-50 dark:bg-primary-dark">
            <Text className="text-base font-semibold text-primary-foreground dark:text-primary-foreground-dark">
              {loading ? 'Salvando...' : 'Salvar Alterações'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

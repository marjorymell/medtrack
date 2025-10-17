import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { X } from 'lucide-react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { showToast } from '@/utils/toast';

interface AddMedicationFormData {
  name: string;
  dosage: string;
  frequency: string;
  expiryDate: string;
  stock: string;
  notes: string;
}

const FREQUENCY_OPTIONS: ReadonlyArray<string> = ['Diária', 'Semanal', 'Mensal'] as const;
const ITEM_HEIGHT = 50;

export default function AddMedicationScreen() {
  const router = useRouter();
  const colors = useThemeColors();
  const [name, setName] = useState<string>('');
  const [dosage, setDosage] = useState<string>('');
  const [selectedFrequencyIndex, setSelectedFrequencyIndex] = useState<number>(1);
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const frequencyScrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    console.log('[MOCK API] Página de adicionar medicamento carregada');
  }, []);

  useEffect(() => {
    if (selectedFrequencyIndex >= 0 && selectedFrequencyIndex < FREQUENCY_OPTIONS.length) {
      console.log('[MOCK API] Frequência selecionada:', FREQUENCY_OPTIONS[selectedFrequencyIndex]);
    }
  }, [selectedFrequencyIndex]);

  const handleClose = (): void => {
    console.log('[MOCK API] Fechando página de adicionar medicamento');
    router.back();
  };

  const handleSave = (): void => {
    const formData: AddMedicationFormData = {
      name,
      dosage,
      frequency: FREQUENCY_OPTIONS[selectedFrequencyIndex],
      expiryDate,
      stock,
      notes,
    };

    try {
      console.log('[MOCK API] Tentando salvar novo medicamento:', formData);
      // TODO: Implementar salvamento no backend

      showToast('Medicamento salvo com sucesso!', 'success');
      router.back();
    } catch (error) {
      console.error('[MOCK API] Erro ao salvar medicamento:', error);
      showToast('Erro ao salvar medicamento. Tente novamente.', 'error');
    }
  };

  const handleFrequencyScroll = (event: NativeSyntheticEvent<NativeScrollEvent>): void => {
    const offsetY: number = event.nativeEvent.contentOffset.y;
    const index: number = Math.round(offsetY / ITEM_HEIGHT);

    if (index >= 0 && index < FREQUENCY_OPTIONS.length) {
      setSelectedFrequencyIndex(index);
    }
  };

  const scrollToFrequency = (index: number): void => {
    setSelectedFrequencyIndex(index);
    frequencyScrollViewRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="flex-row items-center bg-background px-4 pb-6 pt-12 dark:bg-background-dark">
          <TouchableOpacity onPress={handleClose} className="p-2">
            <X size={24} color={colors.textPrimary} strokeWidth={2} />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-center text-lg font-medium text-foreground dark:text-foreground-dark">
              Adicionar Medicamento
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Form */}
        <View className="gap-5 px-4 pb-6">
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Nome do Medicamento"
            placeholderTextColor={colors.textSecondary}
            className="h-12 rounded-lg bg-secondary px-4 text-base text-foreground dark:bg-secondary-dark dark:text-foreground-dark"
          />

          {/* Dosagem */}
          <TextInput
            value={dosage}
            onChangeText={setDosage}
            placeholder="Dosagem (ex: 500mg)"
            placeholderTextColor={colors.textSecondary}
            className="h-12 rounded-lg bg-secondary px-4 text-base text-foreground dark:bg-secondary-dark dark:text-foreground-dark"
          />

          {/* Seletor de Frequência (Carrossel Vertical) */}
          <View className="h-[150px] overflow-hidden rounded-lg">
            <View
              className="absolute left-0 right-0 top-[50px] h-[50px] rounded-lg"
              style={{ backgroundColor: colors.backgroundSecondary }}
            />

            <ScrollView
              ref={frequencyScrollViewRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate="fast"
              onLayout={() => {
                frequencyScrollViewRef.current?.scrollTo({
                  y: selectedFrequencyIndex * ITEM_HEIGHT,
                  animated: false,
                });
              }}
              onMomentumScrollEnd={handleFrequencyScroll}
              contentContainerStyle={{ paddingVertical: 50 }}>
              {FREQUENCY_OPTIONS.map((option, index) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => scrollToFrequency(index)}
                  className="h-[50px] items-center justify-center">
                  <Text
                    className={`text-base ${index === selectedFrequencyIndex ? 'font-semibold' : 'opacity-50'}`}
                    style={{
                      color:
                        index === selectedFrequencyIndex
                          ? colors.textPrimary
                          : colors.textSecondary,
                      fontSize: index === selectedFrequencyIndex ? 18 : 16,
                    }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Validade */}
          <TextInput
            value={expiryDate}
            onChangeText={setExpiryDate}
            placeholder="Validade (DD/MM/AAAA)"
            placeholderTextColor={colors.textSecondary}
            className="h-12 rounded-lg bg-secondary px-4 text-base text-foreground dark:bg-secondary-dark dark:text-foreground-dark"
            keyboardType="numeric"
          />

          {/* Quantidade em Estoque */}
          <TextInput
            value={stock}
            onChangeText={setStock}
            placeholder="Quantidade em Estoque"
            placeholderTextColor={colors.textSecondary}
            className="h-12 rounded-lg bg-secondary px-4 text-base text-foreground dark:bg-secondary-dark dark:text-foreground-dark"
            keyboardType="numeric"
          />

          {/* Observações */}
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Observação"
            placeholderTextColor={colors.textSecondary}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-24 rounded-lg bg-secondary px-4 py-3 text-base text-foreground dark:bg-secondary-dark dark:text-foreground-dark"
          />

          {/* Botão Salvar */}
          <TouchableOpacity
            onPress={handleSave}
            className="mt-2 h-12 items-center justify-center rounded-lg bg-primary dark:bg-primary-dark">
            <Text className="text-base font-semibold text-primary-foreground dark:text-primary-foreground-dark">
              Salvar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

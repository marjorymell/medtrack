import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Plus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { MOCK_MEDICATION_STOCK } from '@/mocks/medication-data';
import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function StockScreen() {
  const { colorScheme } = useColorScheme();
  const colors = useThemeColors();
  const router = useRouter();

  useEffect(() => {
    console.log('[MOCK API] Página de estoque carregada');
    console.log('[MOCK API] Buscando medicamentos do estoque...');
    console.log(`[MOCK API] ✓ Retornando ${MOCK_MEDICATION_STOCK.length} medicamentos do estoque`);
    console.log('[MOCK API] Dados do estoque:', MOCK_MEDICATION_STOCK);
  }, []);

  const renderMedicationItem = ({ item }: { item: (typeof MOCK_MEDICATION_STOCK)[0] }) => (
    <View className="flex-row items-center px-4 py-6">
      <View className="mr-4 h-12 w-12 items-center justify-center rounded-lg bg-secondary dark:bg-secondary-dark">
        <Image
          source={
            colorScheme === 'dark'
              ? require('@/assets/icons/pill-icon-white.png')
              : require('@/assets/icons/pill-icon.png')
          }
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </View>

      <View className="flex-1">
        <Text className="mb-1 text-base font-semibold text-foreground dark:text-foreground-dark">
          {item.name} {item.dosage}
        </Text>
        <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
          {item.currentStock} comprimidos restantes
        </Text>
      </View>
    </View>
  );

  const handleAddMedication = () => {
    console.log('[MOCK API] Navegando para página de adicionar medicamento');
    router.push('/add-medication' as any);
  };

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <View className="relative items-center justify-center px-6 pb-4 pt-12">
        <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">Estoque</Text>
        <TouchableOpacity
          className="absolute right-6 items-center justify-center"
          style={{ top: 48 }}
          onPress={handleAddMedication}>
          <Plus size={24} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_MEDICATION_STOCK}
        renderItem={renderMedicationItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

import { View, FlatList, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { Plus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useThemeColors } from '@/hooks/use-theme-colors';

const medications = [
  { id: '1', name: 'Paracetamol', remainingPills: 30 },
  { id: '2', name: 'Ibuprofeno', remainingPills: 15 },
  { id: '3', name: 'Amoxicilina', remainingPills: 8 },
  { id: '4', name: 'Dipirona', remainingPills: 45 },
  { id: '5', name: 'Omeprazol', remainingPills: 22 },
];

export default function StockScreen() {
  const { colorScheme } = useColorScheme();
  const colors = useThemeColors();

  const renderMedicationItem = ({ item }: { item: (typeof medications)[0] }) => (
    <View className="mb-3 flex-row items-center rounded-xl p-4">
      <View
        className="mr-4 h-12 w-12 items-center justify-center rounded-lg"
        style={{ backgroundColor: '#F0F2F5' }}>
        <Image
          source={require('@/assets/icons/pill-icon.png')}
          style={{ width: 24, height: 24 }}
          resizeMode="contain"
        />
      </View>

      <View className="flex-1">
        <Text className="mb-1 text-base font-semibold text-foreground dark:text-foreground-dark">
          {item.name}
        </Text>
        <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
          {item.remainingPills} comprimidos restantes
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <View className="relative items-center justify-center px-6 pb-4 pt-12">
        <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">Estoque</Text>
        <TouchableOpacity
          className="absolute right-6 items-center justify-center"
          style={{ top: 48 }}
          onPress={() => {
            // TODO: Navegar para página de adicionar medicamento
            console.log('Adicionar medicamento');
          }}>
          <Plus size={24} color={colors.foreground} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={medications}
        renderItem={renderMedicationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

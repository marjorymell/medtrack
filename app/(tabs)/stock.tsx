import { View, FlatList, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/text';
import { Plus } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { COLORS } from '@/lib/theme';
import { SvgXml } from 'react-native-svg';

const pillIconSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.5 9.5L14.5 13.5M10.5 13.5L14.5 9.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
</svg>`;

const medications = [
  { id: '1', name: 'Paracetamol', remainingPills: 30 },
  { id: '2', name: 'Ibuprofeno', remainingPills: 15 },
  { id: '3', name: 'Amoxicilina', remainingPills: 8 },
  { id: '4', name: 'Dipirona', remainingPills: 45 },
  { id: '5', name: 'Omeprazol', remainingPills: 22 },
];

export default function StockScreen() {
  const { colorScheme } = useColorScheme();
  const colors = COLORS[colorScheme ?? 'light'];

  const renderMedicationItem = ({ item }: { item: (typeof medications)[0] }) => (
    <View className="mb-3 flex-row items-center rounded-xl bg-white p-4 dark:bg-gray-800">
      <View
        className="mr-4 h-12 w-12 items-center justify-center rounded-lg"
        style={{ backgroundColor: '#F0F2F5' }}>
        <SvgXml xml={pillIconSvg} width={24} height={24} />
      </View>

      <View className="flex-1">
        <Text className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
          {item.name}
        </Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {item.remainingPills} comprimidos restantes
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50 dark:bg-gray-900">
      <View className="flex-row items-center justify-between px-6 pb-4 pt-12">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">Estoque</Text>
        <TouchableOpacity
          className="h-12 w-12 items-center justify-center rounded-full"
          style={{ backgroundColor: colors.primary }}
          onPress={() => {
            // TODO: Navegar para página de adicionar medicamento
            console.log('Adicionar medicamento');
          }}>
          <Plus size={24} color="white" />
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

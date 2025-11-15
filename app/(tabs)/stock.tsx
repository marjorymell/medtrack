import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import { Text } from '@/components/ui/text';
import {
  Plus,
  Edit,
  Trash2,
  Package,
  Calendar,
  Clock,
  RefreshCw,
  X,
  Check,
} from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { useMedications } from '@/hooks/use-medications';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startTime: string;
  stock: number;
  expiresAt?: string;
  notes?: string;
}

export default function StockScreen() {
  const { colorScheme } = useColorScheme();
  const colors = useThemeColors();
  const { medications, loading, deleteMedication, updateStock, refetch } = useMedications();
  const router = useRouter();

  console.log('[StockScreen] Render - medications:', medications?.length || 0, 'itens');

  // Monitorar mudanças nos medications
  useEffect(() => {
    console.log(
      '[StockScreen] useEffect - medications changed:',
      medications?.length || 0,
      'itens'
    );
    if (medications && medications.length > 0) {
      console.log('[StockScreen] Primeiro medicamento:', medications[0]);
    }
  }, [medications]);

  // Estado para modal de atualização de estoque
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [newStockValue, setNewStockValue] = useState('');

  const handleRefresh = () => {
    refetch();
  };

  // Função para traduzir frequência do enum para português
  const translateFrequency = (frequency: string): string => {
    const translations: Record<string, string> = {
      ONE_TIME: 'Diária',
      TWICE_A_DAY: '2x ao dia',
      THREE_TIMES_A_DAY: '3x ao dia',
      FOUR_TIMES_A_DAY: '4x ao dia',
      EVERY_OTHER_DAY: 'A cada 2 dias',
      WEEKLY: 'Semanal',
      MONTHLY: 'Mensal',
      AS_NEEDED: 'Quando necessário',
      CUSTOM: 'Personalizado',
    };
    return translations[frequency] || frequency;
  };

  const handleAddMedication = () => {
    router.push('/add-medication' as any);
  };

  const handleEditMedication = (medication: Medication) => {
    router.push(`/edit-medication?id=${medication.id}` as any);
  };

  const handleDeleteMedication = (medication: Medication) => {
    console.log(
      `[StockScreen] Iniciando delete do medicamento: ${medication.id} - ${medication.name}`
    );
    Alert.alert(
      'Remover Medicamento',
      `Tem certeza que deseja remover "${medication.name}"? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => {
            console.log(`[StockScreen] Usuário confirmou delete, chamando deleteMedication`);
            deleteMedication(medication.id);
          },
        },
      ]
    );
  };

  const handleUpdateStock = (medication: Medication) => {
    setSelectedMedication(medication);
    setNewStockValue(medication.stock.toString());
    setStockModalVisible(true);
  };

  const handleConfirmUpdateStock = async () => {
    if (!selectedMedication) return;

    const stock = parseInt(newStockValue);
    if (isNaN(stock) || stock < 0) {
      Alert.alert('Erro', 'Por favor, insira um número válido (0 ou maior)');
      return;
    }

    console.log(
      `[StockScreen] Iniciando updateStock para ${selectedMedication.id} com valor ${stock}`
    );
    try {
      await updateStock(selectedMedication.id, stock);
      console.log(`[StockScreen] updateStock concluído, fechando modal`);
      setStockModalVisible(false);
      setSelectedMedication(null);
      setNewStockValue('');
    } catch (error) {
      console.log(`[StockScreen] Erro em updateStock:`, error);
      // Erro já tratado no hook
    }
  };

  const handleCancelUpdateStock = () => {
    setStockModalVisible(false);
    setSelectedMedication(null);
    setNewStockValue('');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'Data inválida';
    }
  };

  const renderMedicationItem = ({ item }: { item: Medication }) => {
    return (
      <View className="mx-4 mb-3 rounded-lg bg-card p-4 dark:bg-card-dark">
        {/* Header com nome e ações */}
        <View className="mb-3 flex-row items-start justify-between">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
              {item.name}
            </Text>
            <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
              {item.dosage}
            </Text>
          </View>

          <View className="flex-row gap-2">
            <TouchableOpacity
              onPress={() => handleEditMedication(item)}
              className="rounded-full bg-secondary p-2 dark:bg-secondary-dark">
              <Edit size={16} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleDeleteMedication(item)}
              className="rounded-full bg-red-100 p-2 dark:bg-red-900/20">
              <Trash2 size={16} color="#ef4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Informações do medicamento */}
        <View className="gap-2">
          <View className="flex-row items-center gap-2">
            <Clock size={14} color={colors.textSecondary} />
            <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
              {translateFrequency(item.frequency)} • {item.startTime}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <Calendar size={14} color={colors.textSecondary} />
            <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
              Vence em: {formatDate(item.expiresAt)}
            </Text>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Package size={14} color={colors.textSecondary} />
              <Text className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                {item.stock} {item.stock === 1 ? 'comprimido restante' : 'comprimidos restantes'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => handleUpdateStock(item)}
              className="rounded-md bg-primary px-3 py-1 dark:bg-primary-dark">
              <Text className="text-xs font-medium text-primary-foreground dark:text-primary-foreground-dark">
                Atualizar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Observações */}
          {item.notes && (
            <View className="mt-2 rounded-md bg-secondary p-2 dark:bg-secondary-dark">
              <Text className="text-xs text-muted-foreground dark:text-muted-foreground-dark">
                {item.notes}
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <Text className="text-foreground dark:text-foreground-dark">
          Carregando medicamentos...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <View className="relative items-center justify-center px-6 pb-4 pt-12">
        <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
          Meus Medicamentos
        </Text>
        <View className="absolute right-6 flex-row items-center gap-2" style={{ top: 48 }}>
          <TouchableOpacity onPress={handleRefresh} className="items-center justify-center p-2">
            <RefreshCw size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity className="items-center justify-center" onPress={handleAddMedication}>
            <Plus size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={medications}
        renderItem={renderMedicationItem}
        keyExtractor={(item) => `${item.id}-${item.updatedAt}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Text className="mb-4 text-center text-muted-foreground dark:text-muted-foreground-dark">
              Nenhum medicamento cadastrado
            </Text>
            <TouchableOpacity
              onPress={handleAddMedication}
              className="rounded-lg bg-primary px-6 py-3 dark:bg-primary-dark">
              <Text className="font-medium text-primary-foreground dark:text-primary-foreground-dark">
                Adicionar Primeiro Medicamento
              </Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Modal para atualizar estoque */}
      <Modal
        visible={stockModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancelUpdateStock}>
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className="mx-4 w-full max-w-sm rounded-lg bg-card p-6 dark:bg-card-dark">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold text-foreground dark:text-foreground-dark">
                Atualizar Estoque
              </Text>
              <TouchableOpacity onPress={handleCancelUpdateStock}>
                <X size={24} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>

            {selectedMedication && (
              <>
                <Text className="mb-2 text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  {selectedMedication.name} - {selectedMedication.dosage}
                </Text>
                <Text className="mb-4 text-sm text-muted-foreground dark:text-muted-foreground-dark">
                  Estoque atual: {selectedMedication.stock}
                </Text>

                <TextInput
                  className="mb-6 rounded-lg border border-border bg-background px-4 py-3 text-foreground dark:border-border-dark dark:bg-background-dark dark:text-foreground-dark"
                  placeholder="Novo estoque"
                  value={newStockValue}
                  onChangeText={setNewStockValue}
                  keyboardType="numeric"
                  autoFocus={true}
                />

                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={handleCancelUpdateStock}
                    className="flex-1 rounded-lg bg-secondary px-4 py-3 dark:bg-secondary-dark">
                    <Text className="text-center font-medium text-secondary-foreground dark:text-secondary-foreground-dark">
                      Cancelar
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleConfirmUpdateStock}
                    className="flex-1 rounded-lg bg-primary px-4 py-3 dark:bg-primary-dark">
                    <Text className="text-center font-medium text-primary-foreground dark:text-primary-foreground-dark">
                      Atualizar
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

import { View, FlatList, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { HomeHeader } from '@/components/home-header'; // Removendo importação no uso, mas mantendo aqui por enquanto
import { MedicationCard } from '@/components/medication-card';
import { useTodayMedications } from '@/hooks/use-today-medications';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { showToast } from '@/utils/toast';
import { useState } from 'react';
import { Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const HomeTitleHeader = ({ onNotificationPress }: { onNotificationPress: () => void }) => {
  const colors = useThemeColors();

  return (
    <View className="relative items-center justify-center px-6 pb-4 pt-12">
      <Text className="text-lg font-bold text-foreground dark:text-foreground-dark">
        Medicamentos de Hoje
      </Text>
      <Pressable
        className="absolute right-6 items-center justify-center"
        style={{ top: 48 }}
        onPress={onNotificationPress}>
        <Bell size={24} color={colors.textPrimary} />
      </Pressable>
    </View>
  );
};

export default function HomeScreen() {
  const colors = useThemeColors();
  const router = useRouter();

  const { medications, isLoading, error, refetch, confirmMedication, postponeMedication } =
    useTodayMedications();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleNotificationPress = () => {
    // TODO: Navegar para tela de notificações
    console.log('Abrir notificações');
  };

  const handleConfirm = async (scheduleId: string) => {
    try {
      await confirmMedication(scheduleId);
      showToast('Medicamento confirmado com sucesso!', 'success');
    } catch (error) {
      showToast('Erro ao confirmar medicamento', 'error');
    }
  };

  const handlePostpone = async (scheduleId: string) => {
    try {
      await postponeMedication(scheduleId);
      showToast('Medicamento adiado por 30 minutos', 'success');
    } catch (error) {
      showToast('Erro ao adiar medicamento', 'error');
    }
  };

  if (isLoading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-4 dark:bg-background-dark">
        <Text className="mb-4 text-center text-muted-foreground dark:text-muted-foreground-dark">
          {error}
        </Text>
        <Pressable
          onPress={refetch}
          className="rounded-lg bg-primary px-6 py-3 dark:bg-primary-dark">
          <Text className="font-bold text-primary-foreground dark:text-primary-foreground-dark">
            Tentar Novamente
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background dark:bg-background-dark">
      <HomeTitleHeader onNotificationPress={handleNotificationPress} />

      <FlatList
        data={medications}
        keyExtractor={(item) => item.scheduleId}
        renderItem={({ item }) => (
          <MedicationCard medication={item} onConfirm={handleConfirm} onPostpone={handlePostpone} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-center text-muted-foreground dark:text-muted-foreground-dark">
              Nenhum medicamento programado para hoje
            </Text>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
}

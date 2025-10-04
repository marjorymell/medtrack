import { View, FlatList, ActivityIndicator, RefreshControl, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { HomeHeader } from '@/components/home-header';
import { MedicationCard } from '@/components/medication-card';
import { useTodayMedications } from '@/hooks/use-today-medications';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { showToast } from '@/utils/toast';
import { useState } from 'react';

export default function HomeScreen() {
  const colors = useThemeColors();
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
      <View className="bg-background dark:bg-background-dark flex-1 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  };

  if (error) {
    return (
      <View className="bg-background dark:bg-background-dark flex-1 items-center justify-center px-4">
        <Text className="text-muted-foreground dark:text-muted-foreground-dark mb-4 text-center">{error}</Text>
        <Pressable onPress={refetch} className="bg-primary dark:bg-primary-dark rounded-lg px-6 py-3">
          <Text className="text-primary-foreground dark:text-primary-foreground-dark font-bold">Tentar Novamente</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="bg-background dark:bg-background-dark flex-1">
      <HomeHeader onNotificationPress={handleNotificationPress} />

      <FlatList
        data={medications}
        keyExtractor={(item) => item.scheduleId}
        renderItem={({ item }) => (
          <MedicationCard medication={item} onConfirm={handleConfirm} onPostpone={handlePostpone} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-muted-foreground dark:text-muted-foreground-dark text-center">
              Nenhum medicamento programado para hoje
            </Text>
          </View>
        }
        contentContainerStyle={{ flexGrow: 1 }}
      />
    </View>
  );
}

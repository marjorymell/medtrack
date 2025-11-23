import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistQueryClient } from '@tanstack/react-query-persist-client';

// Configurar persistor customizado para AsyncStorage
const createAsyncStoragePersistor = () => ({
  persistClient: async (client: any) => {
    try {
      const cache = JSON.stringify(client.getQueryCache().getAll());
      await AsyncStorage.setItem('medtrack-query-cache', cache);
    } catch (error) {

    }
  },
  restoreClient: async () => {
    try {
      const cache = await AsyncStorage.getItem('medtrack-query-cache');
      return cache ? JSON.parse(cache) : undefined;
    } catch (error) {

      return undefined;
    }
  },
  removeClient: async () => {
    try {
      await AsyncStorage.removeItem('medtrack-query-cache');
    } catch (error) {

    }
  },
});

export const asyncStoragePersistor = createAsyncStoragePersistor();

// Função para configurar persistência no QueryClient
export function setupQueryPersistence(queryClient: any) {
  persistQueryClient({
    queryClient,
    persister: asyncStoragePersistor,
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    dehydrateOptions: {
      // Não persistir queries com erro
      shouldDehydrateQuery: ({ state }: any) => {
        return !state.error && state.status === 'success';
      },
    },
  });
}

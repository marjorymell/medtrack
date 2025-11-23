import { QueryClient } from '@tanstack/react-query';
import { setupQueryPersistence } from './query-persistence';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dados ficam "fresh" por 5 minutos
      staleTime: 5 * 60 * 1000, // 5 minutos
      // Cache é mantido por 10 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos (anteriormente cacheTime)
      // Tentar novamente 2 vezes em caso de erro
      retry: 2,
      // Não refetch quando a tela volta ao foco (otimizado para mobile)
      refetchOnWindowFocus: false,
      // Refetch quando reconectar à internet
      refetchOnReconnect: true,
      // Não refetch em mount se os dados ainda são fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry mutations uma vez em caso de erro
      retry: 1,
    },
  },
});

// Configurar persistência de cache
setupQueryPersistence(queryClient);

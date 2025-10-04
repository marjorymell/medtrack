/**
 * Simula a latência de rede para tornar os mocks mais realistas
 * @param ms - Tempo de delay em milissegundos (padrão: 500-1500ms aleatório)
 */
export function simulateNetworkDelay(ms?: number): Promise<void> {
  const delay = ms ?? Math.random() * 1000 + 500; // 500-1500ms
  return new Promise((resolve) => setTimeout(resolve, delay));
}

/**
 * Simula possível erro de rede (10% de chance)
 * @param errorMessage - Mensagem de erro customizada
 */
export function simulateNetworkError(errorMessage: string = 'Erro de conexão'): void {
  const shouldFail = Math.random() < 0.1; // 10% de chance de erro
  if (shouldFail) {
    throw new Error(errorMessage);
  }
}

/**
 * Formata horário para exibição (HH:MM)
 */
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Gera um ID único (para uso em mocks)
 */
export function generateMockId(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

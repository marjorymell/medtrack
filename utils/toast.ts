import { Alert, Platform } from 'react-native';

/**
 * Exibe uma mensagem de feedback ao usuário
 * 
 * TODO: Substituir por biblioteca mais robusta como:
 * - react-native-toast-message
 * - react-native-paper (Snackbar)
 * - Ou implementar toast customizado
 * 
 * @param message - Mensagem a ser exibida
 * @param type - Tipo do toast: 'success' ou 'error'
 */
export function showToast(message: string, type: 'success' | 'error' = 'success') {
  if (Platform.OS === 'web') {
    // Para web, usar alert simples ou biblioteca de toast
    alert(message);
  } else {
    // Para mobile, usar Alert nativo
    Alert.alert(
      type === 'success' ? 'Sucesso' : 'Erro',
      message,
      [{ text: 'OK' }]
    );
  }
}

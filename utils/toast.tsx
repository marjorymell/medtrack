import React from 'react';
import Toast, { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

/**
 * Configuração de toast customizado alinhada com o design system MedTrack
 */
const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#05D3DB', // Primary color
        backgroundColor: '#FFFFFF',
        borderLeftWidth: 6,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        paddingVertical: 12,
        paddingHorizontal: 16,
        minHeight: 60,
      }}
      contentContainerStyle={{
        paddingHorizontal: 12,
        flex: 1,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: '#121417',
        marginBottom: 2,
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: '400',
        color: '#637387',
        lineHeight: 18,
      }}
      text2NumberOfLines={2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#EF4444', // Error color
        backgroundColor: '#FFFFFF',
        borderLeftWidth: 6,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        paddingVertical: 12,
        paddingHorizontal: 16,
        minHeight: 60,
      }}
      contentContainerStyle={{
        paddingHorizontal: 12,
        flex: 1,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: '#121417',
        marginBottom: 2,
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: '400',
        color: '#637387',
        lineHeight: 18,
      }}
      text2NumberOfLines={2}
    />
  ),
  warning: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#F59E0B', // Warning color
        backgroundColor: '#FFFFFF',
        borderLeftWidth: 6,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
        paddingVertical: 12,
        paddingHorizontal: 16,
        minHeight: 60,
      }}
      contentContainerStyle={{
        paddingHorizontal: 12,
        flex: 1,
      }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: '#121417',
        marginBottom: 2,
      }}
      text2Style={{
        fontSize: 13,
        fontWeight: '400',
        color: '#637387',
        lineHeight: 18,
      }}
      text2NumberOfLines={2}
    />
  ),
};

/**
 * Exibe uma mensagem de feedback ao usuário com design MedTrack
 *
 * @param message - Mensagem principal (título)
 * @param type - Tipo do toast: 'success', 'error' ou 'warning'
 * @param description - Mensagem secundária (opcional)
 */
export function showToast(
  message: string,
  type: 'success' | 'error' | 'warning' = 'success',
  description?: string
) {
  Toast.show({
    type,
    text1: message,
    text2: description,
    position: 'top',
    visibilityTime: 4000,
    autoHide: true,
    topOffset: 50,
    bottomOffset: 40,
  });
}

/**
 * Esconde o toast atual
 */
export function hideToast() {
  Toast.hide();
}

/**
 * Exporta a configuração do toast para usar no App
 */
export { toastConfig };

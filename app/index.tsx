import { View, ScrollView, Pressable, Image } from 'react-native';
import { Text } from '@/components/ui/text';
import { useRouter } from 'expo-router';
import { useThemeColors } from '@/hooks/use-theme-colors';

export default function LoginScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  const handleLogin = () => {
    console.log('[MOCK API] Usuário clicou em Entrar');
    // TODO: inputs de email e senha
  };

  const handleCreateAccount = () => {
    console.log('[MOCK API] Usuário clicou em Criar Conta');
    // TODO: inputs de criação de conta
  };

  const handleLoginWithoutAuth = () => {
    console.log('[MOCK API] Usuário tentou entrar sem logar');
    router.replace('/(tabs)');
    console.log('[MOCK API] Acesso sem autenticação concedido');
  };

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-background-dark"
      contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo and Text Section */}
        <View className="mb-12 w-full items-center">
          <View className="mb-6">
            <Image
              source={require('@/assets/images/logo-medtrack.png')}
              style={{ width: 154, height: 154 }}
              resizeMode="contain"
            />
          </View>

          {/* MedTrack Text */}
          <Text className="mb-12 text-[22px] font-semibold text-foreground dark:text-foreground-dark">
            MedTrack
          </Text>

          <Pressable
            onPress={handleLogin}
            className="mb-3 h-12 w-full items-center justify-center rounded-lg bg-primary dark:bg-primary-dark"
            accessibilityLabel="Entrar"
            accessibilityRole="button">
            <Text className="text-base font-bold text-primary-foreground dark:text-primary-foreground-dark">
              Entrar
            </Text>
          </Pressable>

          {/* Create Account Button */}
          <Pressable
            onPress={handleCreateAccount}
            className="mb-4 h-12 w-full items-center justify-center rounded-lg bg-secondary dark:bg-secondary-dark"
            accessibilityLabel="Criar Conta"
            accessibilityRole="button">
            <Text className="text-base font-semibold text-foreground dark:text-foreground-dark">
              Criar Conta
            </Text>
          </Pressable>

          <Pressable
            onPress={handleLoginWithoutAuth}
            accessibilityLabel="Entrar sem logar"
            accessibilityRole="button">
            <View className="border-b pb-0.5" style={{ borderColor: colors.textSecondary }}>
              <Text className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                Entrar sem logar
              </Text>
            </View>
          </Pressable>
        </View>
      </View>

      <View className="px-6 py-8">
        <Text
          className="text-center text-xs leading-relaxed"
          style={{ color: colors.textSecondary }}>
          Ao continuar, você concorda com nossos Termos de Serviço e Política de Privacidade.
        </Text>
      </View>
    </ScrollView>
  );
}

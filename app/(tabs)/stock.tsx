import { View } from 'react-native';
import Link from 'expo-router/link';
import { Text } from '@/components/ui/text';
import { Button, buttonVariants } from '@/components/ui/button';

export default function StockScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>Stock</Text>
      <Link className={buttonVariants({ variant: 'outline' })} href="/" asChild>
        <Text>Exemplo de botão para o início</Text>
      </Link>
    </View>
  );
}

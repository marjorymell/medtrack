

# MedTrack (Frontend)
Aplicativo mobile para controle de medicamentos, desenvolvido com React Native e Expo.

 ## Principais Funcionalidades
- [React Native Docs](https://reactnative.dev/docs/getting-started)
    - Cadastro e gerenciamento de medicamentos
    - Notificações de lembrete
    - Controle de estoque
    - Autenticação de usuários
    - Integração com backend para persistência de dados
- [Expo Docs](https://docs.expo.dev/)
  
## Tecnologias Utilizadas
- [Nativewind Docs](https://www.nativewind.dev/)
    - React Native (Expo)
    - TypeScript
    - NativeWind (Tailwind CSS para RN)
    - React Context API
    - React Query
    - Jest (testes)
- [React Native Reusables](https://reactnativereusables.com)

## Pré-requisitos
- Node.js 18+
- npm, yarn, pnpm ou bun
- Expo CLI (`npm install -g expo-cli`)
- Backend rodando (ver instruções em `medtrack-backend/README.md`)
- MongoDB (se usar local, configure em `.env`)

## Configuração
1. Instale as dependências:
```bash
npm install
# ou
yarn
```

2. Configure o arquivo `.env`:
```
EXPO_PUBLIC_API_URL=http://<IP_BACKEND>:3000/api
EXPO_PUBLIC_USE_MOCK_API=false
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

4. Abra o app:
- Android: pressione `a`
- iOS: pressione `i` (Mac)
- Web: pressione `w`
- Ou escaneie o QR code com o app Expo Go

## Testes
Execute os testes com:
```bash
npm test
# ou

## Integração com Backend

Certifique-se de que o backend está rodando e que o endereço está correto no `.env`. Veja instruções detalhadas em `medtrack-backend/README.md`.

- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Updates](https://docs.expo.dev/eas-update/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)

---

If you enjoy using React Native Reusables, please consider giving it a ⭐ on [GitHub](https://github.com/founded-labs/react-native-reusables). Your support means a lot!

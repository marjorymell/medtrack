---
description: 'Instruções personalizadas do GitHub Copilot para o projeto MedTrack - Aplicativo de gerenciamento de medicação'
---

# MedTrack - GitHub Copilot Instructions

## Visão Geral do Projeto

MedTrack é um aplicativo móvel multiplataforma (Android e iOS) para gerenciamento de medicação diária. O objetivo principal é garantir que os usuários sigam corretamente seus tratamentos por meio de alertas, notificações e controle de estoque.

## Stack Tecnológica

### Frontend (Mobile)
- **Framework**: React Native com Expo
- **Linguagem**: TypeScript
- **Roteamento**: Expo Router (file-based routing)
- **Estilização**: Tailwind CSS com NativeWind v4
- **Bibliotecas de UI**: 
  - `gluestack-ui` para componentes base padrão
  - Abordagem `shadcn/ui` adaptada para componentes customizados
- **Gerenciamento de Estado**: React Context, Zustand ou Redux Toolkit
- **Notificações**: Expo Push Notifications

### Backend
- **Runtime**: Node.js
- **Linguagem**: TypeScript
- **API**: RESTful
- **ORM**: Prisma Client
- **Autenticação**: JWT (JSON Web Token)
- **Banco de Dados**: MongoDB (NoSQL)

## Arquitetura do Projeto

### Frontend (Aplicativo Mobile)
1. **Camada de Apresentação (UI)**
   - Componentes construídos com gluestack-ui e shadcn/ui
   - Estilização com classes Tailwind CSS via NativeWind
   
2. **Gerenciamento de Estado**
   - Controle de dados em tempo de execução
   - Estado do usuário logado
   - Lista de medicamentos
   
3. **Camada de Serviços**
   - Comunicação HTTP com backend (fetch/axios)
   - Registro de dispositivos para notificações
   - Manipulação de notificações recebidas

### Backend (Servidor da Aplicação)
1. **Controllers**: Recebem requisições HTTP, validam dados e direcionam para serviços
2. **Camada de Serviço**: Lógica de negócio (cadastro, verificação de estoque, agendamento)
3. **Camada de Dados**: Prisma Client para acesso ao MongoDB

## Convenções de Código

### TypeScript
- **SEMPRE** usar tipos explícitos
- **EVITAR** uso de `any` - usar `unknown` quando o tipo for desconhecido
- Criar interfaces para objetos complexos
- Preferir `interface` ao invés de `type` para objetos
- Usar `const` ao invés de `let` sempre que possível

### React Native / Expo
- Usar **componentes funcionais** com hooks
- Usar `React.memo()` para otimização quando necessário
- Separar lógica de negócio de componentes de apresentação
- Nomear componentes com PascalCase
- Nomear arquivos de componentes com kebab-case ou PascalCase consistentemente

### Estilização com NativeWind
- **SEMPRE** usar classes Tailwind via NativeWind
- **NÃO** usar StyleSheet.create() do React Native
- Usar a prop `className` para aplicar estilos
- Manter consistência com o design system minimalista
- Criar componentes reutilizáveis para padrões comuns

**Exemplo:**
```tsx
// ✅ CORRETO
import { View, Text } from 'react-native';

export function MedicationCard() {
  return (
    <View className="bg-white p-4 rounded-lg shadow-md">
      <Text className="text-lg font-semibold text-gray-800">
        Paracetamol 750mg
      </Text>
    </View>
  );
}

// ❌ EVITAR
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', padding: 16 }
});
```

### Estrutura de Pastas

```
app/
  _layout.tsx           # Layout principal com navegação
  +html.tsx             # Configuração HTML raiz
  +not-found.tsx        # Página 404
  index.tsx             # Tela de Login
  (tabs)/               # Grupo de rotas em tabs
    _layout.tsx         # Layout das tabs
    index.tsx           # Dashboard/Home
    history.tsx         # Histórico de medicamentos
    profile.tsx         # Perfil do usuário
    stock.tsx           # Controle de estoque

components/
  ui/                   # Componentes reutilizáveis
    button.tsx
    icon.tsx
    text.tsx

lib/
  theme.ts              # Configuração de tema
  utils.ts              # Funções utilitárias
```

## Regras de Negócio (CRÍTICO)

### RN01 - Agendamento de Notificações
- Ao cadastrar medicamento, calcular timestamps exatos dos lembretes
- Armazenar `expoPushToken` do usuário no cadastro
- Validar que o horário programado é futuro

### RN02 - Controle de Estoque
- Decrementar automaticamente ao confirmar dose
- Alertar quando estoque atingir limite mínimo configurável
- **NUNCA** permitir estoque negativo

### RN03 - Histórico de Adesão
- Registrar timestamp de cada confirmação
- Marcar como "não tomado" se passar do horário sem confirmação
- Calcular taxa de adesão: `(doses tomadas / doses programadas) * 100`

### RN04 - Validação de Dados
- Nome do medicamento: **obrigatório**, mínimo 2 caracteres
- Dosagem: **obrigatória**
- Frequência: **obrigatória**, valor válido
- Estoque: número **não negativo**
- Data de validade: **deve ser futura**

### RN05 - Autenticação
- Todas as rotas protegidas requerem JWT válido
- Token deve conter `userId` para associação de dados
- Implementar refresh token quando o token principal expirar

## Padrões de API

### Estrutura de Requisição
```typescript
// Headers obrigatórios
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"
}
```

### Endpoints Principais

**Medicamentos**
- `POST /v1/medications` - Criar medicamento
- `GET /v1/medications` - Listar medicamentos do usuário
- `GET /v1/medications/:id` - Buscar medicamento específico
- `PUT /v1/medications/:id` - Atualizar medicamento
- `DELETE /v1/medications/:id` - Deletar medicamento

**Histórico**
- `POST /v1/history` - Registrar dose tomada
- `GET /v1/history` - Buscar histórico
- `GET /v1/history/adherence` - Calcular taxa de adesão

### Estrutura de Resposta
```typescript
// Sucesso
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}

// Erro
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Descrição do erro",
    "details": [ ... ]
  }
}
```

## Tratamento de Erros

### Frontend
- **SEMPRE** usar try/catch em chamadas assíncronas
- Exibir mensagens amigáveis ao usuário
- Fazer log de erros para debug
- Implementar retry logic para falhas de rede

**Exemplo:**
```tsx
async function fetchMedications() {
  try {
    const response = await api.get('/v1/medications');
    setMedications(response.data);
  } catch (error) {
    console.error('Erro ao buscar medicamentos:', error);
    showToast('Não foi possível carregar os medicamentos. Tente novamente.');
  }
}
```

### Backend
- Usar códigos HTTP apropriados (200, 201, 400, 401, 404, 500)
- Incluir mensagens descritivas de erro
- **NUNCA** expor detalhes internos ou stack traces em produção
- Fazer log de erros com níveis apropriados (error, warn, info)

## Segurança

### Dados Sensíveis
- **NUNCA** armazenar senhas em texto plano
- Usar bcrypt ou argon2 para hash de senhas
- Criptografar dados de saúde sensíveis
- Validar e sanitizar todas as entradas do usuário

### Autenticação
- Implementar rate limiting em rotas de autenticação
- Usar HTTPS para todas as comunicações
- Tokens JWT devem expirar (ex: 1 hora)
- Implementar refresh tokens com validade maior (ex: 7 dias)

### Variáveis de Ambiente
- **NUNCA** commitar arquivos `.env`
- Usar `EXPO_PUBLIC_` prefix para variáveis expostas ao cliente
- Variáveis backend devem ser secretas

## Acessibilidade

- Adicionar `accessibilityLabel` em componentes interativos
- Garantir contraste mínimo de 4.5:1 para texto
- Suportar navegação por teclado
- Testar com screen readers (TalkBack, VoiceOver)

**Exemplo:**
```tsx
<Pressable
  accessibilityLabel="Confirmar que tomou o medicamento Paracetamol"
  accessibilityRole="button"
  accessibilityHint="Toque duas vezes para confirmar"
  className="bg-green-500 p-4 rounded-lg"
>
  <Text className="text-white">Confirmar Dose</Text>
</Pressable>
```

## Performance

### Frontend
- Usar `React.memo()` para componentes que renderizam frequentemente
- Implementar lazy loading para telas/componentes pesados
- Otimizar imagens (usar formatos WebP quando possível)
- Usar `FlatList` ao invés de `ScrollView` para listas longas

### Backend
- Implementar paginação em listagens (padrão: 20 itens/página)
- Criar índices no MongoDB para queries frequentes
- Usar cache para dados que mudam pouco
- Implementar rate limiting

## Testes

### Frontend
- Testar componentes com React Testing Library
- Testar navegação entre telas
- Testar interação com notificações
- Mocks para chamadas de API

### Backend
- Testes unitários para lógica de negócio
- Testes de integração para rotas da API
- Testes de validação de dados
- Cobertura mínima: 70%

## Commits

Seguir o padrão **Conventional Commits**:

```
feat: adiciona tela de cadastro de medicamento
fix: corrige cálculo de taxa de adesão
docs: atualiza README com instruções de setup
refactor: reorganiza estrutura de pastas
test: adiciona testes para histórico de medicamentos
chore: atualiza dependências do projeto
```

## Identidade Visual

### Princípios de Design
- **Minimalista e "clean"**
- Foco nas tarefas essenciais
- Redução de carga cognitiva
- Simplicidade e clareza

### Cores (a serem definidas no tema)
- Priorizar alto contraste
- Usar cores significativas (ex: verde para "dose tomada", vermelho para "esquecida")

## Exemplos de Implementação

### Componente com gluestack-ui
```tsx
import { Button, ButtonText } from '@gluestack-ui/themed';

export function PrimaryButton({ onPress, children }) {
  return (
    <Button onPress={onPress} className="bg-blue-500">
      <ButtonText className="text-white font-semibold">
        {children}
      </ButtonText>
    </Button>
  );
}
```

### Chamada de API com Tratamento de Erro
```tsx
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function registerMedication(data: MedicationData) {
  try {
    const response = await api.post('/v1/medications', data);
    return { success: true, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erro desconhecido'
      };
    }
    throw error;
  }
}
```

### Navegação com Expo Router
```tsx
import { router } from 'expo-router';

// Navegação simples
router.push('/medication/new');

// Navegação com parâmetros
router.push({
  pathname: '/medication/[id]',
  params: { id: medicationId }
});

// Voltar
router.back();
```

## Notas Importantes

1. **Priorizar a experiência do usuário** - a funcionalidade principal é garantir que o usuário tome seus medicamentos
2. **Notificações são críticas** - devem ser confiáveis e pontuais
3. **Dados de saúde são sensíveis** - implementar segurança rigorosa
4. **Simplicidade é chave** - evitar features complexas que confundam o usuário
5. **Acessibilidade não é opcional** - garantir que todos possam usar o app

## Recursos de Referência

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [gluestack-ui Documentation](https://ui.gluestack.io/)

---

**Última atualização**: Fase 1 - 2025  
**Equipe**: Marjory Mel (PO + Frontend), Weslley da Silva (FullStack + CI/CD), Victor Gabriel Lucio (Backend), Diego Kiyoshi (Backend)

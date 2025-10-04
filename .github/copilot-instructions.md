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

### Estilização com NativeWind v4

- **SEMPRE** usar classes Tailwind via NativeWind
- **NÃO** usar StyleSheet.create() do React Native
- **NÃO** usar cores hard-coded (ex: `#05D3DB`, `#121417`)
- Usar a prop `className` para aplicar estilos
- Manter consistência com o design system minimalista
- Criar componentes reutilizáveis para padrões comuns
- **SEMPRE** usar classes de tema com modificador `dark:` para adaptação automática

**⚠️ IMPORTANTE - NativeWind v4 e React Native:**

- React Native **NÃO suporta variáveis CSS** (`var(--background)`)
- **SEMPRE** usar o modificador `dark:` para cada classe de cor
- Variáveis CSS só funcionam na web, no React Native use cores RGB diretas

**Exemplo:**

```tsx
// ✅ CORRETO - Usa classes com dark: (adapta automaticamente)
import { View, Text } from 'react-native';

export function MedicationCard() {
  return (
    <View className="bg-card dark:bg-card-dark border-border dark:border-border-dark rounded-lg border p-4">
      <Text className="text-foreground dark:text-foreground-dark text-lg font-semibold">
        Paracetamol 750mg
      </Text>
      <Text className="text-muted-foreground dark:text-muted-foreground-dark text-sm">
        750mg • 08:00
      </Text>
    </View>
  );
}

// ❌ ERRADO - Sem dark: não vai adaptar ao tema
<View className="bg-card border-border rounded-lg border p-4">
  <Text className="text-foreground">Paracetamol 750mg</Text>
</View>;

// ❌ EVITAR - Hard-coded colors e StyleSheet
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { backgroundColor: 'white', padding: 16 },
});

// ❌ EVITAR - Cores fixas que não adaptam ao tema
<View className="bg-white">
  <Text className="text-[#121417]">Texto</Text>
</View>;
```

### Sistema de Tema (CRÍTICO)

O MedTrack possui um **sistema de tema centralizado** que suporta **modo claro e escuro**. Todas as cores, fontes e estilos estão definidos em:

1. **`global.css`** - Variáveis CSS customizadas (`:root` e `.dark`) - **apenas para web**
2. **`tailwind.config.js`** - Cores RGB diretas com modificador `dark` para React Native
3. **`lib/theme.ts`** - Constantes exportadas (COLORS, FONTS, SPACING, RADIUS)

#### ⚠️ Regra Fundamental: SEMPRE use `dark:` no React Native

No React Native, você **DEVE** adicionar o modificador `dark:` para cada classe de cor:

```tsx
// ✅ CORRETO
<View className="bg-background dark:bg-background-dark">
  <Text className="text-foreground dark:text-foreground-dark">Texto</Text>
</View>

// ❌ ERRADO - Não vai mudar de tema
<View className="bg-background">
  <Text className="text-foreground">Texto</Text>
</View>
```

#### Classes Tailwind de Tema (Padrão MedTrack)

**Cores de Fundo:**

```tsx
// Fundo principal
<View className="bg-background dark:bg-background-dark">

// Cards
<View className="bg-card dark:bg-card-dark">

// Primary (cyan)
<View className="bg-primary dark:bg-primary-dark">

// Secondary (cinza)
<View className="bg-secondary dark:bg-secondary-dark">
```

**Cores de Texto:**

```tsx
// Texto principal
<Text className="text-foreground dark:text-foreground-dark">

// Texto secundário
<Text className="text-muted-foreground dark:text-muted-foreground-dark">

// Texto em cima do primary
<Text className="text-primary-foreground dark:text-primary-foreground-dark">

// Texto em cima do secondary
<Text className="text-secondary-foreground dark:text-secondary-foreground-dark">
```

**Borders:**

```tsx
<View className="border-border dark:border-border-dark border">
```

#### Para Elementos Não-Tailwind (ícones, ActivityIndicator)

Use o hook `useThemeColors()` para elementos que precisam de cores via props:

```tsx
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Bell } from 'lucide-react-native';

function MeuComponente() {
  const colors = useThemeColors();

  return (
    <View className="bg-background dark:bg-background-dark">
      <Bell size={24} color={colors.textPrimary} />
      <ActivityIndicator color={colors.primary} />
    </View>
  );
}
```

#### Paleta de Cores MedTrack

**Light Theme:**

- Primary: `#05D3DB` (Cyan)
- Background: `#FFFFFF`
- Foreground (texto): `#121417`
- Muted Foreground: `#637387`
- Secondary: `#F0F2F5`

**Dark Theme:**

- Primary: `#21ACB1` (Cyan escuro - mais suave que light)
- Background: `#121417` (preto azulado)
- Foreground (texto): `#FFFFFF`
- Muted Foreground: `#637387` (mesmo do light)
- Secondary: `#293038` (cinza escuro)

#### Fontes (Manrope)

```tsx
import { FONTS } from '@/lib/theme';

// Via style prop
<Text style={{ fontFamily: FONTS.bold }}>Texto Bold</Text>

// Via classes Tailwind
<Text className="font-manrope-regular">Regular</Text>
<Text className="font-manrope-medium">Medium</Text>
<Text className="font-manrope-bold">Bold</Text>
```

#### Espaçamentos e Tamanhos

```typescript
// Importar de lib/theme.ts
import { SPACING, RADIUS, FONT_SIZES } from '@/lib/theme';

SPACING.lg; // 16px (padrão MedTrack)
RADIUS.md; // 8px (padrão MedTrack)
FONT_SIZES.base; // 16px (texto padrão)
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
  ui/                   # Componentes reutilizáveis (button, icon, text, theme-toggle)
  medication-card.tsx   # Card de medicamento
  home-header.tsx       # Header da tela home
  theme-provider.tsx    # Provider do tema NativeWind
  theme-debug.tsx       # Componente de debug do tema (desenvolvimento)

hooks/
  use-today-medications.ts  # Hook para gerenciar medicamentos
  use-theme-colors.ts       # Hook para acessar cores do tema atual

utils/
  toast.ts              # Sistema de toast notifications

types/
  medication.ts         # Interfaces TypeScript

mocks/
  medication-data.ts    # Dados mockados
  medication-service-mock.ts  # Serviço mock da API
  utils.ts              # Utilitários de mock
  usage-examples.ts     # Exemplos de uso
  README.md             # Documentação do sistema de mocks

lib/
  theme.ts              # COLORS, FONTS, SPACING, RADIUS, NAV_THEME
  utils.ts              # Funções utilitárias

global.css              # Variáveis CSS do tema (light/dark)
tailwind.config.js      # Mapeamento de cores Tailwind
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
  className="rounded-lg bg-green-500 p-4">
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
- **Suporte completo a dark mode** - todos os componentes devem adaptar

### Sistema de Cores

- ✅ Cores definidas em `global.css` e `lib/theme.ts`
- ✅ Alto contraste garantido (4.5:1 mínimo)
- ✅ Cores significativas: Cyan para primário/confirmar, Cinza para secundário/adiar
- ✅ Dark mode com cores extraídas do Figma (#21ACB1 cyan dark, #293038 cards dark)
- ⚠️ **NUNCA** usar cores hard-coded - sempre usar classes de tema

## Exemplos de Implementação

### Componente com gluestack-ui

```tsx
import { Button, ButtonText } from '@gluestack-ui/themed';

export function PrimaryButton({ onPress, children }) {
  return (
    <Button onPress={onPress} className="bg-blue-500">
      <ButtonText className="font-semibold text-white">{children}</ButtonText>
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
        error: error.response?.data?.error || 'Erro desconhecido',
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
  params: { id: medicationId },
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

### Documentação Externa

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [NativeWind Documentation](https://www.nativewind.dev/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [gluestack-ui Documentation](https://ui.gluestack.io/)
- [Lucide Icons](https://lucide.dev/) - Ícones usados no projeto

### Checklist Antes de Criar Componentes

- [ ] Vou usar classes Tailwind de tema com modificador `dark:` (`bg-background dark:bg-background-dark`, `text-foreground dark:text-foreground-dark`, etc.)
- [ ] **NÃO** vou usar cores hard-coded (`#05D3DB`, `#FFFFFF`)
- [ ] **NÃO** vou esquecer o modificador `dark:` nas classes de cor
- [ ] Vou usar `useThemeColors()` para ícones e elementos nativos (ActivityIndicator, etc)
- [ ] Vou importar constantes de `@/lib/theme` quando necessário
- [ ] Vou testar o componente em ambos os temas (light e dark)

### Documentação do Sistema de Tema

- **`docs/USO_TEMA_NATIVEWIND.md`** - Guia completo de como usar classes dark:
- **`docs/SOLUCAO_TEMA_NATIVEWIND.md`** - Solução técnica implementada
- **`docs/BOAS_PRATICAS_TEMA.md`** - Boas práticas e quando usar useThemeColors()
- **`docs/TROUBLESHOOTING_TEMA.md`** - Resolução de problemas comuns

---

**Última atualização**: 04/10/2025  
**Versão**: 4.0 - NativeWind v4 com suporte correto a dark mode usando modificador `dark:`  
**Equipe**: Marjory Mel (PO + Frontend), Weslley da Silva (FullStack + CI/CD), Victor Gabriel Lucio (Backend), Diego Kiyoshi (Backend)

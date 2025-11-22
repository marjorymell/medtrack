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
- **Gerenciamento de Estado**: TanStack Query (React Query) + Context API
- **Notificações**: Expo Push Notifications (parcialmente implementado)
- **Formulários**: React Hook Form + Zod validation

### Backend

- **Runtime**: Node.js
- **Linguagem**: TypeScript
- **API**: RESTful com Express.js
- **ORM**: Prisma Client
- **Autenticação**: JWT (JSON Web Token)
- **Banco de Dados**: MongoDB (NoSQL)
- **Validação**: Zod schemas
- **Documentação**: OpenAPI/Swagger
- **Testes**: Jest (estrutura preparada)

## Arquitetura do Projeto

### Frontend (Aplicativo Mobile)

1. **Camada de Apresentação (UI)**
   - Componentes construídos com gluestack-ui e shadcn/ui
   - Estilização com classes Tailwind CSS via NativeWind
2. **Gerenciamento de Estado**
   - TanStack Query para cache e sincronização de dados
   - Context API para autenticação e estado global
   - Hooks customizados para lógica de negócio
3. **Camada de Serviços**
   - Comunicação HTTP com backend (fetch API)
   - Registro de dispositivos para notificações
   - Manipulação de notificações recebidas

### Backend (Servidor da Aplicação)

1. **Controllers**: Recebem requisições HTTP, validam dados e direcionam para serviços
2. **Camada de Serviço**: Lógica de negócio (cadastro, verificação de estoque, agendamento)
3. **Camada de Dados**: Prisma Client para acesso ao MongoDB

## Status Atual do Projeto (Dezembro 2025)

### ✅ COMPLETAMENTE IMPLEMENTADO

**Estrutura Base:**

- Projeto React Native + Expo configurado e funcional
- TypeScript configurado em frontend e backend
- NativeWind v4 com sistema de tema dark/light
- Estrutura de pastas organizada e padronizada

**Autenticação:**

- Sistema completo de login/registro com JWT
- Context API para gerenciamento de estado de autenticação
- Persistência de token e dados do usuário
- Middleware de autenticação no backend

**Navegação:**

- Expo Router configurado com navegação baseada em arquivos
- Layout com tabs (Home, Histórico, Estoque, Perfil)
- Navegação entre telas implementada

**Tela Home (Dashboard):**

- Lista de medicamentos programados para hoje
- Cards com informações completas (nome, dosagem, horário)
- Botões de ação: Confirmar e Adiar
- Estatísticas do dia (tomados, pendentes, aderência)
- Pull-to-refresh implementado
- Estados de loading e erro tratados

**Tela de Histórico:**

- Calendário interativo para navegação por datas
- Timeline com detalhes das ações do dia
- Métricas de adesão (tomados vs esquecidos)
- Filtros por data implementados
- Interface responsiva e intuitiva

**Tela de Estoque:**

- Lista completa de medicamentos cadastrados
- Modal para atualização de estoque
- CRUD básico implementado (listar, atualizar estoque)
- Informações detalhadas (validade, frequência, observações)

**Tela de Perfil:**

- Informações do usuário (avatar, nome, email)
- Toggle de tema dark/light
- Menu de configurações básicas
- Logout funcional

**Backend API:**

- Servidor Express.js com TypeScript
- Prisma ORM configurado com MongoDB
- Autenticação JWT implementada (refatorada - sem AuthService)
- Validação com Zod schemas
- **Documentação OpenAPI/Swagger (100% completa - 37/37 rotas)**
- Estrutura modular (medications, history, users, notifications, schedules)
- **60 testes automatizados passando (100% de sucesso)**
- Middlewares otimizados (auth, validation, rate-limiting)

**Banco de Dados:**

- Schema Prisma completo definido
- Relacionamentos entre entidades
- Índices otimizados
- Migrações preparadas

**Sistema de Tema:**

- NativeWind v4 completamente configurado
- Cores definidas para light e dark themes
- Modificador `dark:` usado corretamente
- Hook `useThemeColors()` para elementos não-Tailwind
- Paleta de cores consistente (Cyan #05D3DB/#21ACB1)

**Histórico e Controle de Estoque:**

- API completa para registro de ações (tomado, adiado, pulado)
- Decremento automático de estoque ao confirmar dose
- Histórico detalhado com timestamps
- Cálculo de taxa de adesão

**Notificações (Estrutura):**

- Hooks para permissões de notificação
- Serviços para agendamento local
- Estrutura preparada para push notifications
- Configurações de horário de silêncio
- **Backend endpoints completamente documentados (5 rotas Swagger)**

**Utilitários e Qualidade:**

- Sistema de toast notifications
- Tratamento de erros consistente
- Mocks para desenvolvimento
- Tipos TypeScript bem definidos
- ESLint/Prettier configurados
- **60 testes Jest no backend (100% passando)**
- **Documentação Swagger 100% completa**

**Arquitetura Backend Refatorada (Nov 2025):**

- Autenticação consolidada (jwt.ts + user.service.ts)
- Middleware genérico de validação Zod
- Estrutura de pastas otimizada (sem duplicatas)
- Rate limiting implementado (auth: 5/15min, api: 100/15min)
- Todos os endpoints documentados com OpenAPI 3.0

### 🚧 PARCIALMENTE IMPLEMENTADO

**Notificações Push:**

- Hooks e serviços criados
- Estrutura de agendamento preparada
- Backend endpoints para tokens de dispositivo
- Integração frontend/backend pendente

**CRUD de Medicamentos:**

- API backend completa
- Tela de estoque com listagem
- Modal de atualização de estoque
- Telas de adicionar/editar medicamentos não implementadas

**Configurações Avançadas:**

- Estrutura de configurações de notificação criada
- Tela de edição de perfil não implementada
- Preferências de usuário básicas funcionais

### ❌ AINDA NÃO IMPLEMENTADO

**Funcionalidades Essenciais:**

- Tela de adicionar novo medicamento
- Tela de editar medicamento existente
- Tela de configurações de notificações
- Tela de edição de perfil do usuário
- Sistema de notificações push completamente funcional

**Qualidade e Testes:**

- **✅ 60 testes Jest no backend (100% passando)**
- Estrutura de testes configurada (Jest + Supertest)
- Testes de integração para todas as rotas da API
- **Cobertura completa:** medications, users, schedules, notifications, history
- Testes automatizados frontend pendentes (unitários, integração)
- Testes E2E com dispositivos pendentes
- Linting e formatação automatizados

**Produção e Deploy:**

- Configuração de CI/CD
- Build otimizado para produção
- Variáveis de ambiente para diferentes ambientes
- Monitoramento e logging em produção

**Recursos Avançados:**

- Modo offline com sincronização
- Backup e recuperação de dados
- Suporte multilíngue (i18n)
- Analytics e métricas de uso
- Acessibilidade avançada (VoiceOver, TalkBack)
- Performance optimization (memoização, lazy loading)

**Segurança:**

- **✅ Rate limiting implementado** (auth: 5/15min, api: 100/15min)
- **✅ Autenticação JWT com expiração configurável**
- **✅ Senha hasheada com bcrypt**
- Refresh tokens pendentes
- Encriptação de dados sensíveis pendente
- Auditoria de segurança pendente
- Conformidade com LGPD/GDPR pendente

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
  add-medication.tsx    # ❌ PENDENTE - Tela de adicionar medicamento
  auth-screen.tsx       # Tela de login/registro
  index.tsx             # Tela de Login
  reminder-notification.tsx # Preview de notificação
  edit-profile.tsx      # ❌ PENDENTE - Tela de editar perfil
  notification-settings.tsx # ❌ PENDENTE - Configurações de notificação
  (tabs)/               # Grupo de rotas em tabs
    _layout.tsx         # Layout das tabs
    index.tsx           # Dashboard/Home ✅ IMPLEMENTADO
    history.tsx         # Histórico de medicamentos ✅ IMPLEMENTADO
    profile.tsx         # Perfil do usuário ✅ IMPLEMENTADO
    stock.tsx           # Controle de estoque ✅ IMPLEMENTADO

components/
  ui/                   # Componentes reutilizáveis (button, icon, text, theme-toggle)
  auth-guard.tsx        # Guarda de autenticação
  home-header.tsx       # Header da tela home
  medication-card.tsx   # Card de medicamento
  notification-settings.tsx # Componentes de configuração
  notification-toggle.tsx
  quiet-hours-picker.tsx
  theme-provider.tsx    # Provider do tema NativeWind
  theme-debug.tsx       # Componente de debug do tema (desenvolvimento)

hooks/
  use-today-medications.ts  # Hook para gerenciar medicamentos
  use-theme-colors.ts       # Hook para acessar cores do tema atual
  use-authenticated-services.ts
  use-create-medication.ts
  use-device-token.ts
  use-notification-handler.ts
  use-notification-permissions.ts
  use-notification-scheduler.ts
  use-stock.ts
  use-user.ts

utils/
  notification-utils.ts
  toast.ts              # Sistema de toast notifications

types/
  medication.ts         # Interfaces TypeScript
  notification.ts

mocks/
  medication-data.ts    # Dados mockados
  medication-service-mock.ts  # Serviço mock da API
  utils.ts              # Utilitários de mock
  usage-examples.ts     # Exemplos de uso
  README.md             # Documentação do sistema de mocks

lib/
  theme.ts              # COLORS, FONTS, SPACING, RADIUS, NAV_THEME
  utils.ts              # Funções utilitárias
  services/
    medication-service.ts # API de medicamentos
    api-service.ts      # Base para chamadas HTTP

backend/
  prisma/
    schema.prisma       # Schema do banco de dados ✅ IMPLEMENTADO
  src/
    app.ts              # Configuração Express
    server.ts           # Inicialização do servidor
    routes.ts           # Definição de rotas
    modules/
      medications/      # CRUD de medicamentos ✅ IMPLEMENTADO
      history/          # Histórico e controle de estoque ✅ IMPLEMENTADO
      users/            # Autenticação e usuários ✅ IMPLEMENTADO
      notifications/    # Sistema de notificações ✅ DOCUMENTADO
      schedules/        # Agendamento de medicamentos ✅ IMPLEMENTADO
    shared/
      config/           # Configurações globais
      lib/              # Utilitários
      middlewares/      # Middlewares Express (auth, validate, rate-limit)
      utils/            # Funções utilitárias (jwt, logger)
    swagger/            # Documentação OpenAPI
    @types/             # Definições de tipos

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

- `POST /api/medications` - Criar medicamento
- `GET /api/medications` - Listar medicamentos do usuário
- `GET /api/medications/today` - Medicamentos programados para hoje
- `GET /api/medications/stock/low` - Medicamentos com estoque baixo
- `GET /api/medications/stock/out` - Medicamentos sem estoque
- `GET /api/medications/:id` - Buscar medicamento específico
- `PUT /api/medications/:id` - Atualizar medicamento
- `PUT /api/medications/:id/stock` - Atualizar apenas estoque
- `DELETE /api/medications/:id` - Deletar medicamento

**Usuários e Autenticação**

- `POST /api/users/register` - Registrar novo usuário
- `POST /api/users/login` - Fazer login
- `GET /api/users/me` - Dados do usuário autenticado
- `GET /api/users` - Listar usuários
- `GET /api/users/:id` - Buscar usuário por ID
- `PUT /api/users/:id` - Atualizar usuário
- `DELETE /api/users/:id` - Deletar usuário

**Histórico**

- `POST /api/history` - Registrar dose tomada
- `GET /api/history/me` - Histórico do usuário autenticado
- `GET /api/history/medication/:medicationId` - Histórico por medicamento
- `GET /api/history/medication/:medicationId/adherence` - Taxa de adesão
- `GET /api/history/:id` - Buscar registro específico
- `DELETE /api/history/:id` - Deletar registro

**Notificações**

- `POST /api/notifications/register-device` - Registrar token do dispositivo
- `POST /api/notifications/schedule` - Agendar notificação
- `DELETE /api/notifications/cancel/:id` - Cancelar notificação
- `GET /api/notifications/settings` - Buscar configurações
- `PUT /api/notifications/settings` - Atualizar configurações

**Agendamentos**

- `GET /api/schedules/medication/:medicationId` - Agendamentos do medicamento
- `GET /api/schedules/user/:userId` - Agendamentos do usuário
- `POST /api/schedules` - Criar agendamento customizado
- `GET /api/schedules/:id` - Buscar agendamento
- `PATCH /api/schedules/:id` - Atualizar agendamento
- `PATCH /api/schedules/:id/toggle` - Ativar/desativar agendamento
- `DELETE /api/schedules/:id` - Deletar agendamento

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

## Próximas Prioridades de Desenvolvimento

### 🔥 ALTA PRIORIDADE (MVP Completo)

1. **Tela de Adicionar Medicamento** - Interface para cadastro de novos medicamentos
2. **Tela de Editar Medicamento** - Modificação de medicamentos existentes
3. **Sistema de Notificações Push Completo** - Integração frontend/backend
4. **Tela de Configurações de Notificação** - Gerenciamento de lembretes
5. **Tela de Editar Perfil** - Atualização de dados do usuário

### 🟡 MÉDIA PRIORIDADE (Pós-MVP)

6. **Testes Automatizados** - Cobertura mínima de 70% em frontend e backend
7. **Deploy e CI/CD** - Configuração para produção
8. **Modo Offline** - Funcionalidade sem conexão
9. **Analytics** - Métricas de uso e adesão
10. **Suporte Multilíngue** - Internacionalização

### 🟢 BAIXA PRIORIDADE (Features Avançadas)

11. **Acessibilidade Avançada** - Suporte completo a screen readers
12. **Performance Optimization** - Otimizações de renderização
13. **Backup e Recuperação** - Sincronização de dados
14. **Rate Limiting** - Proteção contra abuso da API
15. **Monitoramento** - Logs e alertas em produção

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

### Documentação da API Backend

- **Swagger UI:** `http://localhost:3000/api-docs` - Interface interativa completa
- **37 rotas documentadas** com OpenAPI 3.0
- **5 módulos** com 100% de cobertura Swagger
- **Documentação inclui:** schemas, exemplos, códigos de erro, autenticação
- **Como usar:** Todos os endpoints têm exemplos de request/response prontos para teste

---

**Última atualização**: 22/11/2025  
**Versão**: 5.0 - Backend 100% documentado e testado + Arquitetura refatorada  
**Status do Projeto**: Backend completo com 37 rotas documentadas e 60 testes passando  
**Equipe**: Marjory Mel (PO + Frontend), Weslley da Silva (FullStack + CI/CD), Victor Gabriel Lucio (Backend), Diego Kiyoshi (Backend)

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

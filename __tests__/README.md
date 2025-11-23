# 🧪 Testes Frontend - MedTrack

Bem-vindo ao diretório de testes do MedTrack! Este README fornece uma visão rápida de como trabalhar com os testes do projeto.

## 🚀 Quick Start

```bash
# Instalar dependências
npm install

# Executar todos os testes
npm test

# Executar em modo watch (recomendado durante desenvolvimento)
npm run test:watch

# Executar com cobertura de código
npm run test:coverage
```

## 📁 Estrutura

```
__tests__/
├── hooks/           # Testes de hooks customizados
├── components/      # Testes de componentes React Native
│   └── ui/          # Componentes de UI base
├── screens/         # Testes de telas/páginas
├── services/        # Testes de serviços e APIs
└── utils/           # Testes de funções utilitárias
```

## 📝 Como Criar um Novo Teste

### 1. Escolha a pasta correta

- **Hook customizado** → `hooks/`
- **Componente** → `components/` ou `components/ui/`
- **Tela/página** → `screens/`
- **Serviço/API** → `services/`
- **Função auxiliar** → `utils/`

### 2. Crie o arquivo com nomenclatura correta

```bash
# Padrão: nome-do-arquivo.test.tsx (ou .ts)
use-my-hook.test.tsx
my-component.test.tsx
my-service.test.ts
```

### 3. Use o template básico

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { MyComponent } from '@/components/my-component';

describe('MyComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar corretamente', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('Expected Text')).toBeTruthy();
  });
});
```

### 4. Execute o teste

```bash
# Modo watch para ver resultados em tempo real
npm run test:watch -- my-component.test.tsx
```

## 🎯 Exemplos por Tipo

### Hook Customizado

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useMyHook', () => {
  it('deve retornar dados corretos', async () => {
    const { result } = renderHook(() => useMyHook(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.data).toBeDefined();
  });
});
```

### Componente

```typescript
import { render, fireEvent } from '@testing-library/react-native';

describe('MyButton', () => {
  it('deve chamar onPress ao clicar', () => {
    const mockOnPress = jest.fn();
    const { getByRole } = render(
      <MyButton onPress={mockOnPress}>Click Me</MyButton>
    );

    fireEvent.press(getByRole('button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
});
```

### Serviço

```typescript
import { myService } from '@/services/my-service';

global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('MyService', () => {
  it('deve fazer requisição com sucesso', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'success' }),
    } as Response);

    const result = await myService.getData();
    expect(result.data).toBe('success');
  });
});
```

## ✅ Checklist Antes de Fazer Commit

- [ ] Todos os testes passam (`npm test`)
- [ ] Cobertura não diminuiu (`npm run test:coverage`)
- [ ] Novos testes seguem os padrões do projeto
- [ ] Mocks limpos entre testes (`beforeEach`)
- [ ] Nomes descritivos e claros
- [ ] Acessibilidade testada (quando aplicável)

## 🔍 Comandos Úteis

```bash
# Executar apenas hooks
npm run test:hooks

# Executar apenas components
npm run test:components

# Executar teste específico
npm test -- use-medications.test.tsx

# Executar testes que contenham "login"
npm test -- -t login

# Atualizar snapshots
npm test -- -u

# Ver apenas testes que falharam
npm test -- --onlyFailures

# Executar em modo watch para um arquivo
npm run test:watch -- my-file.test.tsx
```

## 📊 Cobertura de Código

Visualize a cobertura de código executando:

```bash
npm run test:coverage
```

Depois abra o relatório HTML:
- Windows: `start coverage/lcov-report/index.html`
- Mac: `open coverage/lcov-report/index.html`
- Linux: `xdg-open coverage/lcov-report/index.html`

**Meta de Cobertura**: 70% (linhas, statements, functions, branches)

## 📚 Documentação Completa

Para guia detalhado, padrões e troubleshooting, consulte:

- **[FRONTEND_TESTING.md](../docs/FRONTEND_TESTING.md)** - Guia completo de testes
- **[FRONTEND_TESTING_SUMMARY.md](../docs/FRONTEND_TESTING_SUMMARY.md)** - Resumo da implementação

## 🐛 Problemas Comuns

### "Cannot find module '@/...'"

Verifique se o `jest.config.js` tem:
```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/$1',
}
```

### "Timeout - Async callback was not invoked"

```typescript
jest.setTimeout(15000); // Aumentar timeout
// ou
it('teste lento', async () => { ... }, 15000);
```

### "act() warning"

Use `waitFor` para updates de estado:
```typescript
await waitFor(() => {
  expect(result.current.data).toBeDefined();
});
```

## 🆘 Precisa de Ajuda?

1. Consulte os testes existentes como exemplo
2. Leia a [documentação completa](../docs/FRONTEND_TESTING.md)
3. Peça ajuda ao time no Slack/Discord

---

**Happy Testing! 🧪✨**

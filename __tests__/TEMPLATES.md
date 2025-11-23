# 📝 Templates de Testes - MedTrack

Este arquivo contém templates prontos para uso ao criar novos testes no projeto MedTrack.

## 📋 Índice

1. [Hook com React Query](#hook-com-react-query)
2. [Hook Simples](#hook-simples)
3. [Componente React Native](#componente-react-native)
4. [Serviço com Fetch](#serviço-com-fetch)
5. [Tela/Screen](#telascreen)
6. [Função Utilitária](#função-utilitária)

---

## Hook com React Query

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useMyHook } from '@/hooks/use-my-hook';
import * as myService from '@/services/my-service';
import { showToast } from '@/utils/toast';

// Mock do serviço
jest.mock('@/services/my-service');

// Mock do toast
jest.mock('@/utils/toast', () => ({
  showToast: jest.fn(),
}));

// Mock do auth context (se necessário)
jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    token: 'mock-token',
    user: { id: 'user-1', name: 'Test User' },
  }),
}));

// Helper para criar wrapper do QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useMyHook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Query - Buscar dados', () => {
    it('deve carregar dados com sucesso', async () => {
      (myService.getData as jest.Mock).mockResolvedValue({
        success: true,
        data: [{ id: '1', name: 'Item 1' }],
      });

      const { result } = renderHook(() => useMyHook(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.data).toBeDefined();
      expect(result.current.error).toBeNull();
    });

    it('deve tratar erro ao carregar dados', async () => {
      (myService.getData as jest.Mock).mockRejectedValue(
        new Error('Erro ao carregar')
      );

      const { result } = renderHook(() => useMyHook(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('Mutation - Criar item', () => {
    it('deve criar item com sucesso', async () => {
      (myService.createItem as jest.Mock).mockResolvedValue({
        success: true,
        data: { id: '2', name: 'New Item' },
      });

      const { result } = renderHook(() => useMyHook(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => expect(result.current.isLoading).toBe(false));

      await result.current.createItem({ name: 'New Item' });

      expect(myService.createItem).toHaveBeenCalledWith({ name: 'New Item' });
      expect(showToast).toHaveBeenCalledWith(
        expect.stringContaining('sucesso'),
        'success'
      );
    });
  });
});
```

---

## Hook Simples

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { useMySimpleHook } from '@/hooks/use-my-simple-hook';

describe('useMySimpleHook', () => {
  it('deve retornar estado inicial correto', () => {
    const { result } = renderHook(() => useMySimpleHook());

    expect(result.current.value).toBe(0);
    expect(result.current.isActive).toBe(false);
  });

  it('deve atualizar estado ao chamar função', () => {
    const { result } = renderHook(() => useMySimpleHook());

    act(() => {
      result.current.increment();
    });

    expect(result.current.value).toBe(1);
  });

  it('deve resetar estado', () => {
    const { result } = renderHook(() => useMySimpleHook());

    act(() => {
      result.current.increment();
      result.current.reset();
    });

    expect(result.current.value).toBe(0);
  });
});
```

---

## Componente React Native

```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MyComponent } from '@/components/my-component';

// Mock de hooks/contextos
jest.mock('@/hooks/use-theme-colors', () => ({
  useThemeColors: () => ({
    primary: '#05D3DB',
    textPrimary: '#121417',
  }),
}));

describe('MyComponent', () => {
  const defaultProps = {
    title: 'Test Title',
    onPress: jest.fn(),
    isActive: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar com props básicas', () => {
      const { getByText } = render(<MyComponent {...defaultProps} />);

      expect(getByText('Test Title')).toBeTruthy();
    });

    it('deve renderizar estado ativo corretamente', () => {
      const { getByText } = render(
        <MyComponent {...defaultProps} isActive={true} />
      );

      expect(getByText('Ativo')).toBeTruthy();
    });

    it('não deve renderizar quando hidden', () => {
      const { queryByText } = render(
        <MyComponent {...defaultProps} hidden={true} />
      );

      expect(queryByText('Test Title')).toBeNull();
    });
  });

  describe('Interações', () => {
    it('deve chamar onPress ao clicar', () => {
      const { getByRole } = render(<MyComponent {...defaultProps} />);

      fireEvent.press(getByRole('button'));

      expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
    });

    it('não deve chamar onPress quando disabled', () => {
      const { getByRole } = render(
        <MyComponent {...defaultProps} disabled={true} />
      );

      fireEvent.press(getByRole('button'));

      expect(defaultProps.onPress).not.toHaveBeenCalled();
    });
  });

  describe('Acessibilidade', () => {
    it('deve ter label acessível', () => {
      const { getByLabelText } = render(<MyComponent {...defaultProps} />);

      expect(getByLabelText('Test Title')).toBeTruthy();
    });

    it('deve ter role correto', () => {
      const { getByRole } = render(<MyComponent {...defaultProps} />);

      expect(getByRole('button')).toBeTruthy();
    });
  });
});
```

---

## Serviço com Fetch

```typescript
import { myService } from '@/services/my-service';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

// Mock do fetch global
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('MyService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  describe('getData', () => {
    it('deve buscar dados com sucesso', async () => {
      const mockData = { id: '1', name: 'Item 1' };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: mockData }),
      } as Response);

      const result = await myService.getData();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/data'),
        expect.objectContaining({ method: 'GET' })
      );
    });

    it('deve incluir token de autenticação quando disponível', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('mock-token');

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      } as Response);

      await myService.getData();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer mock-token',
          }),
        })
      );
    });

    it('deve tratar erro HTTP 404', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Não encontrado' }),
      } as Response);

      await expect(myService.getData()).rejects.toThrow('Não encontrado');
    });

    it('deve tratar erro de rede', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(myService.getData()).rejects.toThrow('Network error');
    });
  });

  describe('createData', () => {
    it('deve criar dados com sucesso', async () => {
      const newData = { name: 'New Item' };
      const createdData = { id: '2', ...newData };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, data: createdData }),
      } as Response);

      const result = await myService.createData(newData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/data'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(newData),
        })
      );
    });
  });
});
```

---

## Tela/Screen

```typescript
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { MyScreen } from '@/app/my-screen';
import { router } from 'expo-router';

// Mock do router
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

// Mock de hooks
jest.mock('@/hooks/use-my-data', () => ({
  useMyData: () => ({
    data: [{ id: '1', name: 'Item 1' }],
    isLoading: false,
    error: null,
    refetch: jest.fn(),
  }),
}));

jest.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    user: { id: '1', name: 'Test User' },
    isAuthenticated: true,
  }),
}));

describe('MyScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Renderização', () => {
    it('deve renderizar título da tela', () => {
      const { getByText } = render(<MyScreen />);

      expect(getByText('My Screen Title')).toBeTruthy();
    });

    it('deve renderizar lista de itens', () => {
      const { getByText } = render(<MyScreen />);

      expect(getByText('Item 1')).toBeTruthy();
    });

    it('deve exibir loading quando isLoading é true', () => {
      jest.mock('@/hooks/use-my-data', () => ({
        useMyData: () => ({
          data: [],
          isLoading: true,
          error: null,
        }),
      }));

      const { getByTestId } = render(<MyScreen />);

      expect(getByTestId('loading-indicator')).toBeTruthy();
    });
  });

  describe('Navegação', () => {
    it('deve navegar ao clicar em item', () => {
      const { getByText } = render(<MyScreen />);

      fireEvent.press(getByText('Item 1'));

      expect(router.push).toHaveBeenCalledWith({
        pathname: '/item/[id]',
        params: { id: '1' },
      });
    });

    it('deve voltar ao clicar em botão voltar', () => {
      const { getByLabelText } = render(<MyScreen />);

      fireEvent.press(getByLabelText('Voltar'));

      expect(router.back).toHaveBeenCalled();
    });
  });

  describe('Pull to refresh', () => {
    it('deve refetch ao fazer pull to refresh', async () => {
      const mockRefetch = jest.fn();
      jest.mock('@/hooks/use-my-data', () => ({
        useMyData: () => ({
          data: [],
          isLoading: false,
          refetch: mockRefetch,
        }),
      }));

      const { getByTestId } = render(<MyScreen />);

      const scrollView = getByTestId('scroll-view');
      fireEvent(scrollView, 'refresh');

      await waitFor(() => {
        expect(mockRefetch).toHaveBeenCalled();
      });
    });
  });
});
```

---

## Função Utilitária

```typescript
import { formatDate, calculateAge, validateEmail } from '@/utils/my-utils';

describe('My Utils', () => {
  describe('formatDate', () => {
    it('deve formatar data corretamente', () => {
      const date = new Date('2025-01-15T10:30:00Z');
      const formatted = formatDate(date);

      expect(formatted).toBe('15/01/2025');
    });

    it('deve tratar data inválida', () => {
      const formatted = formatDate(null as any);

      expect(formatted).toBe('Data inválida');
    });
  });

  describe('calculateAge', () => {
    it('deve calcular idade corretamente', () => {
      const birthDate = new Date('2000-01-01');
      const age = calculateAge(birthDate);

      expect(age).toBeGreaterThanOrEqual(24);
    });

    it('deve retornar 0 para data futura', () => {
      const futureDate = new Date('2030-01-01');
      const age = calculateAge(futureDate);

      expect(age).toBe(0);
    });
  });

  describe('validateEmail', () => {
    it('deve validar email correto', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('deve invalidar email incorreto', () => {
      expect(validateEmail('invalid')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });
});
```

---

## 💡 Dicas de Uso

1. **Copie o template apropriado** para o seu caso de uso
2. **Renomeie** imports, componentes e funções
3. **Ajuste os mocks** conforme suas dependências
4. **Adicione casos de teste** específicos do seu código
5. **Execute** e ajuste conforme necessário

## 📚 Referências

- [Documentação completa](./docs/FRONTEND_TESTING.md)
- [Testes existentes](./__tests__/)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)

---

**Última atualização**: 22/11/2025

import { renderHook, waitFor, act } from '@testing-library/react-native';import { renderHook, waitFor } from '@testing-library/react-native';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import React from 'react';import React from 'react';

import { useAuthMutations } from '@/hooks/use-auth-mutations';import { useAuthMutations } from '@/hooks/use-auth-mutations';

import { authService } from '@/services/auth-service';import { authService } from '@/services/auth-service';

import { showToast } from '@/utils/toast';import { showToast } from '@/utils/toast';



// Mock do auth service// Mock do auth service

jest.mock('@/services/auth-service');jest.mock('@/services/auth-service');



// Mock do toast// Mock do toast

jest.mock('@/utils/toast', () => ({jest.mock('@/utils/toast', () => ({

  showToast: jest.fn(),  showToast: jest.fn(),

}));}));



// Helper para criar wrapper do QueryClient// Mock do router

const createWrapper = () => {const mockPush = jest.fn();

  const queryClient = new QueryClient({const mockReplace = jest.fn();

    defaultOptions: {jest.mock('expo-router', () => ({

      queries: { retry: false },  router: {

      mutations: { retry: false },    push: mockPush,

    },    replace: mockReplace,

  });  },

}));

  const Wrapper = ({ children }: { children: React.ReactNode }) => (

    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>// Mock do contexto de autenticação

  );const mockSetUser = jest.fn();

const mockSetToken = jest.fn();

  return Wrapper;jest.mock('@/contexts/auth-context', () => ({

};  useAuth: () => ({

    setUser: mockSetUser,

describe('useAuthMutations', () => {    setToken: mockSetToken,

  beforeEach(() => {    logout: jest.fn(),

    jest.clearAllMocks();  }),

  });}));



  describe('Login', () => {// Helper para criar wrapper do QueryClient

    it('deve fazer login com sucesso', async () => {const createWrapper = () => {

      const mockResponse = {  const queryClient = new QueryClient({

        user: { id: '1', name: 'Test User', email: 'test@example.com', createdAt: '', updatedAt: '' },    defaultOptions: {

        token: 'mock-token',      queries: { retry: false },

      };      mutations: { retry: false },

    },

      (authService.login as jest.Mock).mockResolvedValue(mockResponse);  });



      const { result } = renderHook(() => useAuthMutations(), {  const Wrapper = ({ children }: { children: React.ReactNode }) => (

        wrapper: createWrapper(),    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>

      });  );



      await act(async () => {  return Wrapper;

        await result.current.login({ email: 'test@example.com', password: '123456' });};

      });

describe('useAuthMutations', () => {

      expect(authService.login).toHaveBeenCalledWith({  beforeEach(() => {

        email: 'test@example.com',    jest.clearAllMocks();

        password: '123456',  });

      });

      expect(showToast).toHaveBeenCalledWith('Login realizado com sucesso!', 'success');  describe('Login', () => {

    });    it('deve fazer login com sucesso', async () => {

      const mockResponse = {

    it('deve tratar erro de login', async () => {        user: { id: '1', name: 'Test User', email: 'test@example.com', createdAt: '', updatedAt: '' },

      const error = new Error('Credenciais inválidas');        token: 'mock-token',

      (authService.login as jest.Mock).mockRejectedValue(error);      };



      const { result } = renderHook(() => useAuthMutations(), {      (authService.login as jest.Mock).mockResolvedValue(mockResponse);

        wrapper: createWrapper(),

      });      const { result } = renderHook(() => useAuthMutations(), {

        wrapper: createWrapper(),

      await expect(      });

        act(async () => {

          await result.current.login({ email: 'test@example.com', password: 'wrong' });      await result.current.login({ email: 'test@example.com', password: '123456' });

        })

      ).rejects.toThrow('Credenciais inválidas');      await waitFor(() => {

        expect(authService.login).toHaveBeenCalledWith({

      await waitFor(() => {          email: 'test@example.com',

        expect(showToast).toHaveBeenCalledWith('Credenciais inválidas', 'error');          password: '123456',

      });        });

    });        expect(mockSetUser).toHaveBeenCalledWith(mockResponse.user);

        expect(mockSetToken).toHaveBeenCalledWith(mockResponse.token);

    it('deve ter estado de loading durante login', async () => {        expect(showToast).toHaveBeenCalledWith('Login realizado com sucesso!', 'success');

      const mockResponse = {      });

        user: { id: '1', name: 'Test User', email: 'test@example.com', createdAt: '', updatedAt: '' },    });

        token: 'mock-token',

      };    it('deve tratar erro de login', async () => {

      (authService.login as jest.Mock).mockRejectedValue(new Error('Credenciais inválidas'));

      (authService.login as jest.Mock).mockImplementation(

        () =>      const { result } = renderHook(() => useAuthMutations(), {

          new Promise((resolve) =>        wrapper: createWrapper(),

            setTimeout(() => resolve(mockResponse), 100)      });

          )

      );      await expect(

        result.current.login({ email: 'test@example.com', password: 'wrong' })

      const { result } = renderHook(() => useAuthMutations(), {      ).rejects.toThrow();

        wrapper: createWrapper(),

      });      await waitFor(() => {

        expect(showToast).toHaveBeenCalledWith(

      expect(result.current.isLoggingIn).toBe(false);          expect.stringContaining('Erro ao fazer login'),

          'error'

      const loginPromise = act(async () => {        );

        await result.current.login({ email: 'test@example.com', password: '123456' });      });

      });    });

  });

      // Durante o login, o estado deve ser true

      await waitFor(() => {  describe('Registro', () => {

        expect(result.current.isLoggingIn).toBe(true);    it('deve registrar usuário com sucesso', async () => {

      });      const mockResponse = {

        user: { id: '1', name: 'New User', email: 'new@example.com', createdAt: '', updatedAt: '' },

      await loginPromise;        token: 'mock-token',

      };

      // Após o login, deve voltar a false

      await waitFor(() => {      (authService.register as jest.Mock).mockResolvedValue(mockResponse);

        expect(result.current.isLoggingIn).toBe(false);

      });      const { result } = renderHook(() => useAuthMutations(), {

    });        wrapper: createWrapper(),

  });      });



  describe('Registro', () => {      await result.current.register({

    it('deve registrar usuário com sucesso', async () => {        name: 'New User',

      const mockResponse = {        email: 'new@example.com',

        user: { id: '1', name: 'New User', email: 'new@example.com', createdAt: '', updatedAt: '' },        password: '123456',

        token: 'mock-token',      });

      };

      await waitFor(() => {

      (authService.register as jest.Mock).mockResolvedValue(mockResponse);        expect(authService.register).toHaveBeenCalledWith({

          name: 'New User',

      const { result } = renderHook(() => useAuthMutations(), {          email: 'new@example.com',

        wrapper: createWrapper(),          password: '123456',

      });        });

        expect(mockSetUser).toHaveBeenCalledWith(mockResponse.user);

      await act(async () => {        expect(mockSetToken).toHaveBeenCalledWith(mockResponse.token);

        await result.current.register({        expect(showToast).toHaveBeenCalledWith('Conta criada com sucesso!', 'success');

          name: 'New User',      });

          email: 'new@example.com',    });

          password: '123456',

        });    it('deve tratar erro de registro', async () => {

      });      (authService.register as jest.Mock).mockRejectedValue(new Error('Email já cadastrado'));



      expect(authService.register).toHaveBeenCalledWith({      const { result } = renderHook(() => useAuthMutations(), {

        name: 'New User',        wrapper: createWrapper(),

        email: 'new@example.com',      });

        password: '123456',

      });      await expect(

      expect(showToast).toHaveBeenCalledWith('Conta criada com sucesso!', 'success');        result.current.register({

    });          name: 'New User',

          email: 'existing@example.com',

    it('deve tratar erro de registro', async () => {          password: '123456',

      const error = new Error('Email já cadastrado');        })

      (authService.register as jest.Mock).mockRejectedValue(error);      ).rejects.toThrow();



      const { result } = renderHook(() => useAuthMutations(), {      await waitFor(() => {

        wrapper: createWrapper(),        expect(showToast).toHaveBeenCalledWith(

      });          expect.stringContaining('Erro ao criar conta'),

          'error'

      await expect(        );

        act(async () => {      });

          await result.current.register({    });

            name: 'New User',  });

            email: 'existing@example.com',

            password: '123456',  describe('Estados de loading', () => {

          });    it('deve ter flags de loading para login e registro', async () => {

        })      const { result } = renderHook(() => useAuthMutations(), {

      ).rejects.toThrow('Email já cadastrado');        wrapper: createWrapper(),

      });

      await waitFor(() => {

        expect(showToast).toHaveBeenCalledWith('Email já cadastrado', 'error');      expect(result.current.isLoggingIn).toBe(false);

      });      expect(result.current.isRegistering).toBe(false);

    });    });

  });

    it('deve ter estado de loading durante registro', async () => {});

      const mockResponse = {
        user: { id: '1', name: 'New User', email: 'new@example.com', createdAt: '', updatedAt: '' },
        token: 'mock-token',
      };

      (authService.register as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve(mockResponse), 100)
          )
      );

      const { result } = renderHook(() => useAuthMutations(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isRegistering).toBe(false);

      const registerPromise = act(async () => {
        await result.current.register({
          name: 'New User',
          email: 'new@example.com',
          password: '123456',
        });
      });

      await waitFor(() => {
        expect(result.current.isRegistering).toBe(true);
      });

      await registerPromise;

      await waitFor(() => {
        expect(result.current.isRegistering).toBe(false);
      });
    });
  });

  describe('Logout', () => {
    it('deve fazer logout com sucesso', async () => {
      (authService.logout as jest.Mock).mockResolvedValue(undefined);

      const { result } = renderHook(() => useAuthMutations(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.logout();
      });

      expect(authService.logout).toHaveBeenCalled();
      expect(showToast).toHaveBeenCalledWith('Logout realizado com sucesso', 'success');
    });

    it('deve tratar erro de logout', async () => {
      const error = new Error('Erro ao fazer logout');
      (authService.logout as jest.Mock).mockRejectedValue(error);

      const { result } = renderHook(() => useAuthMutations(), {
        wrapper: createWrapper(),
      });

      await expect(
        act(async () => {
          await result.current.logout();
        })
      ).rejects.toThrow('Erro ao fazer logout');

      await waitFor(() => {
        expect(showToast).toHaveBeenCalledWith('Erro ao fazer logout', 'error');
      });
    });
  });
});

import { authService, AuthService } from '@/lib/services/auth-service';
import { User, LoginRequest, RegisterRequest } from '@/types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock do AsyncStorage
jest.mock('@react-native-async-storage/async-storage');

// Mock do fetch global
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.multiSet as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);
  });

  describe('login', () => {
    it('deve fazer login com sucesso', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
            createdAt: '',
            updatedAt: '',
          },
          token: 'mock-token',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await authService.login({
        email: 'test@example.com',
        password: '123456',
      });

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/login'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'test@example.com', password: '123456' }),
        })
      );
      expect(AsyncStorage.multiSet).toHaveBeenCalledWith([
        ['@medtrack:auth_token', 'mock-token'],
        ['@medtrack:user', JSON.stringify(mockResponse.data.user)],
      ]);
    });

    it('deve lançar erro quando credenciais inválidas', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Credenciais inválidas' }),
      } as Response);

      await expect(
        authService.login({ email: 'wrong@example.com', password: 'wrong' })
      ).rejects.toThrow('Credenciais inválidas');
    });

    it('deve lançar erro quando resposta não é ok', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      } as Response);

      await expect(
        authService.login({ email: 'test@example.com', password: '123456' })
      ).rejects.toThrow('Erro HTTP 500');
    });
  });

  describe('register', () => {
    it('deve registrar usuário com sucesso', async () => {
      const mockResponse = {
        success: true,
        data: {
          user: {
            id: '1',
            name: 'New User',
            email: 'new@example.com',
            createdAt: '',
            updatedAt: '',
          },
          token: 'mock-token',
        },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await authService.register({
        name: 'New User',
        email: 'new@example.com',
        password: '123456',
      });

      expect(result).toEqual(mockResponse);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/register'),
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'New User',
            email: 'new@example.com',
            password: '123456',
          }),
        })
      );
    });

    it('deve lançar erro quando email já existe', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: async () => ({ error: 'Email já cadastrado' }),
      } as Response);

      await expect(
        authService.register({
          name: 'Test',
          email: 'existing@example.com',
          password: '123456',
        })
      ).rejects.toThrow('Email já cadastrado');
    });
  });

  describe('logout', () => {
    it('deve fazer logout removendo dados do storage', async () => {
      await authService.logout();

      expect(AsyncStorage.multiRemove).toHaveBeenCalledWith([
        '@medtrack:auth_token',
        '@medtrack:user',
      ]);
    });

    it('deve lançar erro se falhar ao remover dados', async () => {
      (AsyncStorage.multiRemove as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      await expect(authService.logout()).rejects.toThrow('Storage error');
    });
  });

  describe('isAuthenticated', () => {
    it('deve retornar true quando token existe', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('mock-token');

      const result = await authService.isAuthenticated();

      expect(result).toBe(true);
    });

    it('deve retornar false quando token não existe', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await authService.isAuthenticated();

      expect(result).toBe(false);
    });

    it('deve retornar false quando erro ao buscar token', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const result = await authService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe('getToken', () => {
    it('deve retornar token quando existe', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('mock-token');

      const result = await authService.getToken();

      expect(result).toBe('mock-token');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@medtrack:auth_token');
    });

    it('deve retornar null quando token não existe', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await authService.getToken();

      expect(result).toBeNull();
    });

    it('deve retornar null quando erro ao buscar', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const result = await authService.getToken();

      expect(result).toBeNull();
    });
  });

  describe('getUser', () => {
    it('deve retornar usuário quando existe', async () => {
      const mockUser = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com',
        createdAt: '',
        updatedAt: '',
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUser));

      const result = await authService.getUser();

      expect(result).toEqual(mockUser);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@medtrack:user');
    });

    it('deve retornar null quando usuário não existe', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const result = await authService.getUser();

      expect(result).toBeNull();
    });

    it('deve retornar null quando erro ao buscar', async () => {
      (AsyncStorage.getItem as jest.Mock).mockRejectedValueOnce(new Error('Storage error'));

      const result = await authService.getUser();

      expect(result).toBeNull();
    });
  });

  describe('getAuthHeaders', () => {
    it('deve retornar headers com token quando autenticado', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('mock-token');

      const headers = await authService.getAuthHeaders();

      expect(headers).toEqual({
        'Content-Type': 'application/json',
        Authorization: 'Bearer mock-token',
      });
    });

    it('deve retornar headers sem token quando não autenticado', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(null);

      const headers = await authService.getAuthHeaders();

      expect(headers).toEqual({
        'Content-Type': 'application/json',
      });
    });
  });
});

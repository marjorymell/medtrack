import { authService } from '@/services/auth-service';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

/**
 * Tipos de resposta da API
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
  message?: string;
}

/**
 * Opções para requisições HTTP
 */
export interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
  timeout?: number;
}

/**
 * Classe base para serviços de API
 * Centraliza lógica de HTTP, autenticação e tratamento de erros
 */
export class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_URL) {
    this.baseURL = baseURL;
  }

  /**
   * Faz uma requisição HTTP genérica
   */
  private async makeRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { requiresAuth = true, timeout = 10000, headers = {}, ...fetchOptions } = options;

    try {
      // Monta URL completa
      const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;

      // Headers base
      const requestHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Adiciona headers customizados se forem um objeto Record
      if (headers && typeof headers === 'object' && !Array.isArray(headers)) {
        Object.assign(requestHeaders, headers);
      }

      // Adiciona token de autenticação se necessário
      if (requiresAuth) {
        const token = await authService.getToken();
        console.log('[API] Token obtido do authService:', token ? 'PRESENTE' : 'AUSENTE');
        if (token) {
          requestHeaders.Authorization = `Bearer ${token}`;
          console.log('[API] Header Authorization adicionado com token');
        } else if (requiresAuth) {
          console.log('[API] Token não encontrado, falhando requisição');
          throw new Error('Token de autenticação não encontrado');
        }
      }

      console.log(`[API] ${fetchOptions.method || 'GET'} ${url}`);

      // Controller para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Faz a requisição
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Trata resposta
      const responseData = await this.parseResponse<T>(response);

      console.log(`[API] ✓ ${response.status} ${endpoint}`);
      return responseData;
    } catch (error: any) {
      console.error(`[API] ✗ Erro em ${endpoint}:`, error);

      // Trata diferentes tipos de erro
      if (error.name === 'AbortError') {
        throw new Error('Timeout: A requisição demorou muito para responder');
      }

      if (error.message === 'Token de autenticação não encontrado') {
        throw error;
      }

      if (error.message?.includes('Network request failed')) {
        throw new Error('Erro de conexão. Verifique sua internet.');
      }

      throw error;
    }
  }

  /**
   * Parseia a resposta HTTP
   */
  private async parseResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: any;

    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }
    } catch {
      data = null;
    }

    // Respostas de sucesso
    if (response.ok) {
      // Se já é um objeto ApiResponse, retorna diretamente
      if (data && typeof data === 'object' && 'success' in data) {
        return data as ApiResponse<T>;
      }

      // Caso contrário, envelopa em ApiResponse
      return {
        success: true,
        data: data as T,
      };
    }

    // Respostas de erro
    if (data && typeof data === 'object' && 'error' in data) {
      return data as ApiResponse<T>;
    }

    // Erro genérico
    return {
      success: false,
      error: {
        code: 'HTTP_ERROR',
        message: `Erro HTTP ${response.status}: ${response.statusText}`,
      },
    };
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    // Adicionar timestamp para evitar cache em GET
    const separator = endpoint.includes('?') ? '&' : '?';
    const noCacheEndpoint = `${endpoint}${separator}_t=${Date.now()}`;
    return this.makeRequest<T>(noCacheEndpoint, { ...options, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: any,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    options: Omit<RequestOptions, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { ...options, method: 'DELETE' });
  }

  /**
   * Verifica se o usuário está autenticado
   */
  async isAuthenticated(): Promise<boolean> {
    return authService.isAuthenticated();
  }

  /**
   * Obtém o token atual
   */
  async getToken(): Promise<string | null> {
    return authService.getToken();
  }
}

// Instância singleton para uso geral
export const apiService = new ApiService();

// Exporta também a classe para casos específicos
export default ApiService;

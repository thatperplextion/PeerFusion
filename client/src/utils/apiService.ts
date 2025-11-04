/**
 * PeerFusion API Service
 * Centralized API communication layer with error handling
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5051';

/**
 * API Response Interface
 */
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  status: number;
}

/**
 * HTTP Method Types
 */
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Request Configuration
 */
interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

/**
 * Make HTTP Request
 * @param endpoint - API endpoint path
 * @param config - Request configuration
 * @returns Promise with API response
 */
async function request<T = any>(
  endpoint: string,
  config: RequestConfig
): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    // Add authorization token if provided
    if (config.token) {
      headers['Authorization'] = `Bearer ${config.token}`;
    }

    const options: RequestInit = {
      method: config.method,
      headers,
      credentials: 'include',
    };

    // Add body for POST, PUT, PATCH requests
    if (config.body && ['POST', 'PUT', 'PATCH'].includes(config.method)) {
      options.body = JSON.stringify(config.body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, options);
    const data = await response.json();

    return {
      data: response.ok ? data : undefined,
      error: !response.ok ? data.error || data.message : undefined,
      message: data.message,
      status: response.status,
    };
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      error: error instanceof Error ? error.message : 'Network error occurred',
      status: 0,
    };
  }
}

/**
 * API Service Methods
 */
export const apiService = {
  /**
   * GET Request
   */
  get: <T = any>(endpoint: string, token?: string): Promise<ApiResponse<T>> =>
    request<T>(endpoint, { method: 'GET', token }),

  /**
   * POST Request
   */
  post: <T = any>(
    endpoint: string,
    body?: any,
    token?: string
  ): Promise<ApiResponse<T>> =>
    request<T>(endpoint, { method: 'POST', body, token }),

  /**
   * PUT Request
   */
  put: <T = any>(
    endpoint: string,
    body?: any,
    token?: string
  ): Promise<ApiResponse<T>> =>
    request<T>(endpoint, { method: 'PUT', body, token }),

  /**
   * DELETE Request
   */
  delete: <T = any>(
    endpoint: string,
    token?: string
  ): Promise<ApiResponse<T>> =>
    request<T>(endpoint, { method: 'DELETE', token }),

  /**
   * PATCH Request
   */
  patch: <T = any>(
    endpoint: string,
    body?: any,
    token?: string
  ): Promise<ApiResponse<T>> =>
    request<T>(endpoint, { method: 'PATCH', body, token }),
};

/**
 * Get Authentication Token from localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

/**
 * API Error Handler
 */
export const handleApiError = (error: string | undefined): string => {
  if (!error) return 'An unexpected error occurred';
  
  // Common error messages
  const errorMap: Record<string, string> = {
    'Network error occurred': 'Unable to connect to the server. Please check your internet connection.',
    'Unauthorized': 'Your session has expired. Please log in again.',
    'Forbidden': 'You do not have permission to perform this action.',
    'Not Found': 'The requested resource was not found.',
    'Internal Server Error': 'Something went wrong on our end. Please try again later.',
  };

  return errorMap[error] || error;
};

export default apiService;

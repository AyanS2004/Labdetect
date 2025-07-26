import axios from 'axios'
import type { LoginCredentials, RegisterCredentials, AuthResponse, APIResponse } from '@/types'

// Use local auth server
const AUTH_API_BASE = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:5000'

const authApi = axios.create({
  baseURL: `${AUTH_API_BASE}/auth`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add request interceptor to include token
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for token refresh
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('auth-refresh-token')
        if (refreshToken) {
          const response = await authApi.post('/refresh', { refreshToken })
          const { token } = response.data
          
          localStorage.setItem('auth-token', token)
          originalRequest.headers.Authorization = `Bearer ${token}`
          
          return authApi(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('auth-token')
        localStorage.removeItem('auth-refresh-token')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<APIResponse<AuthResponse>> => {
    const response = await authApi.post('/login', credentials)
    return response.data
  },

  register: async (credentials: RegisterCredentials): Promise<APIResponse<AuthResponse>> => {
    const response = await authApi.post('/register', credentials)
    return response.data
  },

  refreshToken: async (refreshToken: string): Promise<APIResponse<{ token: string; refreshToken: string }>> => {
    const response = await authApi.post('/refresh', { refreshToken })
    return response.data
  },

  logout: async (): Promise<APIResponse> => {
    const response = await authApi.post('/logout')
    return response.data
  },

  getProfile: async (): Promise<APIResponse<any>> => {
    const response = await authApi.get('/profile')
    return response.data
  },

  updateProfile: async (data: any): Promise<APIResponse<any>> => {
    const response = await authApi.put('/profile', data)
    return response.data
  }
} 
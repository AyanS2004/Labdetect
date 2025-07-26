import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { User, LoginCredentials, RegisterCredentials, AuthResponse } from '@/types'
import { authAPI } from '@/utils/auth-api'

interface AuthStore {
  // Auth state
  isAuthenticated: boolean
  user: User | null
  token: string | null
  refreshToken: string | null
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => void
  refreshTokens: () => Promise<void>
  setUser: (user: User) => void
  checkAuth: () => boolean
  
  // Loading states
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isAuthenticated: false,
        user: null,
        token: null,
        refreshToken: null,
        isLoading: false,

        // Actions
        login: async (credentials) => {
          set({ isLoading: true })
          try {
            const response = await authAPI.login(credentials)
            if (response.success && response.data) {
              const { user, token, refreshToken } = response.data
              
              set({
                isAuthenticated: true,
                user,
                token,
                refreshToken,
                isLoading: false
              })
            } else {
              throw new Error(response.error || 'Login failed')
            }
          } catch (error) {
            set({ isLoading: false })
            throw error
          }
        },

        register: async (credentials) => {
          set({ isLoading: true })
          try {
            const response = await authAPI.register(credentials)
            if (response.success && response.data) {
              const { user, token, refreshToken } = response.data
              
              set({
                isAuthenticated: true,
                user,
                token,
                refreshToken,
                isLoading: false
              })
            } else {
              throw new Error(response.error || 'Registration failed')
            }
          } catch (error) {
            set({ isLoading: false })
            throw error
          }
        },

        logout: () => {
          set({
            isAuthenticated: false,
            user: null,
            token: null,
            refreshToken: null
          })
        },

        refreshTokens: async () => {
          const { refreshToken: currentRefreshToken } = get()
          if (!currentRefreshToken) {
            throw new Error('No refresh token available')
          }

          try {
            const response = await authAPI.refreshToken(currentRefreshToken)
            if (response.success && response.data) {
              const { token, refreshToken: newRefreshToken } = response.data
              
              set({
                token,
                refreshToken: newRefreshToken
              })
            } else {
              throw new Error(response.error || 'Token refresh failed')
            }
          } catch (error) {
            // If refresh fails, logout user
            get().logout()
            throw error
          }
        },

        setUser: (user) => {
          set({ user })
        },

        checkAuth: () => {
          const { token, isAuthenticated } = get()
          return isAuthenticated && !!token
        },

        setLoading: (loading) => {
          set({ isLoading: loading })
        }
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
          token: state.token,
          refreshToken: state.refreshToken
        })
      }
    ),
    { name: 'auth-store' }
  )
) 
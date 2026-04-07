import { create } from 'zustand'
import { api } from '../lib/api'

interface User {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  createdAt: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      const response = await api.post<{ data: { user: User; tokens: { accessToken: string; refreshToken: string } } }>(
        '/auth/login',
        { email, password }
      )
      api.setAuthTokens(response.data.tokens)
      set({ user: response.data.user, isAuthenticated: true, isLoading: false })
    } catch {
      set({ isLoading: false })
      throw new Error('Invalid credentials')
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true })
    try {
      const response = await api.post<{ data: { user: User; tokens: { accessToken: string; refreshToken: string } } }>(
        '/auth/register',
        { name, email, password }
      )
      api.setAuthTokens(response.data.tokens)
      set({ user: response.data.user, isAuthenticated: true, isLoading: false })
    } catch {
      set({ isLoading: false })
      throw new Error('Registration failed')
    }
  },

  logout: () => {
    api.clearAuthTokens()
    set({ user: null, isAuthenticated: false })
  },

  fetchUser: async () => {
    try {
      api.loadTokens()
      const response = await api.get<{ data: { user: User } }>('/auth/me')
      set({ user: response.data.user, isAuthenticated: true })
    } catch {
      api.clearAuthTokens()
      set({ user: null, isAuthenticated: false })
    }
  },
}))

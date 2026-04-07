import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '../../src/store/auth.store'

vi.mock('../../src/lib/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
    setAuthTokens: vi.fn(),
    clearAuthTokens: vi.fn(),
    loadTokens: vi.fn(),
  },
}))

const { api } = await import('../../src/lib/api')

describe('authStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  })

  describe('initial state', () => {
    it('should start with user null', () => {
      expect(useAuthStore.getState().user).toBeNull()
    })

    it('should start as not authenticated', () => {
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })

    it('should start with isLoading false', () => {
      expect(useAuthStore.getState().isLoading).toBe(false)
    })
  })

  describe('login', () => {
    it('should set isLoading to true while logging in', async () => {
      vi.mocked(api.post).mockResolvedValue({
        data: {
          user: { id: '1', name: 'Test', email: 'test@test.com', avatarUrl: null, createdAt: '' },
          tokens: { accessToken: 'abc', refreshToken: 'ref' },
        },
      })

      const loginPromise = useAuthStore.getState().login('test@test.com', 'password')
      expect(useAuthStore.getState().isLoading).toBe(true)
      await loginPromise
    })

    it('should set user and isAuthenticated on successful login', async () => {
      const mockUser = { id: '1', name: 'Test User', email: 'test@test.com', avatarUrl: null, createdAt: '2024-01-01' }
      const mockTokens = { accessToken: 'abc', refreshToken: 'ref' }

      vi.mocked(api.post).mockResolvedValue({
        data: { user: mockUser, tokens: mockTokens },
      })

      await useAuthStore.getState().login('test@test.com', 'password')

      expect(api.post).toHaveBeenCalledWith('/auth/login', {
        email: 'test@test.com',
        password: 'password',
      })
      expect(api.setAuthTokens).toHaveBeenCalledWith(mockTokens)
      expect(useAuthStore.getState().user).toEqual(mockUser)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().isLoading).toBe(false)
    })

    it('should throw error and reset isLoading on failed login', async () => {
      vi.mocked(api.post).mockRejectedValue(new Error('Network error'))

      await expect(
        useAuthStore.getState().login('wrong@test.com', 'wrong')
      ).rejects.toThrow('Invalid credentials')

      expect(useAuthStore.getState().isLoading).toBe(false)
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('register', () => {
    it('should set user and isAuthenticated on successful registration', async () => {
      const mockUser = { id: '1', name: 'New User', email: 'new@test.com', avatarUrl: null, createdAt: '2024-01-01' }
      const mockTokens = { accessToken: 'abc', refreshToken: 'ref' }

      vi.mocked(api.post).mockResolvedValue({
        data: { user: mockUser, tokens: mockTokens },
      })

      await useAuthStore.getState().register('New User', 'new@test.com', 'password123')

      expect(api.post).toHaveBeenCalledWith('/auth/register', {
        name: 'New User',
        email: 'new@test.com',
        password: 'password123',
      })
      expect(api.setAuthTokens).toHaveBeenCalledWith(mockTokens)
      expect(useAuthStore.getState().user).toEqual(mockUser)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
      expect(useAuthStore.getState().isLoading).toBe(false)
    })

    it('should throw error and reset isLoading on failed registration', async () => {
      vi.mocked(api.post).mockRejectedValue(new Error('Network error'))

      await expect(
        useAuthStore.getState().register('New User', 'new@test.com', 'password123')
      ).rejects.toThrow('Registration failed')

      expect(useAuthStore.getState().isLoading).toBe(false)
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('logout', () => {
    it('should clear user and set isAuthenticated to false', () => {
      useAuthStore.setState({
        user: { id: '1', name: 'Test', email: 'test@test.com', avatarUrl: null, createdAt: '' },
        isAuthenticated: true,
      })

      useAuthStore.getState().logout()

      expect(api.clearAuthTokens).toHaveBeenCalled()
      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })

  describe('fetchUser', () => {
    it('should set user and isAuthenticated when fetch succeeds', async () => {
      const mockUser = { id: '1', name: 'Test', email: 'test@test.com', avatarUrl: null, createdAt: '' }

      vi.mocked(api.get).mockResolvedValue({ data: { user: mockUser } })

      await useAuthStore.getState().fetchUser()

      expect(api.loadTokens).toHaveBeenCalled()
      expect(api.get).toHaveBeenCalledWith('/auth/me')
      expect(useAuthStore.getState().user).toEqual(mockUser)
      expect(useAuthStore.getState().isAuthenticated).toBe(true)
    })

    it('should clear auth and set not authenticated when fetch fails', async () => {
      vi.mocked(api.get).mockRejectedValue(new Error('Network error'))

      await useAuthStore.getState().fetchUser()

      expect(api.clearAuthTokens).toHaveBeenCalled()
      expect(useAuthStore.getState().user).toBeNull()
      expect(useAuthStore.getState().isAuthenticated).toBe(false)
    })
  })
})

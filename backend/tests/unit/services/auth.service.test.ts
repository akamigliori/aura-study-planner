import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AuthService } from '../../../src/services/auth.service'
import { PrismaClient } from '../../../src/generated'
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from '../../../src/utils/errors'
import * as passwordUtils from '../../../src/utils/password'

function createMockFastify() {
  return {
    jwt: {
      sign: vi.fn((payload: object) => `mock-token-${JSON.stringify(payload)}`),
      verify: vi.fn(),
    },
  } as unknown as Parameters<typeof AuthService>[1]
}

function createMockPrisma() {
  return {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  } as unknown as PrismaClient
}

describe('AuthService', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>
  let mockFastify: ReturnType<typeof createMockFastify>
  let service: AuthService

  const mockUser = {
    id: 'user-1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashed123',
    avatarUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    mockFastify = createMockFastify()
    service = new AuthService(mockPrisma, mockFastify)
    vi.clearAllMocks()
    vi.spyOn(passwordUtils, 'hashPassword').mockResolvedValue('newHashedPassword')
    vi.spyOn(passwordUtils, 'comparePassword').mockResolvedValue(true)
    vi.mocked(mockFastify.jwt.verify).mockReturnValue({
      userId: 'user-1',
      email: 'test@example.com',
      type: 'refresh',
    })
  })

  describe('register', () => {
    it('should create user and return tokens on success', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null)
      vi.mocked(mockPrisma.user.create).mockResolvedValue(mockUser)

      const result = await service.register({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.user).toEqual({
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: null,
        createdAt: mockUser.createdAt,
      })
      expect(result.tokens.accessToken).toBeDefined()
      expect(result.tokens.refreshToken).toBeDefined()
      expect(passwordUtils.hashPassword).toHaveBeenCalledWith('password123')
    })

    it('should throw ConflictError when email already exists', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(mockUser)

      await expect(
        service.register({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Email already registered')
    })
  })

  describe('login', () => {
    it('should return user and tokens on successful login', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(passwordUtils.comparePassword).mockResolvedValue(true)

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      })

      expect(result.user.email).toBe('test@example.com')
      expect(result.tokens.accessToken).toBeDefined()
    })

    it('should throw UnauthorizedError when user not found', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null)

      await expect(
        service.login({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Invalid email or password')
    })

    it('should throw UnauthorizedError when password is incorrect', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(passwordUtils.comparePassword).mockResolvedValue(false)

      await expect(
        service.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow('Invalid email or password')
    })
  })

  describe('refreshToken', () => {
    it('should return new access token with valid refresh token', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(mockFastify.jwt.verify).mockReturnValue({
        userId: 'user-1',
        email: 'test@example.com',
        type: 'refresh',
      })

      const result = await service.refreshToken('valid-refresh-token')

      expect(result.accessToken).toBeDefined()
    })

    it('should throw UnauthorizedError with invalid token', async () => {
      vi.mocked(mockFastify.jwt.verify).mockImplementation(() => {
        throw new Error('Invalid token')
      })

      await expect(service.refreshToken('some-token')).rejects.toThrow(
        'Invalid or expired refresh token'
      )
    })

    it('should throw UnauthorizedError when token type is not refresh', async () => {
      const localFastify = {
        jwt: {
          sign: () => 'mock-token',
          verify: () => ({
            userId: 'user-1',
            email: 'test@example.com',
            type: 'access',
          }),
        },
      } as unknown as Parameters<typeof AuthService>[1]
      const localService = new AuthService(mockPrisma, localFastify)

      await expect(localService.refreshToken('some-token')).rejects.toThrow(
        'Invalid token type'
      )
    })

    it('should throw UnauthorizedError when user not found', async () => {
      const localFastify = {
        jwt: {
          sign: () => 'mock-token',
          verify: () => ({
            userId: 'user-1',
            email: 'test@example.com',
            type: 'refresh',
          }),
        },
      } as unknown as Parameters<typeof AuthService>[1]
      const localService = new AuthService(mockPrisma, localFastify)
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null)

      await expect(localService.refreshToken('some-token')).rejects.toThrow(
        'User not found'
      )
    })
  })

  describe('getProfile', () => {
    it('should return user profile', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(mockUser)

      const result = await service.getProfile('user-1')

      expect(result).toEqual({
        id: 'user-1',
        name: 'Test User',
        email: 'test@example.com',
        avatarUrl: null,
        createdAt: mockUser.createdAt,
      })
    })

    it('should throw NotFoundError when user not found', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null)

      await expect(service.getProfile('nonexistent')).rejects.toThrow(
        'User not found'
      )
    })
  })

  describe('changePassword', () => {
    it('should update password when current password is correct', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(passwordUtils.comparePassword).mockResolvedValue(true)
      vi.mocked(mockPrisma.user.update).mockResolvedValue(mockUser)

      await expect(
        service.changePassword('user-1', {
          currentPassword: 'oldPassword',
          newPassword: 'newPassword123',
        })
      ).resolves.toBeUndefined()

      expect(passwordUtils.hashPassword).toHaveBeenCalledWith('newPassword123')
    })

    it('should throw BadRequestError when current password is incorrect', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(mockUser)
      vi.mocked(passwordUtils.comparePassword).mockResolvedValue(false)

      await expect(
        service.changePassword('user-1', {
          currentPassword: 'wrongPassword',
          newPassword: 'newPassword123',
        })
      ).rejects.toThrow('Current password is incorrect')
    })

    it('should throw NotFoundError when user not found', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null)

      await expect(
        service.changePassword('nonexistent', {
          currentPassword: 'oldPassword',
          newPassword: 'newPassword123',
        })
      ).rejects.toThrow('User not found')
    })
  })
})

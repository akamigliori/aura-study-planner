import { describe, it, expect, vi, beforeEach } from 'vitest'
import { UserRepository } from '../../../src/repositories/user.repository'
import type { PrismaClient, User } from '../../../src/generated'

function createMockPrisma() {
  return {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  } as unknown as PrismaClient
}

describe('UserRepository', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>
  let repo: UserRepository

  const mockUser: User = {
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
    repo = new UserRepository(mockPrisma)
    vi.clearAllMocks()
  })

  describe('findByEmail', () => {
    it('should return user when found', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(mockUser)

      const result = await repo.findByEmail('test@example.com')

      expect(result).toEqual(mockUser)
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      })
    })

    it('should return null when user not found', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null)

      const result = await repo.findByEmail('nonexistent@example.com')

      expect(result).toBeNull()
    })
  })

  describe('findById', () => {
    it('should return user when found', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(mockUser)

      const result = await repo.findById('user-1')

      expect(result).toEqual(mockUser)
      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 'user-1' },
      })
    })

    it('should return null when user not found', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null)

      const result = await repo.findById('nonexistent')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create and return new user', async () => {
      vi.mocked(mockPrisma.user.create).mockResolvedValue(mockUser)

      const result = await repo.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashed123',
      })

      expect(result).toEqual(mockUser)
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          password: 'hashed123',
        },
      })
    })
  })

  describe('update', () => {
    it('should update and return user', async () => {
      const updatedUser = { ...mockUser, name: 'Updated Name' }
      vi.mocked(mockPrisma.user.update).mockResolvedValue(updatedUser)

      const result = await repo.update('user-1', { name: 'Updated Name' })

      expect(result).toEqual(updatedUser)
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { name: 'Updated Name' },
      })
    })
  })

  describe('emailExists', () => {
    it('should return true when email exists', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(mockUser)

      const result = await repo.emailExists('test@example.com')

      expect(result).toBe(true)
    })

    it('should return false when email does not exist', async () => {
      vi.mocked(mockPrisma.user.findUnique).mockResolvedValue(null)

      const result = await repo.emailExists('nonexistent@example.com')

      expect(result).toBe(false)
    })
  })
})

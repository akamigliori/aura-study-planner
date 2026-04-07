import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SubjectRepository } from '../../../src/repositories/subject.repository'
import type { PrismaClient, Subject } from '../../../src/generated'

function createMockPrisma() {
  return {
    subject: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  } as unknown as PrismaClient
}

describe('SubjectRepository', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>
  let repo: SubjectRepository

  const mockSubject: Subject = {
    id: 'sub-1',
    name: 'Mathematics',
    color: '#6366f1',
    description: 'Calculus and Algebra',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    repo = new SubjectRepository(mockPrisma)
    vi.clearAllMocks()
  })

  describe('findByUserId', () => {
    it('should return all subjects for a user', async () => {
      vi.mocked(mockPrisma.subject.findMany).mockResolvedValue([mockSubject])

      const result = await repo.findByUserId('user-1')

      expect(result).toEqual([mockSubject])
      expect(mockPrisma.subject.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should return empty array when no subjects found', async () => {
      vi.mocked(mockPrisma.subject.findMany).mockResolvedValue([])

      const result = await repo.findByUserId('user-1')

      expect(result).toEqual([])
    })
  })

  describe('findByIdAndUserId', () => {
    it('should return subject when found and owned by user', async () => {
      vi.mocked(mockPrisma.subject.findUnique).mockResolvedValue(mockSubject)

      const result = await repo.findByIdAndUserId('sub-1', 'user-1')

      expect(result).toEqual(mockSubject)
      expect(mockPrisma.subject.findUnique).toHaveBeenCalledWith({
        where: { id: 'sub-1', userId: 'user-1' },
      })
    })

    it('should return null when subject not found', async () => {
      vi.mocked(mockPrisma.subject.findUnique).mockResolvedValue(null)

      const result = await repo.findByIdAndUserId('sub-1', 'user-1')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create and return new subject', async () => {
      vi.mocked(mockPrisma.subject.create).mockResolvedValue(mockSubject)

      const result = await repo.create({
        name: 'Mathematics',
        color: '#6366f1',
        description: 'Calculus and Algebra',
        userId: 'user-1',
      })

      expect(result).toEqual(mockSubject)
      expect(mockPrisma.subject.create).toHaveBeenCalledWith({
        data: {
          name: 'Mathematics',
          color: '#6366f1',
          description: 'Calculus and Algebra',
          userId: 'user-1',
        },
      })
    })
  })

  describe('update', () => {
    it('should update and return subject', async () => {
      const updated = { ...mockSubject, name: 'Updated Math' }
      vi.mocked(mockPrisma.subject.update).mockResolvedValue(updated)

      const result = await repo.update('sub-1', 'user-1', { name: 'Updated Math' })

      expect(result).toEqual(updated)
      expect(mockPrisma.subject.update).toHaveBeenCalledWith({
        where: { id: 'sub-1', userId: 'user-1' },
        data: { name: 'Updated Math' },
      })
    })
  })

  describe('delete', () => {
    it('should delete subject', async () => {
      vi.mocked(mockPrisma.subject.delete).mockResolvedValue(mockSubject)

      await repo.delete('sub-1', 'user-1')

      expect(mockPrisma.subject.delete).toHaveBeenCalledWith({
        where: { id: 'sub-1', userId: 'user-1' },
      })
    })
  })
})

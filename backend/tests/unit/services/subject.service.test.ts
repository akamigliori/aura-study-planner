import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SubjectService } from '../../../src/services/subject.service'
import { PrismaClient } from '../../../src/generated'
import { NotFoundError } from '../../../src/utils/errors'

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

describe('SubjectService', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>
  let service: SubjectService

  const mockSubject = {
    id: 'sub-1',
    name: 'Mathematics',
    color: '#6366f1',
    description: 'Calculus',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    service = new SubjectService(mockPrisma)
    vi.clearAllMocks()
  })

  describe('listByUser', () => {
    it('should return all subjects for a user', async () => {
      vi.mocked(mockPrisma.subject.findMany).mockResolvedValue([mockSubject])

      const result = await service.listByUser('user-1')

      expect(result).toHaveLength(1)
      expect(result[0].name).toBe('Mathematics')
    })
  })

  describe('getById', () => {
    it('should return subject when found', async () => {
      vi.mocked(mockPrisma.subject.findUnique).mockResolvedValue(mockSubject)

      const result = await service.getById('sub-1', 'user-1')

      expect(result).toEqual(mockSubject)
    })

    it('should throw NotFoundError when not found', async () => {
      vi.mocked(mockPrisma.subject.findUnique).mockResolvedValue(null)

      await expect(service.getById('sub-1', 'user-1')).rejects.toThrow(
        'Subject not found'
      )
    })
  })

  describe('create', () => {
    it('should create and return subject', async () => {
      vi.mocked(mockPrisma.subject.create).mockResolvedValue(mockSubject)

      const result = await service.create('user-1', {
        name: 'Mathematics',
        color: '#6366f1',
        description: 'Calculus',
      })

      expect(result).toEqual(mockSubject)
    })
  })

  describe('update', () => {
    it('should update and return subject', async () => {
      const updated = { ...mockSubject, name: 'Updated Math' }
      vi.mocked(mockPrisma.subject.findUnique).mockResolvedValue(mockSubject)
      vi.mocked(mockPrisma.subject.update).mockResolvedValue(updated)

      const result = await service.update('sub-1', 'user-1', {
        name: 'Updated Math',
      })

      expect(result.name).toBe('Updated Math')
    })

    it('should throw NotFoundError when subject does not exist', async () => {
      vi.mocked(mockPrisma.subject.findUnique).mockResolvedValue(null)

      await expect(
        service.update('sub-1', 'user-1', { name: 'Updated' })
      ).rejects.toThrow('Subject not found')
    })
  })

  describe('delete', () => {
    it('should delete subject', async () => {
      vi.mocked(mockPrisma.subject.findUnique).mockResolvedValue(mockSubject)
      vi.mocked(mockPrisma.subject.delete).mockResolvedValue(mockSubject)

      const result = await service.delete('sub-1', 'user-1')

      expect(result).toEqual(mockSubject)
    })

    it('should throw NotFoundError when subject does not exist', async () => {
      vi.mocked(mockPrisma.subject.findUnique).mockResolvedValue(null)

      await expect(service.delete('sub-1', 'user-1')).rejects.toThrow(
        'Subject not found'
      )
    })
  })
})

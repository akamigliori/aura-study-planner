import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TopicRepository } from '../../../src/repositories/topic.repository'
import type { PrismaClient, Topic } from '../../../src/generated'

function createMockPrisma() {
  return {
    topic: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  } as unknown as PrismaClient
}

describe('TopicRepository', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>
  let repo: TopicRepository

  const mockTopic: Topic = {
    id: 'topic-1',
    name: 'Calculus',
    description: 'Derivatives and integrals',
    subjectId: 'sub-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    repo = new TopicRepository(mockPrisma)
    vi.clearAllMocks()
  })

  describe('findBySubjectId', () => {
    it('should return all topics for a subject', async () => {
      vi.mocked(mockPrisma.topic.findMany).mockResolvedValue([mockTopic])

      const result = await repo.findBySubjectId('sub-1')

      expect(result).toEqual([mockTopic])
      expect(mockPrisma.topic.findMany).toHaveBeenCalledWith({
        where: { subjectId: 'sub-1' },
        orderBy: { createdAt: 'desc' },
      })
    })
  })

  describe('findByIdAndSubjectId', () => {
    it('should return topic when found', async () => {
      vi.mocked(mockPrisma.topic.findUnique).mockResolvedValue(mockTopic)

      const result = await repo.findByIdAndSubjectId('topic-1', 'sub-1')

      expect(result).toEqual(mockTopic)
    })

    it('should return null when not found', async () => {
      vi.mocked(mockPrisma.topic.findUnique).mockResolvedValue(null)

      const result = await repo.findByIdAndSubjectId('topic-1', 'sub-1')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create and return topic', async () => {
      vi.mocked(mockPrisma.topic.create).mockResolvedValue(mockTopic)

      const result = await repo.create({
        name: 'Calculus',
        description: 'Derivatives and integrals',
        subjectId: 'sub-1',
      })

      expect(result).toEqual(mockTopic)
    })
  })

  describe('update', () => {
    it('should update and return topic', async () => {
      const updated = { ...mockTopic, name: 'Updated' }
      vi.mocked(mockPrisma.topic.update).mockResolvedValue(updated)

      const result = await repo.update('topic-1', 'sub-1', { name: 'Updated' })

      expect(result.name).toBe('Updated')
    })
  })

  describe('delete', () => {
    it('should delete topic', async () => {
      vi.mocked(mockPrisma.topic.delete).mockResolvedValue(mockTopic)

      const result = await repo.delete('topic-1', 'sub-1')

      expect(result).toEqual(mockTopic)
    })
  })
})

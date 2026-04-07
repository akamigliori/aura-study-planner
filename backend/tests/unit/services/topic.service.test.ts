import { describe, it, expect, vi, beforeEach } from 'vitest'
import { TopicService } from '../../../src/services/topic.service'
import { PrismaClient } from '../../../src/generated'
import { NotFoundError } from '../../../src/utils/errors'

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

describe('TopicService', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>
  let service: TopicService

  const mockTopic = {
    id: 'topic-1',
    name: 'Calculus',
    description: 'Derivatives',
    subjectId: 'sub-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    service = new TopicService(mockPrisma)
    vi.clearAllMocks()
  })

  describe('listBySubject', () => {
    it('should return all topics for a subject', async () => {
      vi.mocked(mockPrisma.topic.findMany).mockResolvedValue([mockTopic])

      const result = await service.listBySubject('sub-1')

      expect(result).toHaveLength(1)
    })
  })

  describe('getById', () => {
    it('should return topic when found', async () => {
      vi.mocked(mockPrisma.topic.findUnique).mockResolvedValue(mockTopic)

      const result = await service.getById('topic-1', 'sub-1')

      expect(result).toEqual(mockTopic)
    })

    it('should throw NotFoundError when not found', async () => {
      vi.mocked(mockPrisma.topic.findUnique).mockResolvedValue(null)

      await expect(service.getById('topic-1', 'sub-1')).rejects.toThrow(
        'Topic not found'
      )
    })
  })

  describe('create', () => {
    it('should create and return topic', async () => {
      vi.mocked(mockPrisma.topic.create).mockResolvedValue(mockTopic)

      const result = await service.create('sub-1', {
        name: 'Calculus',
        description: 'Derivatives',
      })

      expect(result).toEqual(mockTopic)
    })
  })

  describe('update', () => {
    it('should update and return topic', async () => {
      const updated = { ...mockTopic, name: 'Updated' }
      vi.mocked(mockPrisma.topic.findUnique).mockResolvedValue(mockTopic)
      vi.mocked(mockPrisma.topic.update).mockResolvedValue(updated)

      const result = await service.update('topic-1', 'sub-1', { name: 'Updated' })

      expect(result.name).toBe('Updated')
    })

    it('should throw NotFoundError when topic does not exist', async () => {
      vi.mocked(mockPrisma.topic.findUnique).mockResolvedValue(null)

      await expect(
        service.update('topic-1', 'sub-1', { name: 'Updated' })
      ).rejects.toThrow('Topic not found')
    })
  })

  describe('delete', () => {
    it('should delete topic', async () => {
      vi.mocked(mockPrisma.topic.findUnique).mockResolvedValue(mockTopic)
      vi.mocked(mockPrisma.topic.delete).mockResolvedValue(mockTopic)

      const result = await service.delete('topic-1', 'sub-1')

      expect(result).toEqual(mockTopic)
    })

    it('should throw NotFoundError when topic does not exist', async () => {
      vi.mocked(mockPrisma.topic.findUnique).mockResolvedValue(null)

      await expect(service.delete('topic-1', 'sub-1')).rejects.toThrow(
        'Topic not found'
      )
    })
  })
})

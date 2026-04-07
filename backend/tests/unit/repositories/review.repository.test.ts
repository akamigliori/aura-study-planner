import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ReviewRepository } from '../../../src/repositories/review.repository'
import type { PrismaClient, Review } from '../../../src/generated'

function createMockPrisma() {
  return {
    review: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  } as unknown as PrismaClient
}

describe('ReviewRepository', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>
  let repo: ReviewRepository

  const mockReview: Review = {
    id: 'rev-1',
    topicId: 'topic-1',
    userId: 'user-1',
    interval: 1,
    easeFactor: 2.5,
    nextReview: new Date(),
    lastReview: null,
    streak: 0,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    repo = new ReviewRepository(mockPrisma)
    vi.clearAllMocks()
  })

  describe('findByUserId', () => {
    it('should return all reviews for a user', async () => {
      vi.mocked(mockPrisma.review.findMany).mockResolvedValue([mockReview])

      const result = await repo.findByUserId('user-1')

      expect(result).toEqual([mockReview])
    })
  })

  describe('findByIdAndUserId', () => {
    it('should return review when found', async () => {
      vi.mocked(mockPrisma.review.findUnique).mockResolvedValue(mockReview)

      const result = await repo.findByIdAndUserId('rev-1', 'user-1')

      expect(result).toEqual(mockReview)
    })

    it('should return null when not found', async () => {
      vi.mocked(mockPrisma.review.findUnique).mockResolvedValue(null)

      const result = await repo.findByIdAndUserId('rev-1', 'user-1')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create and return review', async () => {
      vi.mocked(mockPrisma.review.create).mockResolvedValue(mockReview)

      const result = await repo.create({
        topicId: 'topic-1',
        userId: 'user-1',
        interval: 1,
        easeFactor: 2.5,
        nextReview: new Date(),
      })

      expect(result).toEqual(mockReview)
    })
  })

  describe('update', () => {
    it('should update and return review', async () => {
      const updated = { ...mockReview, interval: 3 }
      vi.mocked(mockPrisma.review.update).mockResolvedValue(updated)

      const result = await repo.update('rev-1', 'user-1', { interval: 3 })

      expect(result.interval).toBe(3)
    })
  })

  describe('delete', () => {
    it('should delete review', async () => {
      vi.mocked(mockPrisma.review.delete).mockResolvedValue(mockReview)

      const result = await repo.delete('rev-1', 'user-1')

      expect(result).toEqual(mockReview)
    })
  })
})

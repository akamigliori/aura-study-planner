/**
 * Review repository — data access layer for Review model.
 */

import { PrismaClient, Review } from '../generated/client'

export class ReviewRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUserId(userId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { userId },
      include: { topic: true },
      orderBy: { nextReview: 'asc' },
    })
  }

  async findDueByUserId(userId: string): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { userId, nextReview: { lte: new Date() } },
      include: { topic: true },
      orderBy: { nextReview: 'asc' },
    })
  }

  async findByIdAndUserId(
    id: string,
    userId: string
  ): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: { id, userId },
    })
  }

  async create(data: {
    topicId: string
    userId: string
    interval: number
    easeFactor: number
    nextReview: Date
  }): Promise<Review> {
    return this.prisma.review.create({ data })
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Review>
  ): Promise<Review> {
    return this.prisma.review.update({
      where: { id, userId },
      data,
    })
  }

  async delete(id: string, userId: string): Promise<Review> {
    return this.prisma.review.delete({
      where: { id, userId },
    })
  }
}

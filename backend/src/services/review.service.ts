/**
 * Review service — business logic for spaced repetition reviews.
 *
 * Implements the SM-2 algorithm for spaced repetition scheduling.
 * Intervals: 1, 3, 7, 14, 30, 60, 90 days based on user quality rating.
 */

import { PrismaClient } from './generated/client'
import { ReviewRepository } from '../repositories/review.repository.js'
import { NotFoundError } from '../utils/errors.js'
import type { CreateReviewInput, CompleteReviewInput } from '../schemas/review.schema.js'

// SM-2 intervals in days
const INTERVALS = [1, 3, 7, 14, 30, 60, 90]

export class ReviewService {
  private repository: ReviewRepository

  constructor(private prisma: PrismaClient) {
    this.repository = new ReviewRepository(prisma)
  }

  async listByUser(userId: string) {
    return this.repository.findByUserId(userId)
  }

  async getDueReviews(userId: string) {
    return this.repository.findDueByUserId(userId)
  }

  async getById(id: string, userId: string) {
    const review = await this.repository.findByIdAndUserId(id, userId)

    if (!review) {
      throw new NotFoundError('Review')
    }

    return review
  }

  async create(userId: string, input: CreateReviewInput) {
    const now = new Date()
    const nextReview = new Date(now.getTime() + INTERVALS[0] * 24 * 60 * 60 * 1000)

    return this.repository.create({
      topicId: input.topicId,
      userId,
      interval: INTERVALS[0],
      easeFactor: 2.5,
      nextReview,
    })
  }

  /**
   * Complete a review using SM-2 algorithm.
   * Quality: 0-5 (0=complete blackout, 5=perfect response)
   */
  async complete(id: string, userId: string, input: CompleteReviewInput) {
    const review = await this.getById(id, userId)

    const { interval, easeFactor, streak } = this.calculateSM2(
      review.interval,
      review.easeFactor,
      review.streak,
      input.quality
    )

    const now = new Date()
    const nextReview = new Date(now.getTime() + interval * 24 * 60 * 60 * 1000)

    return this.repository.update(id, userId, {
      interval,
      easeFactor,
      streak,
      nextReview,
      lastReview: now,
      status: 'COMPLETED',
    })
  }

  async update(id: string, userId: string, input: Partial<ReviewInput>) {
    await this.getById(id, userId)
    return this.repository.update(id, userId, input)
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId)
    return this.repository.delete(id, userId)
  }

  /**
   * SM-2 algorithm for spaced repetition.
   */
  private calculateSM2(
    currentInterval: number,
    easeFactor: number,
    streak: number,
    quality: number
  ): { interval: number; easeFactor: number; streak: number } {
    let newEaseFactor = easeFactor
    let newInterval = currentInterval
    let newStreak = streak

    if (quality >= 3) {
      // Correct response — increase interval
      if (streak === 0) {
        newInterval = INTERVALS[0]
      } else if (streak === 1) {
        newInterval = INTERVALS[1]
      } else {
        // Find next interval in the sequence
        const currentIndex = INTERVALS.indexOf(currentInterval)
        const nextIndex = Math.min(currentIndex + 1, INTERVALS.length - 1)
        newInterval = INTERVALS[nextIndex]
      }
      newStreak++
    } else {
      // Incorrect response — reset
      newStreak = 0
      newInterval = INTERVALS[0]
    }

    // Update ease factor (SM-2 formula)
    newEaseFactor = Math.max(
      1.3,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    )

    return {
      interval: newInterval,
      easeFactor: Math.round(newEaseFactor * 100) / 100,
      streak: newStreak,
    }
  }
}

type ReviewInput = Parameters<ReviewService['update']>[2]

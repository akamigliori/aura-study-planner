/**
 * Review controller — HTTP request handlers for review routes.
 */

import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from '../generated'
import { ReviewService } from '../services/review.service.js'
import { getUserFromRequest } from '../middlewares/auth.middleware.js'
import { createReviewSchema, completeReviewSchema } from '../schemas/review.schema.js'

export class ReviewController {
  private service: ReviewService

  constructor(private prisma: PrismaClient) {
    this.service = new ReviewService(prisma)
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)

    const reviews = await this.service.listByUser(userId)

    return reply.status(200).send({
      success: true,
      data: { reviews },
    })
  }

  async getDue(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)

    const reviews = await this.service.getDueReviews(userId)

    return reply.status(200).send({
      success: true,
      data: { reviews, count: reviews.length },
    })
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }

    const review = await this.service.getById(id, userId)

    return reply.status(200).send({
      success: true,
      data: { review },
    })
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const validated = createReviewSchema.parse(request)

    const review = await this.service.create(userId, validated.body)

    return reply.status(201).send({
      success: true,
      data: { review },
    })
  }

  async complete(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }
    const validated = completeReviewSchema.parse(request)

    const review = await this.service.complete(id, userId, validated.body)

    return reply.status(200).send({
      success: true,
      data: { review },
    })
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }

    const review = await this.service.update(id, userId, request.body as Record<string, unknown>)

    return reply.status(200).send({
      success: true,
      data: { review },
    })
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }

    await this.service.delete(id, userId)

    return reply.status(200).send({
      success: true,
      message: 'Review deleted successfully',
    })
  }
}

/**
 * Topic controller — HTTP request handlers for topic routes.
 */

import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from './generated/client'
import { TopicService } from '../services/topic.service.js'
import { getUserFromRequest } from '../middlewares/auth.middleware.js'
import { createTopicSchema, updateTopicSchema } from '../schemas/topic.schema.js'

export class TopicController {
  private service: TopicService

  constructor(private prisma: PrismaClient) {
    this.service = new TopicService(prisma)
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { subjectId } = request.params as { subjectId: string }

    const topics = await this.service.listBySubject(subjectId)

    return reply.status(200).send({
      success: true,
      data: { topics },
    })
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { subjectId, id } = request.params as { subjectId: string; id: string }

    const topic = await this.service.getById(id, subjectId)

    return reply.status(200).send({
      success: true,
      data: { topic },
    })
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { subjectId } = request.params as { subjectId: string }
    const validated = createTopicSchema.parse(request)

    const topic = await this.service.create(subjectId, validated.body)

    return reply.status(201).send({
      success: true,
      data: { topic },
    })
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { subjectId, id } = request.params as { subjectId: string; id: string }
    const validated = updateTopicSchema.parse(request)

    const topic = await this.service.update(id, subjectId, validated.body)

    return reply.status(200).send({
      success: true,
      data: { topic },
    })
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { subjectId, id } = request.params as { subjectId: string; id: string }

    await this.service.delete(id, subjectId)

    return reply.status(200).send({
      success: true,
      message: 'Topic deleted successfully',
    })
  }
}

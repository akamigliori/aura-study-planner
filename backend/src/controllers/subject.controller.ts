/**
 * Subject controller — HTTP request handlers for subject routes.
 */

import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from '../generated/client'
import { SubjectService } from '../services/subject.service.js'
import { getUserFromRequest } from '../middlewares/auth.middleware.js'
import { createSubjectSchema, updateSubjectSchema } from '../schemas/subject.schema.js'

export class SubjectController {
  private service: SubjectService

  constructor(private prisma: PrismaClient) {
    this.service = new SubjectService(prisma)
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)

    const subjects = await this.service.listByUser(userId)

    return reply.status(200).send({
      success: true,
      data: { subjects },
    })
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }

    const subject = await this.service.getById(id, userId)

    return reply.status(200).send({
      success: true,
      data: { subject },
    })
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const validated = createSubjectSchema.parse(request)

    const subject = await this.service.create(userId, validated.body)

    return reply.status(201).send({
      success: true,
      data: { subject },
    })
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }
    const validated = updateSubjectSchema.parse(request)

    const subject = await this.service.update(id, userId, validated.body)

    return reply.status(200).send({
      success: true,
      data: { subject },
    })
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }

    await this.service.delete(id, userId)

    return reply.status(200).send({
      success: true,
      message: 'Subject deleted successfully',
    })
  }
}

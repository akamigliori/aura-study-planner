/**
 * Schedule controller — HTTP request handlers for schedule routes.
 */

import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from '../generated'
import { ScheduleService } from '../services/schedule.service.js'
import { getUserFromRequest } from '../middlewares/auth.middleware.js'
import { createScheduleSchema, updateScheduleSchema } from '../schemas/schedule.schema.js'

export class ScheduleController {
  private service: ScheduleService

  constructor(private prisma: PrismaClient) {
    this.service = new ScheduleService(prisma)
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)

    const schedules = await this.service.listByUser(userId)

    return reply.status(200).send({
      success: true,
      data: { schedules },
    })
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }

    const schedule = await this.service.getById(id, userId)

    return reply.status(200).send({
      success: true,
      data: { schedule },
    })
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const validated = createScheduleSchema.parse(request)

    const schedule = await this.service.create(userId, validated.body)

    return reply.status(201).send({
      success: true,
      data: { schedule },
    })
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }
    const validated = updateScheduleSchema.parse(request)

    const schedule = await this.service.update(id, userId, validated.body)

    return reply.status(200).send({
      success: true,
      data: { schedule },
    })
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }

    await this.service.delete(id, userId)

    return reply.status(200).send({
      success: true,
      message: 'Schedule entry deleted successfully',
    })
  }
}

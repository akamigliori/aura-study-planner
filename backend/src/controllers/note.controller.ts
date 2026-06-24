/**
 * Note controller — HTTP request handlers for note routes.
 */

import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from '../generated/client'
import { NoteService } from '../services/note.service.js'
import { getUserFromRequest } from '../middlewares/auth.middleware.js'
import { createNoteSchema, updateNoteSchema } from '../schemas/note.schema.js'

export class NoteController {
  private service: NoteService

  constructor(private prisma: PrismaClient) {
    this.service = new NoteService(prisma)
  }

  async list(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const notes = await this.service.listByUser(userId)
    return reply.status(200).send({ success: true, data: { notes } })
  }

  async getById(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }
    const note = await this.service.getById(id, userId)
    return reply.status(200).send({ success: true, data: { note } })
  }

  async create(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const validated = createNoteSchema.parse(request)
    const note = await this.service.create(userId, validated.body)
    return reply.status(201).send({ success: true, data: { note } })
  }

  async update(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }
    const validated = updateNoteSchema.parse(request)
    const note = await this.service.update(id, userId, validated.body)
    return reply.status(200).send({ success: true, data: { note } })
  }

  async delete(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }
    await this.service.delete(id, userId)
    return reply.status(200).send({ success: true, message: 'Note deleted successfully' })
  }
}

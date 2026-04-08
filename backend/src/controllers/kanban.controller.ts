/**
 * Kanban controller — HTTP request handlers for kanban routes.
 */

import { FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from './generated/client'
import { KanbanService } from '../services/kanban.service.js'
import { getUserFromRequest } from '../middlewares/auth.middleware.js'
import { createBoardSchema, updateBoardSchema, createTaskSchema, moveTaskSchema } from '../schemas/kanban.schema.js'

export class KanbanController {
  private service: KanbanService

  constructor(private prisma: PrismaClient) {
    this.service = new KanbanService(prisma)
  }

  async listBoards(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const boards = await this.service.listBoards(userId)
    return reply.status(200).send({ success: true, data: { boards } })
  }

  async createBoard(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const validated = createBoardSchema.parse(request)
    const board = await this.service.createBoard(userId, validated.body)
    return reply.status(201).send({ success: true, data: { board } })
  }

  async getBoard(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }
    const board = await this.service.getBoard(id, userId)
    return reply.status(200).send({ success: true, data: { board } })
  }

  async updateBoard(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }
    console.log('[Kanban] updateBoard received:', JSON.stringify(request.body))
    
    try {
      const validated = updateBoardSchema.parse(request)
      console.log('[Kanban] updateBoard validated:', JSON.stringify(validated.body))
      
      const board = await this.service.updateBoard(id, userId, validated.body)
      return reply.status(200).send({ success: true, data: { board } })
    } catch (error) {
      console.error('[Kanban] updateBoard error:', error)
      throw error
    }
  }

  async deleteBoard(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }
    await this.service.deleteBoard(id, userId)
    return reply.status(200).send({ success: true, message: 'Board deleted' })
  }

  async listTasks(request: FastifyRequest, reply: FastifyReply) {
    const { boardId } = request.params as { boardId: string }
    const tasks = await this.service.listTasks(boardId)
    return reply.status(200).send({ success: true, data: { tasks } })
  }

  async createTask(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { boardId } = request.params as { boardId: string }
    const validated = createTaskSchema.parse(request)
    const task = await this.service.createTask(boardId, userId, validated.body)
    return reply.status(201).send({ success: true, data: { task } })
  }

  async moveTask(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }
    console.log('[Kanban] moveTask received:', JSON.stringify(request.body))
    
    const validated = moveTaskSchema.parse(request)
    console.log('[Kanban] moveTask validated:', JSON.stringify(validated.body))
    
    const task = await this.service.moveTask(id, userId, validated.body)
    return reply.status(200).send({ success: true, data: { task } })
  }

  async updateTask(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }
    const task = await this.service.updateTask(id, userId, request.body as Record<string, unknown>)
    return reply.status(200).send({ success: true, data: { task } })
  }

  async deleteTask(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const { id } = request.params as { id: string }
    await this.service.deleteTask(id, userId)
    return reply.status(200).send({ success: true, message: 'Task deleted' })
  }
}

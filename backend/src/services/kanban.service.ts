/**
 * Kanban service — business logic for Kanban boards and tasks.
 */

import { PrismaClient } from '../generated/client'
import { KanbanRepository } from '../repositories/kanban.repository.js'
import { NotFoundError } from '../utils/errors.js'
import type { CreateBoardInput, CreateTaskInput, MoveTaskInput } from '../schemas/kanban.schema.js'

export class KanbanService {
  private repository: KanbanRepository

  constructor(private prisma: PrismaClient) {
    this.repository = new KanbanRepository(prisma)
  }

  // Boards
  async listBoards(userId: string) {
    return this.repository.findBoardsByUserId(userId)
  }

  async createBoard(userId: string, input: CreateBoardInput) {
    return this.repository.createBoard({ ...input, userId })
  }

  async deleteBoard(id: string, userId: string) {
    const board = await this.repository.findBoardByIdAndUserId(id, userId)
    if (!board) throw new NotFoundError('Board')
    return this.repository.deleteBoard(id, userId)
  }

  // Tasks
  async listTasks(boardId: string) {
    return this.repository.findTasksByBoardId(boardId)
  }

  async createTask(boardId: string, userId: string, input: CreateTaskInput) {
    const board = await this.repository.findBoardByIdAndUserId(boardId, userId)
    if (!board) throw new NotFoundError('Board')

    const maxPosition = await this.getMaxPosition(boardId, input.column || 'TODO')

    return this.repository.createTask({
      title: input.title,
      description: input.description,
      boardId,
      userId,
      column: input.column || 'TODO',
      position: maxPosition + 1,
      priority: input.priority || 'MEDIUM',
      dueDate: input.dueDate ? new Date(input.dueDate) : null,
    })
  }

  async moveTask(id: string, userId: string, input: MoveTaskInput) {
    const task = await this.repository.findTaskByIdAndUserId(id, userId)
    if (!task) throw new NotFoundError('Task')

    const position = input.position ?? (await this.getMaxPosition(task.boardId, input.column) + 1)

    return this.repository.updateTask(id, userId, {
      column: input.column,
      position,
    })
  }

  async updateTask(id: string, userId: string, data: Record<string, unknown>) {
    const task = await this.repository.findTaskByIdAndUserId(id, userId)
    if (!task) throw new NotFoundError('Task')
    return this.repository.updateTask(id, userId, data)
  }

  async deleteTask(id: string, userId: string) {
    const task = await this.repository.findTaskByIdAndUserId(id, userId)
    if (!task) throw new NotFoundError('Task')
    return this.repository.deleteTask(id, userId)
  }

  private async getMaxPosition(boardId: string, column: string): Promise<number> {
    const tasks = await this.repository.findTasksByBoardId(boardId)
    const columnTasks = tasks.filter((t) => t.column === column)
    if (columnTasks.length === 0) return 0
    return Math.max(...columnTasks.map((t) => t.position))
  }
}

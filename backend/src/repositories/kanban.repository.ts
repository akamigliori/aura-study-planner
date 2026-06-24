/**
 * Kanban repository — data access layer for KanbanBoard and KanbanTask models.
 */

import { PrismaClient, KanbanBoard, KanbanTask } from '../generated/client'

export class KanbanRepository {
  constructor(private prisma: PrismaClient) {}

  // Boards
  async findBoardsByUserId(userId: string): Promise<KanbanBoard[]> {
    return this.prisma.kanbanBoard.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findBoardByIdAndUserId(
    id: string,
    userId: string
  ): Promise<KanbanBoard | null> {
    return this.prisma.kanbanBoard.findUnique({
      where: { id, userId },
    })
  }

  async createBoard(data: {
    name: string
    description?: string
    userId: string
  }): Promise<KanbanBoard> {
    return this.prisma.kanbanBoard.create({ data })
  }

  async updateBoard(
    id: string,
    userId: string,
    data: Partial<KanbanBoard>
  ): Promise<KanbanBoard> {
    return this.prisma.kanbanBoard.update({
      where: { id, userId },
      data,
    })
  }

  async deleteBoard(id: string, userId: string): Promise<KanbanBoard> {
    return this.prisma.kanbanBoard.delete({
      where: { id, userId },
    })
  }

  // Tasks
  async findTasksByBoardId(boardId: string): Promise<KanbanTask[]> {
    return this.prisma.kanbanTask.findMany({
      where: { boardId },
      orderBy: [{ column: 'asc' }, { position: 'asc' }],
    })
  }

  async findTaskByIdAndUserId(
    id: string,
    userId: string
  ): Promise<KanbanTask | null> {
    return this.prisma.kanbanTask.findUnique({
      where: { id, userId },
    })
  }

  async createTask(data: {
    title: string
    description?: string
    boardId: string
    userId: string
    column?: string
    position?: number
    priority?: string
    dueDate?: Date | null
  }): Promise<KanbanTask> {
    return this.prisma.kanbanTask.create({ data })
  }

  async updateTask(
    id: string,
    userId: string,
    data: Partial<KanbanTask>
  ): Promise<KanbanTask> {
    return this.prisma.kanbanTask.update({
      where: { id, userId },
      data,
    })
  }

  async deleteTask(id: string, userId: string): Promise<KanbanTask> {
    return this.prisma.kanbanTask.delete({
      where: { id, userId },
    })
  }
}

/**
 * Kanban service — business logic for Kanban boards and tasks.
 */

import { PrismaClient } from './generated/client'
import { KanbanRepository } from '../repositories/kanban.repository.js'
import { NotFoundError } from '../utils/errors.js'
import type { CreateBoardInput, UpdateBoardInput, CreateTaskInput, MoveTaskInput } from '../schemas/kanban.schema.js'
import type { KanbanColumnConfig } from '../schemas/kanban.schema.js'

const DEFAULT_COLUMNS: KanbanColumnConfig[] = [
  { id: 'TODO', name: 'A Fazer' },
  { id: 'IN_PROGRESS', name: 'Em Progresso' },
  { id: 'DONE', name: 'Concluído' },
]

export class KanbanService {
  private repository: KanbanRepository

  constructor(private prisma: PrismaClient) {
    this.repository = new KanbanRepository(prisma)
  }

  // Boards
  async listBoards(userId: string) {
    const boards = await this.repository.findBoardsByUserId(userId)
    return boards.map(board => this.parseBoardColumns(board))
  }

  async getBoard(id: string, userId: string) {
    const board = await this.repository.findBoardByIdAndUserId(id, userId)
    if (!board) throw new NotFoundError('Board')
    return this.parseBoardColumns(board)
  }

  async createBoard(userId: string, input: CreateBoardInput) {
    const columns = input.columns ? JSON.stringify(input.columns) : JSON.stringify(DEFAULT_COLUMNS)
    return this.repository.createBoard({ ...input, userId, columns })
  }

  async updateBoard(id: string, userId: string, input: UpdateBoardInput) {
    const board = await this.repository.findBoardByIdAndUserId(id, userId)
    if (!board) throw new NotFoundError('Board')

    const updateData: Record<string, unknown> = {}
    if (input.name !== undefined) updateData.name = input.name
    if (input.description !== undefined) updateData.description = input.description
    if (input.columns !== undefined) updateData.columns = JSON.stringify(input.columns)

    const updated = await this.repository.updateBoard(id, userId, updateData)
    return this.parseBoardColumns(updated)
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

    const oldColumn = task.column
    const oldPosition = task.position
    const newColumn = input.column
    const newPosition = input.position ?? (await this.getMaxPosition(task.boardId, newColumn) + 1)

    if (oldColumn === newColumn) {
      await this.repository.reorderTasksInColumn(task.boardId, oldColumn, oldPosition, newPosition)
    } else {
      await this.repository.shiftTasksInColumn(task.boardId, oldColumn, oldPosition + 1, -1)
      await this.repository.shiftTasksInColumn(task.boardId, newColumn, newPosition, 1)
    }

    return this.repository.updateTask(id, userId, {
      column: newColumn,
      position: newPosition,
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

  private parseBoardColumns(board: any): any {
    try {
      const parsed = board.columns ? JSON.parse(board.columns) : null
      return { ...board, columns: parsed || DEFAULT_COLUMNS }
    } catch {
      return { ...board, columns: DEFAULT_COLUMNS }
    }
  }
}

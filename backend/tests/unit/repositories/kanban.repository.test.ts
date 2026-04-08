import { describe, it, expect, vi, beforeEach } from 'vitest'
import { KanbanRepository } from '../../../src/repositories/kanban.repository'
import type { PrismaClient, KanbanBoard, KanbanTask } from '../../../src/generated'

function createMockPrisma() {
  return {
    kanbanBoard: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    kanbanTask: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      updateMany: vi.fn(),
    },
  } as unknown as PrismaClient
}

describe('KanbanRepository', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>
  let repo: KanbanRepository

  const mockBoard: KanbanBoard = {
    id: 'board-1',
    name: 'Study Board',
    description: 'My tasks',
    columns: '[{"id":"TODO","name":"A Fazer"},{"id":"IN_PROGRESS","name":"Em Progresso"},{"id":"DONE","name":"Concluído"}]',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const mockTask: KanbanTask = {
    id: 'task-1',
    title: 'Study math',
    description: null,
    column: 'TODO',
    position: 0,
    priority: 'MEDIUM',
    dueDate: null,
    boardId: 'board-1',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    repo = new KanbanRepository(mockPrisma)
    vi.clearAllMocks()
  })

  describe('Boards', () => {
    it('should find boards by user', async () => {
      vi.mocked(mockPrisma.kanbanBoard.findMany).mockResolvedValue([mockBoard])

      const result = await repo.findBoardsByUserId('user-1')

      expect(result).toEqual([mockBoard])
    })

    it('should create board', async () => {
      vi.mocked(mockPrisma.kanbanBoard.create).mockResolvedValue(mockBoard)

      const result = await repo.createBoard({
        name: 'Study Board',
        description: 'My tasks',
        userId: 'user-1',
      })

      expect(result).toEqual(mockBoard)
    })

    it('should delete board', async () => {
      vi.mocked(mockPrisma.kanbanBoard.delete).mockResolvedValue(mockBoard)

      const result = await repo.deleteBoard('board-1', 'user-1')

      expect(result).toEqual(mockBoard)
    })
  })

  describe('Tasks', () => {
    it('should find tasks by board', async () => {
      vi.mocked(mockPrisma.kanbanTask.findMany).mockResolvedValue([mockTask])

      const result = await repo.findTasksByBoardId('board-1')

      expect(result).toEqual([mockTask])
    })

    it('should create task', async () => {
      vi.mocked(mockPrisma.kanbanTask.create).mockResolvedValue(mockTask)

      const result = await repo.createTask({
        title: 'Study math',
        boardId: 'board-1',
        userId: 'user-1',
      })

      expect(result).toEqual(mockTask)
    })

    it('should update task', async () => {
      const updated = { ...mockTask, column: 'DONE' }
      vi.mocked(mockPrisma.kanbanTask.update).mockResolvedValue(updated)

      const result = await repo.updateTask('task-1', 'user-1', { column: 'DONE' })

      expect(result.column).toBe('DONE')
    })

    it('should delete task', async () => {
      vi.mocked(mockPrisma.kanbanTask.delete).mockResolvedValue(mockTask)

      const result = await repo.deleteTask('task-1', 'user-1')

      expect(result).toEqual(mockTask)
    })

    it('should reorder tasks in column when moving down', async () => {
      vi.mocked(mockPrisma.kanbanTask.updateMany).mockResolvedValue([])

      await repo.reorderTasksInColumn('board-1', 'TODO', 0, 2)

      expect(mockPrisma.kanbanTask.updateMany).toHaveBeenCalledWith({
        where: {
          boardId: 'board-1',
          column: 'TODO',
          position: { gt: 0, lte: 2 },
        },
        data: { position: { decrement: 1 } },
      })
    })

    it('should reorder tasks in column when moving up', async () => {
      vi.mocked(mockPrisma.kanbanTask.updateMany).mockResolvedValue([])

      await repo.reorderTasksInColumn('board-1', 'TODO', 2, 0)

      expect(mockPrisma.kanbanTask.updateMany).toHaveBeenCalledWith({
        where: {
          boardId: 'board-1',
          column: 'TODO',
          position: { gte: 0, lt: 2 },
        },
        data: { position: { increment: 1 } },
      })
    })

    it('should shift tasks in column with positive delta', async () => {
      vi.mocked(mockPrisma.kanbanTask.updateMany).mockResolvedValue([])

      await repo.shiftTasksInColumn('board-1', 'TODO', 1, 1)

      expect(mockPrisma.kanbanTask.updateMany).toHaveBeenCalledWith({
        where: {
          boardId: 'board-1',
          column: 'TODO',
          position: { gte: 1 },
        },
        data: { position: { increment: 1 } },
      })
    })

    it('should shift tasks in column with negative delta', async () => {
      vi.mocked(mockPrisma.kanbanTask.updateMany).mockResolvedValue([])

      await repo.shiftTasksInColumn('board-1', 'TODO', 1, -1)

      expect(mockPrisma.kanbanTask.updateMany).toHaveBeenCalledWith({
        where: {
          boardId: 'board-1',
          column: 'TODO',
          position: { gte: 1 },
        },
        data: { position: { increment: -1 } },
      })
    })

    it('should not reorder when old and new position are equal', async () => {
      await repo.reorderTasksInColumn('board-1', 'TODO', 1, 1)

      expect(mockPrisma.kanbanTask.updateMany).not.toHaveBeenCalled()
    })

    it('should not shift when delta is zero', async () => {
      await repo.shiftTasksInColumn('board-1', 'TODO', 1, 0)

      expect(mockPrisma.kanbanTask.updateMany).not.toHaveBeenCalled()
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { KanbanService } from '../../../src/services/kanban.service'
import { PrismaClient } from '../../../src/generated'

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
      updateMany: vi.fn(),
      delete: vi.fn(),
    },
  } as unknown as PrismaClient
}

const mockBoardWithColumns = {
  id: 'board-1',
  name: 'Study Board',
  description: 'My tasks',
  columns: '[{"id":"TODO","name":"A Fazer"},{"id":"IN_PROGRESS","name":"Em Progresso"},{"id":"DONE","name":"Concluído"}]',
  userId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

const mockBoardWithoutColumns = {
  id: 'board-2',
  name: 'Simple Board',
  description: null,
  columns: null as any,
  userId: 'user-1',
  createdAt: new Date(),
  updatedAt: new Date(),
}

describe('KanbanService', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>
  let service: KanbanService

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    service = new KanbanService(mockPrisma)
    vi.clearAllMocks()
  })

  describe('Boards', () => {
    it('should list boards with parsed columns', async () => {
      vi.mocked(mockPrisma.kanbanBoard.findMany).mockResolvedValue([mockBoardWithColumns])

      const result = await service.listBoards('user-1')

      expect(result).toHaveLength(1)
      expect(result[0].columns).toEqual([
        { id: 'TODO', name: 'A Fazer' },
        { id: 'IN_PROGRESS', name: 'Em Progresso' },
        { id: 'DONE', name: 'Concluído' },
      ])
    })

    it('should use default columns when columns is null', async () => {
      vi.mocked(mockPrisma.kanbanBoard.findMany).mockResolvedValue([mockBoardWithoutColumns])

      const result = await service.listBoards('user-1')

      expect(result[0].columns).toEqual([
        { id: 'TODO', name: 'A Fazer' },
        { id: 'IN_PROGRESS', name: 'Em Progresso' },
        { id: 'DONE', name: 'Concluído' },
      ])
    })

    it('should create board with default columns when not provided', async () => {
      vi.mocked(mockPrisma.kanbanBoard.create).mockResolvedValue(mockBoardWithColumns)

      const result = await service.createBoard('user-1', { name: 'New Board' })

      expect(mockPrisma.kanbanBoard.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-1',
          name: 'New Board',
          columns: expect.any(String),
        }),
      }))
    })

    it('should create board with custom columns when provided', async () => {
      const customColumns = [
        { id: 'BACKLOG', name: 'Backlog' },
        { id: 'DOING', name: 'Em Desenvolvimento' },
        { id: 'DONE', name: 'Pronto' },
      ]
      vi.mocked(mockPrisma.kanbanBoard.create).mockResolvedValue({ ...mockBoardWithColumns, columns: JSON.stringify(customColumns) })

      await service.createBoard('user-1', { 
        name: 'Custom Board',
        columns: customColumns 
      })

      expect(mockPrisma.kanbanBoard.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-1',
          name: 'Custom Board',
          columns: JSON.stringify(customColumns),
        }),
      }))
    })

    it('should get board by id with parsed columns', async () => {
      vi.mocked(mockPrisma.kanbanBoard.findUnique).mockResolvedValue(mockBoardWithColumns)

      const result = await service.getBoard('board-1', 'user-1')

      expect(result.columns).toEqual([
        { id: 'TODO', name: 'A Fazer' },
        { id: 'IN_PROGRESS', name: 'Em Progresso' },
        { id: 'DONE', name: 'Concluído' },
      ])
    })

    it('should update board columns', async () => {
      const newColumns = [
        { id: 'NEW_COL', name: 'Nova Coluna', color: '#ff0000' },
      ]
      vi.mocked(mockPrisma.kanbanBoard.findUnique).mockResolvedValue(mockBoardWithColumns)
      vi.mocked(mockPrisma.kanbanBoard.update).mockResolvedValue({ ...mockBoardWithColumns, columns: JSON.stringify(newColumns) })

      await service.updateBoard('board-1', 'user-1', { columns: newColumns })

      expect(mockPrisma.kanbanBoard.update).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ id: 'board-1', userId: 'user-1' }),
        data: expect.objectContaining({
          columns: JSON.stringify(newColumns),
        }),
      }))
    })

    it('should update board name and description', async () => {
      vi.mocked(mockPrisma.kanbanBoard.findUnique).mockResolvedValue(mockBoardWithColumns)
      vi.mocked(mockPrisma.kanbanBoard.update).mockResolvedValue({ ...mockBoardWithColumns, name: 'Updated Name' })

      await service.updateBoard('board-1', 'user-1', { 
        name: 'Updated Name',
        description: 'New description'
      })

      expect(mockPrisma.kanbanBoard.update).toHaveBeenCalledWith(expect.objectContaining({
        where: expect.objectContaining({ id: 'board-1', userId: 'user-1' }),
        data: expect.objectContaining({
          name: 'Updated Name',
          description: 'New description',
        }),
      }))
    })
  })

  describe('moveTask', () => {
    const mockTask = {
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

    it('should reorder tasks within same column when moving down', async () => {
      vi.mocked(mockPrisma.kanbanTask.findUnique).mockResolvedValue(mockTask)
      vi.mocked(mockPrisma.kanbanTask.updateMany).mockResolvedValue([])
      vi.mocked(mockPrisma.kanbanTask.update).mockResolvedValue({ ...mockTask, position: 2 })

      await service.moveTask('task-1', 'user-1', { column: 'TODO', position: 2 })

      expect(mockPrisma.kanbanTask.updateMany).toHaveBeenCalledWith({
        where: { boardId: 'board-1', column: 'TODO', position: { gt: 0, lte: 2 } },
        data: { position: { decrement: 1 } },
      })
    })

    it('should reorder tasks within same column when moving up', async () => {
      const taskAtPosition2 = { ...mockTask, position: 2 }
      vi.mocked(mockPrisma.kanbanTask.findUnique).mockResolvedValue(taskAtPosition2)
      vi.mocked(mockPrisma.kanbanTask.updateMany).mockResolvedValue([])
      vi.mocked(mockPrisma.kanbanTask.update).mockResolvedValue({ ...mockTask, position: 0 })

      await service.moveTask('task-1', 'user-1', { column: 'TODO', position: 0 })

      expect(mockPrisma.kanbanTask.updateMany).toHaveBeenCalledWith({
        where: { boardId: 'board-1', column: 'TODO', position: { gte: 0, lt: 2 } },
        data: { position: { increment: 1 } },
      })
    })

    it('should shift tasks in both columns when moving to different column', async () => {
      vi.mocked(mockPrisma.kanbanTask.findUnique).mockResolvedValue(mockTask)
      vi.mocked(mockPrisma.kanbanTask.updateMany).mockResolvedValue([])
      vi.mocked(mockPrisma.kanbanTask.update).mockResolvedValue({ ...mockTask, column: 'IN_PROGRESS', position: 1 })

      await service.moveTask('task-1', 'user-1', { column: 'IN_PROGRESS', position: 1 })

      expect(mockPrisma.kanbanTask.updateMany).toHaveBeenCalledTimes(2)
      expect(mockPrisma.kanbanTask.updateMany).toHaveBeenNthCalledWith(1, {
        where: { boardId: 'board-1', column: 'TODO', position: { gte: 1 } },
        data: { position: { increment: -1 } },
      })
      expect(mockPrisma.kanbanTask.updateMany).toHaveBeenNthCalledWith(2, {
        where: { boardId: 'board-1', column: 'IN_PROGRESS', position: { gte: 1 } },
        data: { position: { increment: 1 } },
      })
    })

    it('should use end of column when position is not provided', async () => {
      vi.mocked(mockPrisma.kanbanTask.findUnique).mockResolvedValue(mockTask)
      vi.mocked(mockPrisma.kanbanTask.findMany).mockResolvedValue([
        { ...mockTask, column: 'IN_PROGRESS', position: 0 },
        { ...mockTask, id: 'task-2', column: 'IN_PROGRESS', position: 1 },
      ])
      vi.mocked(mockPrisma.kanbanTask.updateMany).mockResolvedValue([])
      vi.mocked(mockPrisma.kanbanTask.update).mockResolvedValue({ ...mockTask, column: 'IN_PROGRESS', position: 2 })

      await service.moveTask('task-1', 'user-1', { column: 'IN_PROGRESS' })

      expect(mockPrisma.kanbanTask.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'task-1', userId: 'user-1' },
          data: { column: 'IN_PROGRESS', position: 2 },
        })
      )
    })
  })
})

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useKanbanStore } from '../../store/kanban.store'

// Mock da API
vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

import { api } from '../../lib/api'

const mockBoard = {
  id: 'board-1',
  name: 'Meu Quadro Principal',
  description: 'Quadro inicial',
  userId: 'user-1',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01'
}

const mockTask = {
  id: 'task-1',
  title: 'Estudar React',
  description: null,
  column: 'TODO' as const,
  position: 0,
  priority: 'MEDIUM' as const,
  dueDate: null,
  boardId: 'board-1',
  userId: 'user-1',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01'
}

describe('kanban.store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store state
    useKanbanStore.setState({
      activeBoard: null,
      tasks: [],
      isLoading: false,
      error: null,
    })
  })

  describe('fetchBoardsAndInitialize', () => {
    it('deve buscar boards existentes e setar o primeiro como ativo', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: { boards: [mockBoard] } })
      vi.mocked(api.get).mockResolvedValueOnce({ data: { tasks: [] } })

      await useKanbanStore.getState().fetchBoardsAndInitialize()

      expect(api.get).toHaveBeenCalledWith('/kanban/boards')
      expect(useKanbanStore.getState().activeBoard).toEqual(mockBoard)
    })

    it('deve criar board automaticamente quando não houver nenhum', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: { boards: [] } })
      vi.mocked(api.post).mockResolvedValueOnce({ data: { board: mockBoard } })
      vi.mocked(api.get).mockResolvedValueOnce({ data: { tasks: [] } })

      await useKanbanStore.getState().fetchBoardsAndInitialize()

      expect(api.post).toHaveBeenCalledWith('/kanban/boards', {
        name: 'Meu Quadro Principal',
        description: 'Quadro inicial para gerir suas tarefas.'
      })
      expect(useKanbanStore.getState().activeBoard).toEqual(mockBoard)
    })

    it('deve setar error em caso de falha', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Network Error'))

      await useKanbanStore.getState().fetchBoardsAndInitialize()

      expect(useKanbanStore.getState().error).toBe('Network Error')
      expect(useKanbanStore.getState().isLoading).toBe(false)
    })
  })

  describe('fetchTasks', () => {
    it('deve buscar tarefas do board', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: { tasks: [mockTask] } })

      await useKanbanStore.getState().fetchTasks('board-1')

      expect(api.get).toHaveBeenCalledWith('/kanban/boards/board-1/tasks')
      expect(useKanbanStore.getState().tasks).toEqual([mockTask])
    })
  })

  describe('createTask', () => {
    it('deve criar tarefa e adicionar ao estado', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({ data: { task: mockTask } })

      await useKanbanStore.getState().createTask('board-1', { title: 'Estudar React' })

      expect(api.post).toHaveBeenCalledWith('/kanban/boards/board-1/tasks', { title: 'Estudar React' })
      expect(useKanbanStore.getState().tasks).toContainEqual(mockTask)
    })
  })

  describe('moveTask (Optimistic UI)', () => {
    it('deve mover a tarefa otimisticamente antes do backend confirmar', async () => {
      useKanbanStore.setState({ tasks: [mockTask] })
      vi.mocked(api.put).mockResolvedValueOnce({})

      await useKanbanStore.getState().moveTask('task-1', 'IN_PROGRESS', 0)

      const movedTask = useKanbanStore.getState().tasks.find(t => t.id === 'task-1')
      expect(movedTask?.column).toBe('IN_PROGRESS')
      expect(api.put).toHaveBeenCalledWith('/kanban/tasks/task-1/move', { column: 'IN_PROGRESS', position: 0 })
    })

    it('deve fazer rollback se o backend falhar', async () => {
      useKanbanStore.setState({ tasks: [mockTask] })
      vi.mocked(api.put).mockRejectedValueOnce(new Error('Server Error'))

      await expect(
        useKanbanStore.getState().moveTask('task-1', 'DONE', 0)
      ).rejects.toThrow('Server Error')

      // Rollback: deve voltar ao estado original
      const task = useKanbanStore.getState().tasks.find(t => t.id === 'task-1')
      expect(task?.column).toBe('TODO')
      expect(useKanbanStore.getState().error).toBe('Falha ao mover a tarefa. Operação revertida.')
    })
  })

  describe('deleteTask (Optimistic UI)', () => {
    it('deve deletar tarefa otimisticamente', async () => {
      useKanbanStore.setState({ tasks: [mockTask] })
      vi.mocked(api.delete).mockResolvedValueOnce({})

      await useKanbanStore.getState().deleteTask('task-1')

      expect(useKanbanStore.getState().tasks).toEqual([])
      expect(api.delete).toHaveBeenCalledWith('/kanban/tasks/task-1')
    })

    it('deve fazer rollback se o delete falhar', async () => {
      useKanbanStore.setState({ tasks: [mockTask] })
      vi.mocked(api.delete).mockRejectedValueOnce(new Error('Server Error'))

      await expect(
        useKanbanStore.getState().deleteTask('task-1')
      ).rejects.toThrow('Server Error')

      expect(useKanbanStore.getState().tasks).toContainEqual(mockTask)
      expect(useKanbanStore.getState().error).toBe('Falha ao excluir a tarefa.')
    })
  })
})

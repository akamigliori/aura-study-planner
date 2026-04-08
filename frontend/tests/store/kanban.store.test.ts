import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useKanbanStore } from '../../src/store/kanban.store'

vi.mock('../../src/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

import { api } from '../../src/lib/api'

const mockBoard = {
  id: 'board-1',
  name: 'Meu Quadro Principal',
  description: 'Quadro inicial',
  columns: [
    { id: 'TODO', name: 'A Fazer' },
    { id: 'IN_PROGRESS', name: 'Em Progresso' },
    { id: 'DONE', name: 'Concluído' }
  ],
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

describe('KanbanStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useKanbanStore.setState({
      boards: [],
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
      expect(useKanbanStore.getState().boards).toEqual([mockBoard])
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

  describe('fetchBoards', () => {
    it('deve buscar todos os boards', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: { boards: [mockBoard] } })

      await useKanbanStore.getState().fetchBoards()

      expect(api.get).toHaveBeenCalledWith('/kanban/boards')
      expect(useKanbanStore.getState().boards).toEqual([mockBoard])
    })
  })

  describe('createBoard', () => {
    it('deve criar um novo board e adicionar ao estado', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({ data: { board: mockBoard } })

      const result = await useKanbanStore.getState().createBoard({ name: 'Novo Board' })

      expect(api.post).toHaveBeenCalledWith('/kanban/boards', { name: 'Novo Board' })
      expect(useKanbanStore.getState().boards).toContainEqual(mockBoard)
      expect(result).toEqual(mockBoard)
    })
  })

  describe('updateBoard', () => {
    it('deve atualizar o board otimisticamente', async () => {
      useKanbanStore.setState({ boards: [mockBoard], activeBoard: mockBoard })
      vi.mocked(api.put).mockResolvedValueOnce({ data: { board: { ...mockBoard, name: 'Updated' } } })

      await useKanbanStore.getState().updateBoard('board-1', { name: 'Updated' })

      const board = useKanbanStore.getState().boards.find(b => b.id === 'board-1')
      expect(board?.name).toBe('Updated')
    })
  })

  describe('deleteBoard', () => {
    it('deve deletar o board do estado', async () => {
      useKanbanStore.setState({ boards: [mockBoard] })
      vi.mocked(api.delete).mockResolvedValueOnce({})

      await useKanbanStore.getState().deleteBoard('board-1')

      expect(api.delete).toHaveBeenCalledWith('/kanban/boards/board-1')
      expect(useKanbanStore.getState().boards).toEqual([])
    })
  })

  describe('setActiveBoard', () => {
    it('deve setar o board ativo e buscar suas tarefas', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: { tasks: [mockTask] } })

      await useKanbanStore.getState().setActiveBoard(mockBoard)

      expect(useKanbanStore.getState().activeBoard).toEqual(mockBoard)
    })

    it('deve buscar tarefas apos setar board ativo', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: { tasks: [mockTask] } })

      await useKanbanStore.getState().setActiveBoard(mockBoard)

      expect(api.get).toHaveBeenCalledWith('/kanban/boards/board-1/tasks')
      expect(useKanbanStore.getState().tasks).toEqual([mockTask])
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

  describe('updateTask', () => {
    it('deve atualizar tarefa e atualizar o estado', async () => {
      useKanbanStore.setState({ tasks: [mockTask] })
      const updatedTask = { ...mockTask, title: 'Updated Title', description: 'New description' }
      vi.mocked(api.put).mockResolvedValueOnce({ data: { task: updatedTask } })

      const result = await useKanbanStore.getState().updateTask('task-1', { 
        title: 'Updated Title', 
        description: 'New description' 
      })

      expect(api.put).toHaveBeenCalledWith('/kanban/tasks/task-1', { 
        title: 'Updated Title', 
        description: 'New description' 
      })
      expect(useKanbanStore.getState().tasks[0].title).toBe('Updated Title')
      expect(useKanbanStore.getState().tasks[0].description).toBe('New description')
    })

    it('deve lançar erro se a API falhar', async () => {
      useKanbanStore.setState({ tasks: [mockTask] })
      vi.mocked(api.put).mockRejectedValueOnce(new Error('Server Error'))

      await expect(
        useKanbanStore.getState().updateTask('task-1', { title: 'Updated' })
      ).rejects.toThrow('Server Error')
    })
  })
})

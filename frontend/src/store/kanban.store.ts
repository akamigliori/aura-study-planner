import { create } from 'zustand'
import { api } from '../lib/api'
import type { KanbanBoard, KanbanTask, CreateKanbanTaskData, CreateKanbanBoardData, UpdateKanbanBoardData, UpdateKanbanTaskData, KanbanColumn } from '../types/kanban.types'

interface KanbanStore {
  boards: KanbanBoard[]
  activeBoard: KanbanBoard | null
  tasks: KanbanTask[]
  isLoading: boolean
  error: string | null
  
  fetchBoards: () => Promise<void>
  fetchBoardsAndInitialize: () => Promise<void>
  createBoard: (data: CreateKanbanBoardData) => Promise<KanbanBoard>
  updateBoard: (id: string, data: UpdateKanbanBoardData) => Promise<KanbanBoard>
  deleteBoard: (id: string) => Promise<void>
  setActiveBoard: (board: KanbanBoard) => void
  fetchTasks: (boardId: string) => Promise<void>
  createTask: (boardId: string, data: CreateKanbanTaskData) => Promise<void>
  updateTask: (taskId: string, data: UpdateKanbanTaskData) => Promise<KanbanTask>
  moveTask: (taskId: string, newColumn: KanbanColumn, newPosition: number) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
}

export const useKanbanStore = create<KanbanStore>((set, get) => ({
  boards: [],
  activeBoard: null,
  tasks: [],
  isLoading: false,
  error: null,

  fetchBoards: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get<{ data: { boards: KanbanBoard[] } }>('/kanban/boards')
      const boardsData = response.data?.boards ?? []
      set({ boards: boardsData, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  fetchBoardsAndInitialize: async () => {
    set({ isLoading: true, error: null })
    try {
      let response = await api.get<{ data: { boards: KanbanBoard[] } }>('/kanban/boards')
      let boardsData = response.data?.boards ?? []
      
      // Criar o quadro inicial se vazio
      if (boardsData.length === 0) {
        const createRes = await api.post<{ data: { board: KanbanBoard } }>('/kanban/boards', { name: "Meu Quadro Principal", description: "Quadro inicial para gerir suas tarefas." })
        boardsData = [createRes.data.board]
      }

      const board = boardsData[0] || null
      set({ boards: boardsData, activeBoard: board, isLoading: false })

      // Busca as tarefas assim que achar o board
      if (board) {
        await get().fetchTasks(board.id)
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  createBoard: async (data) => {
    try {
      console.log('[KanbanStore] createBoard called:', JSON.stringify(data))
      const response = await api.post<{ data: { board: KanbanBoard } }>('/kanban/boards', data)
      console.log('[KanbanStore] createBoard response:', response)
      
      const newBoard = response.data.board
      
      set((state) => ({ 
        boards: [...state.boards, newBoard],
        activeBoard: newBoard,
        tasks: []  // Clear tasks when switching to new board
      }))
      
      return newBoard
    } catch (error) {
      console.error('[KanbanStore] createBoard error:', error)
      set({ error: (error as Error).message })
      throw error
    }
  },

  updateBoard: async (id, data) => {
    console.log('[KanbanStore] updateBoard called:', id, JSON.stringify(data))
    const prevBoards = [...get().boards]
    const prevActiveBoard = get().activeBoard
    
    // UI Otimista
    set((state) => ({
      boards: state.boards.map(b => b.id === id ? { ...b, ...data } : b),
      activeBoard: state.activeBoard?.id === id ? { ...state.activeBoard, ...data } : state.activeBoard
    }))

    try {
      console.log('[KanbanStore] Calling API PUT /kanban/boards/', id)
      const response = await api.put<{ data: { board: KanbanBoard } }>(`/kanban/boards/${id}`, data)
      console.log('[KanbanStore] API response:', response)
      set((state) => ({
        boards: state.boards.map(b => b.id === id ? response.data.board : b),
        activeBoard: state.activeBoard?.id === id ? response.data.board : state.activeBoard
      }))
      return response.data.board
    } catch (error) {
      console.error('[KanbanStore] updateBoard error:', error)
      // Rollback
      set({ boards: prevBoards, activeBoard: prevActiveBoard, error: "Falha ao atualizar o quadro." })
      throw error
    }
  },

  deleteBoard: async (id) => {
    const prevBoards = [...get().boards]
    
    set((state) => ({ boards: state.boards.filter(b => b.id !== id) }))

    try {
      await api.delete(`/kanban/boards/${id}`)
    } catch (error) {
      set({ boards: prevBoards, error: "Falha ao excluir o quadro." })
      throw error
    }
  },

  setActiveBoard: (board) => {
    set({ activeBoard: board })
    if (board) {
      get().fetchTasks(board.id)
    }
  },

  fetchTasks: async (boardId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get<{ data: { tasks: KanbanTask[] } }>(`/kanban/boards/${boardId}/tasks`)
      const tasksData = response.data?.tasks ?? []
      set({ tasks: tasksData, isLoading: false })
    } catch (error) {
      // Backend might return 404 or something if tasks empty, let's treat gracefully
      set({ error: (error as Error).message, isLoading: false, tasks: [] })
    }
  },

  createTask: async (boardId, data) => {
    try {
      const response = await api.post<{ data: { task: KanbanTask } }>(`/kanban/boards/${boardId}/tasks`, data)
      set((state) => ({ tasks: [...state.tasks, response.data.task] }))
    } catch (error) {
      set({ error: (error as Error).message })
      throw error
    }
  },

  updateTask: async (taskId, data) => {
    const prevTasks = [...get().tasks]
    
    set((state) => ({
      tasks: state.tasks.map(t => t.id === taskId ? { ...t, ...data } : t)
    }))

    try {
      const response = await api.put<{ data: { task: KanbanTask } }>(`/kanban/tasks/${taskId}`, data)
      set((state) => ({
        tasks: state.tasks.map(t => t.id === taskId ? response.data.task : t)
      }))
      return response.data.task
    } catch (error) {
      set({ tasks: prevTasks, error: "Falha ao atualizar a tarefa." })
      throw error
    }
  },

  moveTask: async (taskId, newColumn, newPosition) => {
    const prevTasks = [...get().tasks]
    const task = get().tasks.find(t => t.id === taskId)
    const oldColumn = task?.column
    const oldPosition = task?.position
    
    set((state) => {
      let updatedTasks = state.tasks
      
      if (oldColumn === newColumn && oldPosition !== undefined) {
        updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, column: newColumn, position: newPosition }
          }
          
          if (t.column === newColumn) {
            let newPos = t.position
            if (oldPosition < newPosition) {
              if (t.position > oldPosition && t.position <= newPosition) {
                newPos = t.position - 1
              }
            } else {
              if (t.position >= newPosition && t.position < oldPosition) {
                newPos = t.position + 1
              }
            }
            return { ...t, position: newPos }
          }
          
          return t
        })
      } else {
        updatedTasks = state.tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, column: newColumn, position: newPosition }
          }
          
          if (oldColumn && oldColumn !== newColumn && t.column === oldColumn && t.position > oldPosition) {
            return { ...t, position: t.position - 1 }
          }
          
          if (t.column === newColumn && t.id !== taskId && t.position >= newPosition) {
            return { ...t, position: t.position + 1 }
          }
          
          return t
        })
      }
      
      return { tasks: updatedTasks }
    })

    try {
      await api.put(`/kanban/tasks/${taskId}/move`, { column: newColumn, position: newPosition })
    } catch (error) {
      set({ tasks: prevTasks, error: "Falha ao mover a tarefa. Operação revertida." })
      throw error
    }
  },

  deleteTask: async (taskId) => {
    const prevTasks = [...get().tasks]
    
    // UI Otimista
    set((state) => ({ tasks: state.tasks.filter(t => t.id !== taskId) }))

    try {
      await api.delete(`/kanban/tasks/${taskId}`)
    } catch (error) {
      // Rollback
      set({ tasks: prevTasks, error: "Falha ao excluir a tarefa." })
      throw error
    }
  }
}))

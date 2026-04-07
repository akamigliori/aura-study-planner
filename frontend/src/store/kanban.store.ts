import { create } from 'zustand'
import { api } from '../lib/api'
import type { KanbanBoard, KanbanTask, CreateKanbanTaskData, KanbanColumn } from '../types/kanban.types'

interface KanbanStore {
  activeBoard: KanbanBoard | null
  tasks: KanbanTask[]
  isLoading: boolean
  error: string | null
  
  fetchBoardsAndInitialize: () => Promise<void>
  fetchTasks: (boardId: string) => Promise<void>
  createTask: (boardId: string, data: CreateKanbanTaskData) => Promise<void>
  moveTask: (taskId: string, newColumn: KanbanColumn, newPosition: number) => Promise<void>
  deleteTask: (taskId: string) => Promise<void>
}

export const useKanbanStore = create<KanbanStore>((set, get) => ({
  activeBoard: null,
  tasks: [],
  isLoading: false,
  error: null,

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
      set({ activeBoard: board, isLoading: false })

      // Busca as tarefas assim que achar o board
      if (board) {
        await get().fetchTasks(board.id)
      }
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
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

  moveTask: async (taskId, newColumn, newPosition) => {
    const prevTasks = [...get().tasks]
    
    // UI Otimista
    set((state) => {
      const taskIndex = state.tasks.findIndex(t => t.id === taskId)
      if (taskIndex === -1) return state
      
      const newTasks = [...state.tasks]
      newTasks[taskIndex] = { ...newTasks[taskIndex], column: newColumn, position: newPosition }
      return { tasks: newTasks }
    })

    try {
      await api.put(`/kanban/tasks/${taskId}/move`, { column: newColumn, position: newPosition })
    } catch (error) {
      // Rollback se falhar
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

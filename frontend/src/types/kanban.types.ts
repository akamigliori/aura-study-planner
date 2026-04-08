export interface KanbanColumnConfig {
  id: string
  name: string
  color?: string
}

export interface KanbanBoard {
  id: string
  name: string
  description: string | null
  columns: KanbanColumnConfig[]
  userId: string
  createdAt: string
  updatedAt: string
}

export type KanbanColumn = string
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'

export interface KanbanTask {
  id: string
  title: string
  description: string | null
  column: KanbanColumn
  position: number
  priority: Priority
  dueDate: string | null
  boardId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateKanbanTaskData {
  title: string
  description?: string
  column?: string
  priority?: Priority
  dueDate?: string | null
}

export interface MoveKanbanTaskData {
  column: KanbanColumn
  position: number
}

export interface UpdateKanbanTaskData {
  title?: string
  description?: string | null
  priority?: Priority
  dueDate?: string | null
  column?: KanbanColumn
}

export interface CreateKanbanBoardData {
  name: string
  description?: string
  columns?: KanbanColumnConfig[]
}

export interface UpdateKanbanBoardData {
  name?: string
  description?: string | null
  columns?: KanbanColumnConfig[]
}

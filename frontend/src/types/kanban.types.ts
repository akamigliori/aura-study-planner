export interface KanbanBoard {
  id: string
  name: string
  description: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export type KanbanColumn = 'TODO' | 'IN_PROGRESS' | 'DONE'
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
  priority?: Priority
  dueDate?: string | null
}

export interface MoveKanbanTaskData {
  column: KanbanColumn
  position: number
}

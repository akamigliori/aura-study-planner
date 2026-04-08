import { useEffect, useState, useMemo } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { useKanbanStore } from '../../store/kanban.store'
import type { KanbanColumn as ColumnType, KanbanTask, KanbanColumnConfig, KanbanBoard, CreateKanbanBoardData, UpdateKanbanTaskData } from '../../types/kanban.types'
import { KanbanColumn } from './KanbanColumn'
import { KanbanTaskForm } from './KanbanTaskForm'
import { KanbanTaskModal } from './KanbanTaskModal'
import { KanbanTaskCard } from './KanbanTaskCard'
import { BoardSelector } from '../../components/kanban/BoardSelector'
import { BoardForm } from '../../components/kanban/BoardForm'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'

const DEFAULT_COLUMNS: KanbanColumnConfig[] = [
  { id: 'TODO', name: 'Para Fazer' },
  { id: 'IN_PROGRESS', name: 'Em Progresso' },
  { id: 'DONE', name: 'Concluído' }
]

export function KanbanPage() {
  const { 
    activeBoard, 
    boards,
    tasks, 
    isLoading, 
    fetchBoardsAndInitialize, 
    createBoard,
    updateBoard,
    deleteBoard,
    createTask, 
    updateTask,
    moveTask, 
    deleteTask 
  } = useKanbanStore()

  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<KanbanTask | null>(null)
  const [isBoardFormOpen, setIsBoardFormOpen] = useState(false)
  const [boardFormMode, setBoardFormMode] = useState<'create' | 'edit'>('create')
  const [editingBoard, setEditingBoard] = useState<KanbanBoard | undefined>(undefined)
  const [targetColumn, setTargetColumn] = useState<ColumnType>('TODO')
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchBoardsAndInitialize()
  }, [fetchBoardsAndInitialize])

  // Debug: log columns when activeBoard changes
  useEffect(() => {
    console.log('[KanbanPage] activeBoard:', activeBoard)
    console.log('[KanbanPage] activeBoard?.columns:', activeBoard?.columns)
  }, [activeBoard])

  const columns = useMemo(() => {
    if (!activeBoard) return DEFAULT_COLUMNS
    if (!activeBoard.columns) return DEFAULT_COLUMNS
    if (!Array.isArray(activeBoard.columns)) {
      console.warn('[KanbanPage] columns is not an array:', activeBoard.columns)
      return DEFAULT_COLUMNS
    }
    return activeBoard.columns
  }, [activeBoard])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const tasksByColumn = useMemo(() => {
    const map = new Map<string, KanbanTask[]>()
    columns.forEach(col => map.set(col.id, []))
    
    const sortedTasks = [...tasks].sort((a, b) => {
      const posDiff = a.position - b.position
      if (posDiff !== 0) return posDiff
      return a.id.localeCompare(b.id)
    })
    sortedTasks.forEach(task => {
      const colTasks = map.get(task.column) || []
      colTasks.push(task)
      map.set(task.column, colTasks)
    })
    
    return map
  }, [tasks, columns])

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    if (task) setActiveTask(task)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const activeTaskId = active.id as string
    const overId = over.id as string

    const activeTask = tasks.find(t => t.id === activeTaskId)
    if (!activeTask) return

    // Is it dropping over a column directly?
    const isOverColumn = columns.some(c => c.id === overId)
    
    let newColumn: string = activeTask.column
    let newPosition = activeTask.position

    if (isOverColumn) {
      newColumn = overId
      const thisColTasks = tasksByColumn.get(newColumn) || []
      newPosition = thisColTasks.length
    } else {
      const overTask = tasks.find(t => t.id === overId)
      if (overTask) {
        newColumn = overTask.column
        const thisColTasks = tasksByColumn.get(newColumn) || []
        const overIndex = thisColTasks.findIndex(t => t.id === overId)
        
        newPosition = overIndex
      }
    }

    if (activeTask.column === newColumn && activeTask.position === newPosition) {
      return // Did not move
    }

    moveTask(activeTask.id, newColumn as ColumnType, newPosition)
  }

  const handleCreateTask = async (data: any) => {
    if (!activeBoard) return
    try {
      await createTask(activeBoard.id, { ...data, column: targetColumn })
      setIsFormOpen(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await deleteTask(taskToDelete)
      } catch (err) {
        console.error(err)
      } finally {
        setTaskToDelete(null)
      }
    }
  }

  const handleEditTask = (task: KanbanTask) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }

  const handleUpdateTask = async (data: UpdateKanbanTaskData) => {
    if (!editingTask) return
    try {
      await updateTask(editingTask.id, data)
      setIsTaskModalOpen(false)
      setEditingTask(null)
    } catch (err) {
      console.error(err)
    }
  }

  const handleCreateBoard = () => {
    setBoardFormMode('create')
    setEditingBoard(undefined)
    setIsBoardFormOpen(true)
  }

  const handleEditBoard = (board: KanbanBoard) => {
    setBoardFormMode('edit')
    setEditingBoard(board)
    setIsBoardFormOpen(true)
  }

  const handleSubmitBoard = async (data: CreateKanbanBoardData) => {
    if (boardFormMode === 'create') {
      const newBoard = await createBoard(data)
      // Seleciona automaticamente o novo board
    } else if (editingBoard) {
      await updateBoard(editingBoard.id, data)
    }
  }

  const handleDeleteBoard = (boardId: string) => {
    setBoardToDelete(boardId)
  }

  const handleConfirmDeleteBoard = async () => {
    if (boardToDelete) {
      try {
        await deleteBoard(boardToDelete)
      } catch (err) {
        console.error(err)
      } finally {
        setBoardToDelete(null)
      }
    }
  }

  if (isLoading && !activeBoard) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BoardSelector
            onCreateBoard={handleCreateBoard}
            onEditBoard={handleEditBoard}
            onDeleteBoard={handleDeleteBoard}
          />
        </div>
        <button
          onClick={() => { setTargetColumn(columns[0]?.id || 'TODO'); setIsFormOpen(true) }}
          className="rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition"
        >
          Nova Tarefa
        </button>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full items-start gap-6">
            {columns.map(col => (
              <KanbanColumn
                key={col.id}
                column={{ id: col.id as ColumnType, title: col.name, color: col.color }}
                tasks={tasksByColumn.get(col.id) || []}
                onAddTask={(colId) => { setTargetColumn(colId); setIsFormOpen(true) }}
                onEditTask={(task) => handleEditTask(task)}
                onDeleteTask={(taskId) => setTaskToDelete(taskId)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask ? <KanbanTaskCard task={activeTask} onDelete={() => {}} /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Nova Tarefa">
        <KanbanTaskForm 
          onSubmit={handleCreateTask} 
          onCancel={() => setIsFormOpen(false)} 
        />
      </Modal>

      <BoardForm
        isOpen={isBoardFormOpen}
        onClose={() => setIsBoardFormOpen(false)}
        onSubmit={handleSubmitBoard}
        initialData={editingBoard}
        mode={boardFormMode}
      />

      <ConfirmDialog
        isOpen={!!boardToDelete}
        title="Excluir Quadro"
        description="Tem certeza que deseja excluir este quadro? Todas as tarefas serão excluídas."
        onConfirm={handleConfirmDeleteBoard}
        onClose={() => setBoardToDelete(null)}
      />

      <KanbanTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => { setIsTaskModalOpen(false); setEditingTask(null) }}
        task={editingTask}
        onSubmit={handleUpdateTask}
      />
    </div>
  )
}

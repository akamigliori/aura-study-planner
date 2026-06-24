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
import type { KanbanColumn as ColumnType, KanbanTask } from '../../types/kanban.types'
import { KanbanColumn } from './KanbanColumn'
import { KanbanTaskForm } from './KanbanTaskForm'
import { KanbanTaskCard } from './KanbanTaskCard'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'

const COLUMNS: { id: ColumnType; title: string }[] = [
  { id: 'TODO', title: 'Para Fazer' },
  { id: 'IN_PROGRESS', title: 'Em Progresso' },
  { id: 'DONE', title: 'Concluído' }
]

export function KanbanPage() {
  const { 
    activeBoard, 
    tasks, 
    isLoading, 
    fetchBoardsAndInitialize, 
    createTask, 
    moveTask, 
    deleteTask 
  } = useKanbanStore()

  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [targetColumn, setTargetColumn] = useState<ColumnType>('TODO')
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchBoardsAndInitialize()
  }, [fetchBoardsAndInitialize])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const tasksByColumn = useMemo(() => {
    const map = new Map<ColumnType, KanbanTask[]>()
    COLUMNS.forEach(col => map.set(col.id, []))
    
    // Ordered by position
    const sortedTasks = [...tasks].sort((a, b) => a.position - b.position)
    sortedTasks.forEach(task => {
      const colTasks = map.get(task.column) || []
      colTasks.push(task)
      map.set(task.column, colTasks)
    })
    
    return map
  }, [tasks])

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
    const isOverColumn = COLUMNS.some(c => c.id === overId)
    
    let newColumn: ColumnType = activeTask.column
    let newPosition = activeTask.position

    if (isOverColumn) {
      newColumn = overId as ColumnType
      const thisColTasks = tasksByColumn.get(newColumn) || []
      newPosition = thisColTasks.length // put at the end
    } else {
      // Dropping over another task
      const overTask = tasks.find(t => t.id === overId)
      if (overTask) {
        newColumn = overTask.column
        const thisColTasks = tasksByColumn.get(newColumn) || []
        const overIndex = thisColTasks.findIndex(t => t.id === overId)
        newPosition = overIndex // Take its position
      }
    }

    if (activeTask.column === newColumn && activeTask.position === newPosition) {
      return // Did not move
    }

    moveTask(activeTask.id, newColumn, newPosition)
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

  if (isLoading && !activeBoard) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-ink-dim mb-[5px]">
            Gestão de tarefas
          </div>
          <h1 className="font-serif text-[26px] font-bold tracking-[-0.02em] text-ink leading-none">
            {activeBoard?.name || 'Kanban'}
          </h1>
        </div>
        <button
          onClick={() => { setTargetColumn('TODO'); setIsFormOpen(true) }}
          className="flex items-center gap-2 bg-forest/10 border border-forest/25 text-forest font-mono text-[9.5px] tracking-[0.07em] uppercase rounded-[4px] px-4 py-[9px] hover:bg-forest/15 transition-colors"
        >
          Nova tarefa
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
            {COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={tasksByColumn.get(col.id) || []}
                onAddTask={(colId) => { setTargetColumn(colId); setIsFormOpen(true) }}
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

      <ConfirmDialog
        isOpen={!!taskToDelete}
        title="Excluir Tarefa"
        description="Tem certeza que deseja excluir esta tarefa? Essa ação não pode ser desfeita."
        onConfirm={handleDeleteTask}
        onClose={() => setTaskToDelete(null)}
      />
    </div>
  )
}

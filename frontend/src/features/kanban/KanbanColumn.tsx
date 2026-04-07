import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import type { KanbanTask, KanbanColumn as ColumnType } from '../../types/kanban.types'
import { KanbanTaskCard } from './KanbanTaskCard'

interface KanbanColumnProps {
  column: {
    id: ColumnType
    title: string
  }
  tasks: KanbanTask[]
  onAddTask: (columnId: ColumnType) => void
  onDeleteTask: (taskId: string) => void
}

export function KanbanColumn({ column, tasks, onAddTask, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef, isOver }: any = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column
    }
  })

  return (
    <div className="flex w-80 flex-col flex-shrink-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-gray-700 dark:text-gray-300">{column.title}</h2>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-400">
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1 text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-md transition-colors"
          title="Nova Tarefa"
        >
          <Plus size={18} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-1 flex-col gap-3 rounded-xl min-h-[150px] p-3 transition-colors ${
          isOver 
            ? 'bg-primary-50/50 dark:bg-primary-900/20 border-2 border-dashed border-primary-300 dark:border-primary-700' 
            : 'bg-gray-100/50 dark:bg-gray-800/30'
        }`}
      >
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanTaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
        
        {tasks.length === 0 && (
          <div className="mt-4 flex flex-col items-center justify-center text-center text-gray-400 dark:text-gray-500">
            <span className="text-sm">Nenhuma tarefa</span>
            <span className="text-xs">Solte aqui ou clique em +</span>
          </div>
        )}
      </div>
    </div>
  )
}

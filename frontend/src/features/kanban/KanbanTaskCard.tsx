import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import type { KanbanTask, Priority } from '../../types/kanban.types'

interface KanbanTaskCardProps {
  task: KanbanTask
  onDelete: (taskId: string) => void
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'LOW':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'
    case 'URGENT':
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

export function KanbanTaskCard({ task, onDelete }: KanbanTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'Task',
      task
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 ring-2 ring-primary-500 rounded-lg bg-gray-100 dark:bg-gray-800 h-24 border border-dashed border-gray-400"
      />
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative flex flex-col gap-2 rounded-lg bg-white/70 dark:bg-gray-800/70 p-3 shadow-sm backdrop-blur-md border border-white/20 dark:border-gray-700/50 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab hover:bg-gray-100 dark:hover:bg-gray-700 rounded p-1 touch-none"
          >
            <GripVertical size={16} className="text-gray-400" />
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white line-clamp-2 leading-tight">
            {task.title}
          </h3>
        </div>
        
        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="pl-8 flex items-center justify-between mt-1">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
      </div>
    </div>
  )
}

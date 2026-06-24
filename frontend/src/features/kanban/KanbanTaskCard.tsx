import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2 } from 'lucide-react'
import type { KanbanTask, Priority } from '../../types/kanban.types'

interface KanbanTaskCardProps {
  task: KanbanTask
  onDelete: (taskId: string) => void
}

const PRIORITY_LABEL: Record<Priority, string> = {
  LOW: 'Baixa',
  MEDIUM: 'Média',
  HIGH: 'Alta',
  URGENT: 'Urgente',
}

const PRIORITY_COLOR: Record<Priority, string> = {
  LOW: '#5B9BE8',
  MEDIUM: '#6E88A4',
  HIGH: '#E08A30',
  URGENT: '#D07070',
}

export function KanbanTaskCard({ task, onDelete }: KanbanTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'Task', task },
  })

  const style = { transform: CSS.Transform.toString(transform), transition }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-40 bg-card2 border border-edge-s rounded-[4px] h-[72px]"
      />
    )
  }

  const priorityColor = PRIORITY_COLOR[task.priority] || '#6E88A4'
  const priorityLabel = PRIORITY_LABEL[task.priority] || task.priority

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative bg-card border border-edge rounded-[4px] px-[13px] py-[11px] hover:border-edge-s transition-colors"
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing mt-[1px] text-ink-dim hover:text-ink-muted touch-none flex-shrink-0"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[12.5px] font-semibold text-ink leading-[1.35] line-clamp-2">
            {task.title}
          </p>
          {task.description && (
            <p className="text-[10.5px] text-ink-muted mt-[3px] line-clamp-2 leading-[1.5]">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-[5px] mt-[7px]">
            <span
              className="font-mono text-[7.5px] tracking-[0.07em] uppercase rounded-[2px] px-[5px] py-[1.5px]"
              style={{
                color: priorityColor,
                background: `${priorityColor}18`,
              }}
            >
              {priorityLabel}
            </span>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="opacity-0 group-hover:opacity-100 p-[3px] text-ink-dim hover:text-red-400 transition-all flex-shrink-0 rounded"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  )
}
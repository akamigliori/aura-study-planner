import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import type { KanbanTask, KanbanColumn as ColumnType } from '../../types/kanban.types'
import { KanbanTaskCard } from './KanbanTaskCard'

interface KanbanColumnProps {
  column: { id: ColumnType; title: string }
  tasks: KanbanTask[]
  onAddTask: (columnId: ColumnType) => void
  onDeleteTask: (taskId: string) => void
}

const COLUMN_COLORS: Record<ColumnType, string> = {
  TODO: '#344F6A',
  IN_PROGRESS: '#E08A30',
  DONE: '#3DAA78',
}

export function KanbanColumn({ column, tasks, onAddTask, onDeleteTask }: KanbanColumnProps) {
  const { setNodeRef, isOver }: any = useDroppable({
    id: column.id,
    data: { type: 'Column', column },
  })

  const color = COLUMN_COLORS[column.id] || '#344F6A'

  return (
    <div className="flex w-72 flex-col flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-[8px]">
          <div
            className="w-[8px] h-[8px] rounded-[2px] flex-shrink-0"
            style={{ background: color }}
          />
          <span className="font-mono text-[9px] tracking-[0.09em] uppercase text-ink-muted font-semibold">
            {column.title}
          </span>
          <span
            className="font-mono text-[8px] px-[5px] py-[1px] rounded-[2px]"
            style={{ background: `${color}18`, color }}
          >
            {tasks.length}
          </span>
        </div>
        <button
          onClick={() => onAddTask(column.id)}
          className="p-1 text-ink-dim hover:text-forest transition-colors rounded"
          title="Nova tarefa"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Column body */}
      <div
        ref={setNodeRef}
        className={[
          'flex flex-1 flex-col gap-[6px] rounded-[5px] min-h-[150px] p-[6px] transition-colors border',
          isOver
            ? 'bg-forest/5 border-forest/30'
            : 'bg-card/50 border-edge',
        ].join(' ')}
        style={{ borderTopWidth: '2px', borderTopColor: color }}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanTaskCard key={task.id} task={task} onDelete={onDeleteTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
            <span className="font-mono text-[9px] text-ink-dim">Nenhuma tarefa</span>
            <button
              onClick={() => onAddTask(column.id)}
              className="mt-2 font-mono text-[8.5px] text-forest/60 hover:text-forest transition-colors"
            >
              + adicionar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
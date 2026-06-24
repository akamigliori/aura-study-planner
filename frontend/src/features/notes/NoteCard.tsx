import { useState } from 'react'
import { Pin, Trash2 } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import type { Note } from '../../types/note.types'

interface NoteCardProps {
  note: Note
  subjectName?: string
  subjectColor?: string
  onDelete: (id: string) => void
  onTogglePin: (id: string) => void
}

export function NoteCard({ note, subjectName, subjectColor, onDelete, onTogglePin }: NoteCardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
        {subjectColor && (
          <div className="absolute inset-y-0 left-0 w-1" style={{ backgroundColor: subjectColor }} />
        )}

        <div className="px-5 pt-5 pb-4 flex flex-col gap-2 flex-1 pl-6">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white leading-snug line-clamp-2">
              {note.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onTogglePin(note.id)}
                aria-label={note.isPinned ? 'Desafixar nota' : 'Fixar nota'}
                className={[
                  'p-1 rounded-md transition-colors',
                  note.isPinned
                    ? 'text-primary-500 dark:text-primary-400'
                    : 'text-gray-300 hover:text-gray-500 dark:text-gray-600 dark:hover:text-gray-400',
                ].join(' ')}
              >
                <Pin className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                aria-label="Excluir nota"
                className="p-1 rounded-md text-gray-300 hover:text-red-500 dark:text-gray-600 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-3 leading-relaxed">
            {note.content}
          </p>

          {(subjectName || note.tags.length > 0) && (
            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
              {subjectName && (
                <Badge
                  className="text-white text-[10px]"
                  style={{ backgroundColor: subjectColor || '#6b7280' } as React.CSSProperties}
                >
                  {subjectName}
                </Badge>
              )}
              {note.tags.map((tag) => (
                <Badge key={tag} variant="default" className="text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Excluir anotação"
        description={`Tem certeza que deseja excluir "${note.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        variant="danger"
        onConfirm={() => onDelete(note.id)}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  )
}

import { useState } from 'react'
import { Pin, Trash2 } from 'lucide-react'
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
  const color = subjectColor || '#344F6A'

  return (
    <>
      <div
        className="group bg-card border border-edge rounded-r-[5px] rounded-b-[5px] overflow-hidden flex flex-col hover:border-edge-s transition-colors"
        style={{ borderLeftWidth: '3px', borderLeftColor: color }}
      >
        <div className="px-4 pt-[12px] pb-[11px] flex flex-col gap-[6px] flex-1">
          {/* Subject tag */}
          {subjectName && (
            <div
              className="inline-flex self-start font-mono text-[7.5px] tracking-[0.08em] uppercase rounded-[2px] px-[5px] py-[1.5px]"
              style={{ color, background: `${color}18` }}
            >
              {subjectName}
            </div>
          )}

          {/* Header row */}
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-serif text-[13px] font-bold tracking-[-0.005em] text-ink leading-[1.3] line-clamp-2 flex-1">
              {note.title}
            </h3>
            <div className="flex items-center gap-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
              <button
                onClick={() => onTogglePin(note.id)}
                aria-label={note.isPinned ? 'Desafixar' : 'Fixar'}
                className={[
                  'p-[4px] rounded transition-colors',
                  note.isPinned ? 'text-forest' : 'text-ink-dim hover:text-ink-muted',
                ].join(' ')}
              >
                <Pin className="w-3 h-3" />
              </button>
              <button
                onClick={() => setConfirmOpen(true)}
                aria-label="Excluir nota"
                className="p-[4px] rounded text-ink-dim hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Content preview */}
          <p className="text-[11px] text-ink-muted line-clamp-3 leading-[1.6]">
            {note.content}
          </p>

          {/* Tags */}
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-[4px] mt-auto pt-1">
              {note.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[7.5px] tracking-[0.06em] bg-card2 border border-edge text-ink-muted rounded-[2px] px-[5px] py-[1.5px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Pinned indicator */}
        {note.isPinned && (
          <div className="border-t border-edge px-4 py-[5px] flex items-center gap-[5px]">
            <Pin className="w-2.5 h-2.5 text-forest" />
            <span className="font-mono text-[7.5px] tracking-[0.07em] uppercase text-forest">
              Fixada
            </span>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Excluir anotação"
        description={`Tem certeza que deseja excluir "${note.title}"?`}
        confirmText="Excluir"
        variant="danger"
        onConfirm={() => onDelete(note.id)}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  )
}
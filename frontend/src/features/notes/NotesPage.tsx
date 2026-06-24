import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Modal } from '../../components/ui/Modal'
import { Input } from '../../components/ui/Input'
import { NoteCard } from './NoteCard'
import { NoteForm } from './NoteForm'
import { NotesEmptyState } from './NotesEmptyState'
import { useNoteStore } from '../../store/note.store'
import { useSubjectStore } from '../../store/subject.store'
import type { CreateNoteData } from '../../types/note.types'

export function NotesPage() {
  const { notes, isLoading, fetchNotes, createNote, deleteNote, togglePin } = useNoteStore()
  const { subjects, fetchSubjects } = useSubjectStore()

  const [query, setQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    fetchNotes()
    fetchSubjects()
  }, [fetchNotes, fetchSubjects])

  const q = query.toLowerCase()
  const filtered = notes
    .filter((n) => (subjectFilter ? n.subjectId === subjectFilter : true))
    .filter((n) =>
      q ? n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) : true,
    )

  const pinned = filtered.filter((n) => n.isPinned)
  const rest = filtered.filter((n) => !n.isPinned)

  function getSubject(subjectId: string | null) {
    if (!subjectId) return undefined
    return subjects.find((s) => s.id === subjectId)
  }

  async function handleCreate(data: CreateNoteData) {
    await createNote(data)
    setIsFormOpen(false)
  }

  return (
    <>
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-end justify-between">
          <div>
            <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-ink-dim mb-[5px]">
              {notes.length} {notes.length === 1 ? 'nota' : 'notas'}
            </div>
            <h1 className="font-serif text-[26px] font-bold tracking-[-0.02em] text-ink leading-none">
              Anotações
            </h1>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 bg-forest/10 border border-forest/25 text-forest font-mono text-[9.5px] tracking-[0.07em] uppercase rounded-[4px] px-4 py-[9px] hover:bg-forest/15 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Nova anotação
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              placeholder="Buscar por título ou conteúdo..."
              icon={<Search className="w-4 h-4" />}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 min-w-[180px]"
          >
            <option value="">Todas as matérias</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 rounded-full border-2 border-primary-500 border-t-transparent animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <NotesEmptyState hasNotes={notes.length > 0} onCreateClick={() => setIsFormOpen(true)} />
        ) : (
          <div className="space-y-6">
            {pinned.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[8.5px] tracking-[0.13em] uppercase text-ink-dim">Fixadas</span>
                  <span className="flex-1 h-px bg-edge" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pinned.map((note) => {
                    const subject = getSubject(note.subjectId)
                    return (
                      <NoteCard
                        key={note.id}
                        note={note}
                        subjectName={subject?.name}
                        subjectColor={subject?.color}
                        onDelete={deleteNote}
                        onTogglePin={togglePin}
                      />
                    )
                  })}
                </div>
              </section>
            )}

            {rest.length > 0 && (
              <section>
                {pinned.length > 0 && (
                  <h2 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                    Outras
                  </h2>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((note) => {
                    const subject = getSubject(note.subjectId)
                    return (
                      <NoteCard
                        key={note.id}
                        note={note}
                        subjectName={subject?.name}
                        subjectColor={subject?.color}
                        onDelete={deleteNote}
                        onTogglePin={togglePin}
                      />
                    )
                  })}
                </div>
              </section>
            )}
          </div>
        )}
    </div>

    <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} title="Nova Anotação">
      <NoteForm onSubmit={handleCreate} onCancel={() => setIsFormOpen(false)} />
    </Modal>
    </>
  )
}

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useSubjectStore } from '../../store/subject.store'
import type { CreateNoteData } from '../../types/note.types'

const noteSchema = z.object({
  title: z.string().min(1, 'Título obrigatório'),
  content: z.string().min(1, 'Conteúdo obrigatório'),
  subjectId: z.string().optional(),
  tags: z.string().optional(),
})

type NoteFormFields = z.infer<typeof noteSchema>

interface NoteFormProps {
  onSubmit: (data: CreateNoteData) => Promise<void>
  onCancel: () => void
}

export function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  const { subjects } = useSubjectStore()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NoteFormFields>({ resolver: zodResolver(noteSchema) })

  async function handleFormSubmit(fields: NoteFormFields) {
    const tags = fields.tags
      ? fields.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : []
    await onSubmit({
      title: fields.title,
      content: fields.content,
      subjectId: fields.subjectId || undefined,
      tags,
    })
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        id="note-title"
        label="Título"
        placeholder="Ex: Regras de derivação"
        {...register('title')}
        error={errors.title?.message}
      />

      <div className="w-full">
        <label
          htmlFor="note-content"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Conteúdo
        </label>
        <textarea
          id="note-content"
          rows={5}
          placeholder="Escreva sua anotação..."
          className={[
            'w-full rounded-lg border px-4 py-2 text-sm resize-none',
            'transition-colors duration-150',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'dark:bg-gray-800 dark:border-gray-600 dark:text-white',
            errors.content
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 dark:border-gray-600',
          ].join(' ')}
          {...register('content')}
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {errors.content.message}
          </p>
        )}
      </div>

      <div className="w-full">
        <label
          htmlFor="note-subject"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Matéria <span className="text-gray-400">(opcional)</span>
        </label>
        <select
          id="note-subject"
          className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          {...register('subjectId')}
        >
          <option value="">Sem matéria</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        id="note-tags"
        label="Tags (opcional)"
        placeholder="Ex: fórmulas, revisão, importante"
        {...register('tags')}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </form>
  )
}

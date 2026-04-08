import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X } from 'lucide-react'
import type { KanbanTask, UpdateKanbanTaskData, Priority } from '../../types/kanban.types'

const taskUpdateSchema = z.object({
  title: z.string().min(1, 'O título é obrigatório'),
  description: z.string().optional().nullable(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  dueDate: z.string().optional().nullable(),
})

type TaskUpdateFormData = z.infer<typeof taskUpdateSchema>

interface KanbanTaskModalProps {
  isOpen: boolean
  onClose: () => void
  task: KanbanTask | null
  onSubmit: (data: UpdateKanbanTaskData) => Promise<void>
}

const getPriorityLabel = (priority: Priority): string => {
  switch (priority) {
    case 'LOW': return 'Baixa'
    case 'MEDIUM': return 'Média'
    case 'HIGH': return 'Alta'
    case 'URGENT': return 'Urgente'
  }
}

export function KanbanTaskModal({ isOpen, onClose, task, onSubmit }: KanbanTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TaskUpdateFormData>({
    resolver: zodResolver(taskUpdateSchema),
    defaultValues: {
      title: '',
      description: null,
      priority: 'MEDIUM',
      dueDate: null,
    }
  })

  useEffect(() => {
    if (isOpen && task) {
      reset({
        title: task.title,
        description: task.description || null,
        priority: task.priority,
        dueDate: task.dueDate || null,
      })
    }
  }, [isOpen, task, reset])

  const handleFormSubmit = async (data: TaskUpdateFormData) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        title: data.title,
        description: data.description || undefined,
        priority: data.priority,
        dueDate: data.dueDate || undefined,
      })
      onClose()
    } catch (error) {
      console.error('Failed to update task:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:text-white sm:text-sm"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={4}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:text-white sm:text-sm resize-none"
              placeholder="Adicione detalhes sobre a tarefa..."
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Prioridade
            </label>
            <select
              id="priority"
              {...register('priority')}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:text-white sm:text-sm"
            >
              <option value="LOW">{getPriorityLabel('LOW')}</option>
              <option value="MEDIUM">{getPriorityLabel('MEDIUM')}</option>
              <option value="HIGH">{getPriorityLabel('HIGH')}</option>
              <option value="URGENT">{getPriorityLabel('URGENT')}</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data Limite
            </label>
            <input
              id="dueDate"
              type="date"
              {...register('dueDate')}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:text-white sm:text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

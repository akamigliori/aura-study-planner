import { useState, useEffect } from 'react'
import { Plus, X, GripVertical } from 'lucide-react'
import type { KanbanBoard, KanbanColumnConfig, CreateKanbanBoardData } from '../../types/kanban.types'

interface BoardFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CreateKanbanBoardData) => Promise<void>
  initialData?: KanbanBoard
  mode: 'create' | 'edit'
}

const DEFAULT_COLUMNS: KanbanColumnConfig[] = [
  { id: 'TODO', name: 'A Fazer' },
  { id: 'IN_PROGRESS', name: 'Em Progresso' },
  { id: 'DONE', name: 'Concluído' }
]

const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#22c55e', 
  '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', 
  '#a855f7', '#ec4899', '#f43f5e'
]

export function BoardForm({ isOpen, onClose, onSubmit, initialData, mode }: BoardFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [columns, setColumns] = useState<KanbanColumnConfig[]>(DEFAULT_COLUMNS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialData) {
        setName(initialData.name)
        setDescription(initialData.description || '')
        setColumns(initialData.columns || DEFAULT_COLUMNS)
      } else {
        setName('')
        setDescription('')
        setColumns(DEFAULT_COLUMNS)
      }
      setError(null)
    }
  }, [isOpen, mode, initialData])

  const handleAddColumn = () => {
    const newId = `COL_${Date.now()}`
    setColumns([...columns, { id: newId, name: 'Nova Coluna' }])
  }

  const handleRemoveColumn = (index: number) => {
    if (columns.length <= 1) return
    setColumns(columns.filter((_, i) => i !== index))
  }

  const handleColumnChange = (index: number, field: 'name' | 'color', value: string) => {
    setColumns(columns.map((col, i) => 
      i === index ? { ...col, [field]: value } : col
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name.trim()) {
      setError('Nome é obrigatório')
      return
    }

    if (columns.length === 0) {
      setError('Adicione pelo menos uma coluna')
      return
    }

    const submitData = {
      name: name.trim(),
      description: description.trim() || undefined,
      columns
    }
    
    console.log('[BoardForm] Submitting:', JSON.stringify(submitData))

    setIsSubmitting(true)
    setError(null)

    try {
      await onSubmit(submitData)
      onClose()
    } catch (err) {
      console.error('[BoardForm] Submit error:', err)
      setError((err as Error).message || 'Erro ao salvar')
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
            {mode === 'create' ? 'Criar Novo Quadro' : 'Editar Quadro'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome do Quadro *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Estudos 2024"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição opcional..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Colunas
            </label>
            <div className="space-y-2">
              {columns.map((column, index) => (
                <div key={column.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="cursor-grab text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <GripVertical size={16} />
                  </div>
                  <input
                    type="color"
                    value={column.color || '#6366f1'}
                    onChange={(e) => handleColumnChange(index, 'color', e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={column.name}
                    onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                    placeholder="Nome da coluna"
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveColumn(index)}
                    disabled={columns.length <= 1}
                    className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddColumn}
              className="mt-2 flex items-center gap-1 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
            >
              <Plus size={16} />
              Adicionar coluna
            </button>
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
              {isSubmitting ? 'Salvando...' : mode === 'create' ? 'Criar Quadro' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

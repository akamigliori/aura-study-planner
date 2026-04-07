import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2, Clock } from 'lucide-react'
import { useScheduleStore } from '../../store/schedule.store'
import { useSubjectStore } from '../../store/subject.store'
import { ScheduleForm } from './ScheduleForm'
import { Modal } from '../../components/ui/Modal'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import type { ScheduleBlock } from '../../types/schedule.types'

const DAYS = [
  { value: 1, label: 'Segunda' },
  { value: 2, label: 'Terça' },
  { value: 3, label: 'Quarta' },
  { value: 4, label: 'Quinta' },
  { value: 5, label: 'Sexta' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' }
]

export function SchedulePage() {
  const { blocks, isLoading, fetchSchedule, addBlock, updateBlock, deleteBlock } = useScheduleStore()
  const { subjects, fetchSubjects } = useSubjectStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null)
  const [targetDay, setTargetDay] = useState<number>(1)
  
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchSchedule()
    if (subjects.length === 0) {
      fetchSubjects()
    }
  }, [fetchSchedule, fetchSubjects, subjects.length])

  const handleOpenNew = (dayValue: number) => {
    setEditingBlock(null)
    setTargetDay(dayValue)
    setIsFormOpen(true)
  }

  const handleOpenEdit = (block: ScheduleBlock) => {
    setEditingBlock(block)
    setIsFormOpen(true)
  }

  const handleCreateOrUpdate = async (data: any) => {
    if (editingBlock) {
      await updateBlock(editingBlock.id, data)
    } else {
      await addBlock(data)
    }
    setIsFormOpen(false)
    setEditingBlock(null)
  }

  const handleDelete = async () => {
    if (blockToDelete) {
      await deleteBlock(blockToDelete)
    }
  }

  // Ordenar blocos pelo horário de início
  const sortedBlocks = [...blocks].sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Cronograma
          </h1>
          <p className="text-gray-500 text-sm mt-1">Organize sua semana de estudos</p>
        </div>
        <Button onClick={() => handleOpenNew(1)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Agendamento
        </Button>
      </div>

      {isLoading && blocks.length === 0 ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 rounded-full border-b-2 border-primary-500 animate-spin" />
        </div>
      ) : (
        <div className="flex bg-white dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-white/5 overflow-x-auto pb-4 shadow-sm h-full min-h-[600px]">
          {DAYS.map(day => {
            const dayBlocks = sortedBlocks.filter(b => b.dayOfWeek === day.value)
            
            return (
              <div key={day.value} className="flex-1 min-w-[200px] border-r border-gray-100 dark:border-white/5 last:border-0 p-4">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100 dark:border-white/5">
                  <h3 className="font-semibold text-gray-700 dark:text-gray-300">
                    {day.label}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                      {dayBlocks.length}
                    </span>
                    <button 
                      onClick={() => handleOpenNew(day.value)}
                      className="text-gray-400 hover:text-primary-500 transition-colors"
                      title="Adicionar aula neste dia"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {dayBlocks.length === 0 ? (
                    <div className="text-center py-8 text-sm text-gray-400 dark:text-gray-500 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                      Livre
                    </div>
                  ) : (
                    dayBlocks.map(block => {
                      const subject = subjects.find(s => s.id === block.subjectId)
                      const color = subject?.color || '#cbd5e1'
                      
                      return (
                        <div 
                          key={block.id} 
                          className="group relative p-3 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-white/10 transition-all shadow-sm hover:shadow"
                          style={{ backgroundColor: `${color}15`, borderLeftWidth: '4px', borderLeftColor: color }}
                        >
                          <div className="flex items-start justify-between absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-lg p-1 shadow-sm">
                            <button 
                              onClick={() => handleOpenEdit(block)}
                              className="p-1.5 text-gray-500 hover:text-primary-500 transition-colors"
                            >
                              <Edit2 className="w-3" />
                            </button>
                            <button 
                              onClick={() => { setBlockToDelete(block.id); setIsConfirmOpen(true) }}
                              className="p-1.5 text-gray-500 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3" />
                            </button>
                          </div>

                          <div className="font-semibold text-gray-900 dark:text-white text-sm">
                            {subject?.name || 'Matéria Desconhecida'}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 mt-2 gap-1 font-medium">
                            <Clock className="w-3 h-3" />
                            {block.startTime} - {block.endTime}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)}
        title={editingBlock ? "Editar Estudo" : "Agendar Estudo"}
      >
        <ScheduleForm 
          initialData={editingBlock || undefined}
          initialDay={targetDay}
          onSubmit={handleCreateOrUpdate}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Cancelar Estudo"
        description="Tem certeza que deseja remover este horário do seu cronograma?"
        onConfirm={handleDelete}
        onClose={() => { setIsConfirmOpen(false); setBlockToDelete(null) }}
      />
    </div>
  )
}

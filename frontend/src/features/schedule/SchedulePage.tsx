import { useEffect, useState } from 'react'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { useScheduleStore } from '../../store/schedule.store'
import { useSubjectStore } from '../../store/subject.store'
import { ScheduleForm } from './ScheduleForm'
import { Modal } from '../../components/ui/Modal'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import type { ScheduleBlock } from '../../types/schedule.types'

const DAYS = [
  { value: 1, label: 'Seg', full: 'Segunda' },
  { value: 2, label: 'Ter', full: 'Terça' },
  { value: 3, label: 'Qua', full: 'Quarta' },
  { value: 4, label: 'Qui', full: 'Quinta' },
  { value: 5, label: 'Sex', full: 'Sexta' },
  { value: 6, label: 'Sáb', full: 'Sábado' },
  { value: 0, label: 'Dom', full: 'Domingo' },
]

const todayDow = new Date().getDay()

export function SchedulePage() {
  const { blocks, isLoading, fetchSchedule, addBlock, updateBlock, deleteBlock } =
    useScheduleStore()
  const { subjects, fetchSubjects } = useSubjectStore()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBlock, setEditingBlock] = useState<ScheduleBlock | null>(null)
  const [targetDay, setTargetDay] = useState<number>(1)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [blockToDelete, setBlockToDelete] = useState<string | null>(null)

  useEffect(() => {
    fetchSchedule()
    if (subjects.length === 0) fetchSubjects()
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
    if (blockToDelete) await deleteBlock(blockToDelete)
  }

  const sortedBlocks = [...blocks].sort((a, b) => a.startTime.localeCompare(b.startTime))

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex items-end justify-between mb-7">
        <div>
          <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-ink-dim mb-[5px]">
            Cronograma
          </div>
          <h1 className="font-serif text-[26px] font-bold tracking-[-0.02em] text-ink leading-none">
            Semana de estudos
          </h1>
        </div>
        <button
          onClick={() => handleOpenNew(1)}
          className="flex items-center gap-2 bg-forest/10 border border-forest/25 text-forest font-mono text-[9.5px] tracking-[0.07em] uppercase rounded-[4px] px-4 py-[9px] hover:bg-forest/15 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Novo agendamento
        </button>
      </div>

      {isLoading && blocks.length === 0 ? (
        <div className="flex justify-center p-12">
          <div className="w-6 h-6 rounded-full border-2 border-edge border-t-forest animate-spin" />
        </div>
      ) : (
        <div className="bg-card border border-edge rounded-[5px] overflow-hidden flex-1 min-h-[560px]">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-edge bg-shell">
            {DAYS.map((day) => {
              const isToday = day.value === todayDow
              return (
                <div
                  key={day.value}
                  className={[
                    'px-2 py-[7px] border-r border-edge last:border-r-0',
                    isToday ? 'bg-forest/10' : '',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'font-mono text-[8.5px] tracking-[0.07em] uppercase',
                      isToday ? 'text-forest' : 'text-ink-dim',
                    ].join(' ')}
                  >
                    {day.label}
                  </div>
                  <div
                    className={[
                      'font-mono text-[10px] mt-[2px] tabular',
                      isToday ? 'text-forest' : 'text-ink-muted',
                    ].join(' ')}
                  >
                    {day.full}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Day columns */}
          <div className="grid grid-cols-7 h-full min-h-[400px]">
            {DAYS.map((day) => {
              const dayBlocks = sortedBlocks.filter((b) => b.dayOfWeek === day.value)
              const isToday = day.value === todayDow

              return (
                <div
                  key={day.value}
                  className={[
                    'border-r border-edge last:border-r-0 p-[5px] flex flex-col gap-[3px]',
                    isToday ? 'bg-forest/[.03]' : '',
                  ].join(' ')}
                >
                  {dayBlocks.length === 0 ? (
                    <button
                      onClick={() => handleOpenNew(day.value)}
                      className="flex-1 flex items-center justify-center text-ink-dim hover:text-forest transition-colors opacity-0 hover:opacity-100 group-hover:opacity-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      {dayBlocks.map((block) => {
                        const subject = subjects.find((s) => s.id === block.subjectId)
                        const color = subject?.color || '#344F6A'
                        const bgAlpha = `${color}14`

                        return (
                          <div
                            key={block.id}
                            className="group relative rounded-[1px] px-[6px] py-[4px]"
                            style={{
                              borderLeftWidth: '3px',
                              borderLeftColor: color,
                              backgroundColor: bgAlpha,
                            }}
                          >
                            <div className="text-[9.5px] font-semibold text-ink leading-tight truncate">
                              {subject?.name || 'Matéria'}
                            </div>
                            <div className="font-mono text-[7.5px] text-ink-muted mt-[1px]">
                              {block.startTime} – {block.endTime}
                            </div>

                            {/* Hover actions */}
                            <div className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 flex gap-[2px] transition-opacity">
                              <button
                                onClick={() => handleOpenEdit(block)}
                                className="p-[3px] bg-card rounded text-ink-dim hover:text-forest"
                              >
                                <Edit2 className="w-2.5 h-2.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setBlockToDelete(block.id)
                                  setIsConfirmOpen(true)
                                }}
                                className="p-[3px] bg-card rounded text-ink-dim hover:text-red-400"
                              >
                                <Trash2 className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        )
                      })}

                      <button
                        onClick={() => handleOpenNew(day.value)}
                        className="mt-auto px-1 py-[3px] text-ink-dim hover:text-forest transition-colors flex items-center justify-center opacity-40 hover:opacity-100"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingBlock ? 'Editar horário' : 'Agendar estudo'}
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
        title="Remover horário"
        description="Tem certeza que deseja remover este horário do cronograma?"
        onConfirm={handleDelete}
        onClose={() => {
          setIsConfirmOpen(false)
          setBlockToDelete(null)
        }}
      />
    </div>
  )
}
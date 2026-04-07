import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { useSubjectStore } from '../../store/subject.store'

const scheduleSchema = z.object({
  dayOfWeek: z.number().min(0, 'Dia inválido').max(6, 'Dia inválido'),
  startTime: z.string().min(5, 'Horário inicial é obrigatório (ex: 14:00)'),
  endTime: z.string().min(5, 'Horário final é obrigatório (ex: 16:00)'),
  subjectId: z.string().min(1, 'Atribuir uma matéria é obrigatório')
})

type ScheduleFormData = z.infer<typeof scheduleSchema>

interface ScheduleFormProps {
  initialData?: { dayOfWeek?: number; startTime?: string; endTime?: string; subjectId?: string }
  initialDay?: number
  onSubmit: (data: ScheduleFormData) => void
  onCancel: () => void
}

export function ScheduleForm({ initialData, initialDay = 1, onSubmit, onCancel }: ScheduleFormProps) {
  const { subjects } = useSubjectStore()
  
  const { register, handleSubmit, formState: { errors } } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: {
      dayOfWeek: initialData?.dayOfWeek ?? initialDay,
      startTime: initialData?.startTime || '08:00',
      endTime: initialData?.endTime || '09:00',
      subjectId: initialData?.subjectId || ''
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="subjectId" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Matéria
        </label>
        <select
          id="subjectId"
          {...register('subjectId')}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:text-white sm:text-sm"
        >
          <option value="">Selecione uma matéria</option>
          {subjects.map(sub => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
        {errors.subjectId && <span className="text-sm text-red-500 mt-1">{errors.subjectId.message}</span>}
      </div>

      <div>
        <label htmlFor="dayOfWeek" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Dia da Semana
        </label>
        <select
          id="dayOfWeek"
          {...register('dayOfWeek', { valueAsNumber: true })}
          className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-2 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:text-white sm:text-sm"
        >
          <option value="1">Segunda-feira</option>
          <option value="2">Terça-feira</option>
          <option value="3">Quarta-feira</option>
          <option value="4">Quinta-feira</option>
          <option value="5">Sexta-feira</option>
          <option value="6">Sábado</option>
          <option value="0">Domingo</option>
        </select>
        {errors.dayOfWeek && <span className="text-sm text-red-500 mt-1">{errors.dayOfWeek.message}</span>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Início
          </label>
          <Input 
            id="startTime" 
            type="time"
            {...register('startTime')} 
            error={errors.startTime?.message}
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Término
          </label>
          <Input 
            id="endTime" 
            type="time"
            {...register('endTime')} 
            error={errors.endTime?.message}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="secondary" type="button" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  )
}

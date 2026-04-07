import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const subjectSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  color: z.string().min(1, 'Cor é obrigatória'),
  icon: z.string().optional()
})

type SubjectFormData = z.infer<typeof subjectSchema>

interface SubjectFormProps {
  initialData?: { name?: string; color?: string; icon?: string | null }
  onSubmit: (data: SubjectFormData) => void
  onCancel: () => void
}

export function SubjectForm({ initialData, onSubmit, onCancel }: SubjectFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      name: initialData?.name || '',
      color: initialData?.color || '#3b82f6',
      icon: initialData?.icon || ''
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Nome
        </label>
        <Input 
          id="name" 
          placeholder="Ex: Matemática" 
          {...register('name')} 
          error={errors.name?.message}
        />
      </div>

      <div className="flex items-center gap-4">
        <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Cor
        </label>
        <input 
          id="color" 
          type="color" 
          {...register('color')}
          className="h-10 w-20 cursor-pointer rounded border border-gray-300 dark:border-gray-600 p-1"
        />
        {errors.color && <span className="text-sm text-red-500">{errors.color.message}</span>}
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

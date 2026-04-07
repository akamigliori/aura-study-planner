import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'

const topicSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional()
})

type TopicFormData = z.infer<typeof topicSchema>

interface TopicFormProps {
  initialData?: { name?: string; description?: string | null }
  onSubmit: (data: TopicFormData) => void
  onCancel: () => void
}

export function TopicForm({ initialData, onSubmit, onCancel }: TopicFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<TopicFormData>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || ''
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Nome do Tópico
        </label>
        <Input 
          id="name" 
          placeholder="Ex: Equações de 2º Grau" 
          {...register('name')} 
          error={errors.name?.message}
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Descrição (Opcional)
        </label>
        <Input 
          id="description" 
          placeholder="Ex: Fórmula de Bhaskara e propriedades das raízes" 
          {...register('description')} 
          error={errors.description?.message}
        />
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

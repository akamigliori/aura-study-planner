import { BookCheck } from 'lucide-react'

export function ReviewEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center mb-5">
        <BookCheck className="w-8 h-8 text-violet-500 dark:text-violet-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Nenhuma revisão pendente
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
        Você está em dia. As próximas revisões aparecerão aqui assim que chegarem.
      </p>
    </div>
  )
}

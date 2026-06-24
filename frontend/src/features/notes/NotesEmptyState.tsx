import { FileText } from 'lucide-react'

interface NotesEmptyStateProps {
  hasNotes: boolean
  onCreateClick: () => void
}

export function NotesEmptyState({ hasNotes, onCreateClick }: NotesEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 rounded-full bg-gray-100 dark:bg-gray-800 p-5">
        <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      {hasNotes ? (
        <>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
            Nenhuma nota encontrada
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Tente ajustar o filtro ou a busca.
          </p>
        </>
      ) : (
        <>
          <h3 className="text-base font-semibold text-gray-700 dark:text-gray-300">
            Nenhuma anotação ainda
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Crie sua primeira nota para começar.
          </p>
          <button
            onClick={onCreateClick}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium"
          >
            + Nova Anotação
          </button>
        </>
      )}
    </div>
  )
}

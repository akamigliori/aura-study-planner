import { Trophy } from 'lucide-react'
import type { ReviewSession } from '../../types/review.types'

interface ReviewSessionCompleteProps {
  session: ReviewSession
  onRestart: () => void
}

export function ReviewSessionComplete({ session, onRestart }: ReviewSessionCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-6">
        <Trophy className="w-10 h-10 text-amber-500 dark:text-amber-400" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        Sessão concluída!
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-10">
        Você revisou {session.completed}{' '}
        {session.completed === 1 ? 'tópico' : 'tópicos'} nesta sessão.
      </p>

      <div className="flex gap-10 mb-10">
        <div className="text-center">
          <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
            {session.completed}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">
            Concluídas
          </p>
        </div>
        {session.skipped > 0 && (
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">
              {session.skipped}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 uppercase tracking-wide">
              Puladas
            </p>
          </div>
        )}
      </div>

      <button
        onClick={onRestart}
        className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium transition-colors"
      >
        Nova sessão
      </button>
    </div>
  )
}

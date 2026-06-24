interface ReviewProgressProps {
  completed: number
  total: number
}

export function ReviewProgress({ completed, total }: ReviewProgressProps) {
  const percentage = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-500 dark:text-gray-400">Progresso</span>
        <span className="font-semibold tabular-nums text-gray-700 dark:text-gray-200">
          {completed} / {total}
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-violet-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={completed}
          aria-valuemin={0}
          aria-valuemax={total}
        />
      </div>
    </div>
  )
}

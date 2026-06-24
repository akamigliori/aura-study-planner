interface ReviewProgressProps {
  completed: number
  total: number
}

export function ReviewProgress({ completed, total }: ReviewProgressProps) {
  const pct = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1">
        <div className="h-[2px] bg-edge rounded-full overflow-hidden">
          <div
            className="h-full bg-forest rounded-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={completed}
            aria-valuemin={0}
            aria-valuemax={total}
          />
        </div>
      </div>
      <div className="font-mono text-[9.5px] text-ink-muted flex-shrink-0 tabular">
        {completed} de {total} revisadas
      </div>
    </div>
  )
}
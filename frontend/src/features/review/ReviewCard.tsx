import { Flame, Clock } from 'lucide-react'
import type { Review, ReviewQuality } from '../../types/review.types'

interface QualityOption {
  quality: ReviewQuality
  label: string
  hint: string
  className: string
}

const QUALITY_OPTIONS: QualityOption[] = [
  {
    quality: 0,
    label: 'De Novo',
    hint: 'Não lembrei',
    className:
      'border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800/60 dark:text-red-400 dark:hover:bg-red-950/40',
  },
  {
    quality: 2,
    label: 'Difícil',
    hint: 'Com bastante esforço',
    className:
      'border-orange-200 text-orange-700 hover:bg-orange-50 dark:border-orange-800/60 dark:text-orange-400 dark:hover:bg-orange-950/40',
  },
  {
    quality: 4,
    label: 'Bom',
    hint: 'Com alguma pausa',
    className:
      'border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800/60 dark:text-blue-400 dark:hover:bg-blue-950/40',
  },
  {
    quality: 5,
    label: 'Fácil',
    hint: 'Lembrei bem!',
    className:
      'border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800/60 dark:text-emerald-400 dark:hover:bg-emerald-950/40',
  },
]

function formatLastReview(lastReview: string | null): string {
  if (!lastReview) return 'Primeira revisão'
  const diffDays = Math.floor(
    (Date.now() - new Date(lastReview).getTime()) / 86_400_000,
  )
  if (diffDays === 0) return 'Revisada hoje'
  if (diffDays === 1) return 'Revisada ontem'
  if (diffDays < 30) return `Há ${diffDays} dias`
  const months = Math.floor(diffDays / 30)
  return `Há ${months} ${months === 1 ? 'mês' : 'meses'}`
}

interface ReviewCardProps {
  review: Review
  onAnswer: (quality: ReviewQuality) => void
  onSkip: () => void
  isLoading: boolean
  subjectColor?: string
}

export function ReviewCard({
  review,
  onAnswer,
  onSkip,
  isLoading,
  subjectColor,
}: ReviewCardProps) {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {subjectColor && (
        <div
          className="absolute inset-y-0 left-0 w-1"
          style={{ backgroundColor: subjectColor }}
        />
      )}

      <div className="px-8 py-7">
        {/* Meta row */}
        <div className="flex items-center justify-between mb-8 text-sm text-gray-400 dark:text-gray-500">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {formatLastReview(review.lastReview)}
          </span>
          {review.streak > 0 && (
            <span className="flex items-center gap-1 text-orange-500 dark:text-orange-400 font-medium">
              <Flame className="w-3.5 h-3.5" />
              {review.streak}
            </span>
          )}
        </div>

        {/* Topic name */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
            {review.topic.name}
          </h2>
          {review.topic.description && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              {review.topic.description}
            </p>
          )}
        </div>

        {/* Prompt */}
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
          Como foi sua lembrança?
        </p>

        {/* Quality buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          {QUALITY_OPTIONS.map(({ quality, label, hint, className }) => (
            <button
              key={quality}
              onClick={() => onAnswer(quality)}
              disabled={isLoading}
              className={`
                px-4 py-3 rounded-xl border-2 text-left transition-colors duration-150
                disabled:opacity-40 disabled:cursor-not-allowed
                ${className}
              `}
            >
              <span className="block text-sm font-semibold">{label}</span>
              <span className="block text-xs mt-0.5 opacity-70">{hint}</span>
            </button>
          ))}
        </div>

        {/* Skip */}
        <div className="mt-5 text-right">
          <button
            onClick={onSkip}
            disabled={isLoading}
            className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors disabled:opacity-40"
          >
            Pular para depois →
          </button>
        </div>
      </div>
    </div>
  )
}

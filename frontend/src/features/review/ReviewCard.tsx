import type { Review, ReviewQuality } from '../../types/review.types'

// Intervalos SM-2 aproximados por qualidade — mostrados nos botões
const QUALITY_OPTIONS = [
  {
    quality: 0 as ReviewQuality,
    label: 'De Novo',
    interval: 'repetir hoje',
    style: {
      border: '1.5px solid #3A1E1E',
      background: 'rgba(180,50,50,.08)',
      color: '#D07070',
    },
  },
  {
    quality: 2 as ReviewQuality,
    label: 'Difícil',
    interval: 'em 1 dia',
    style: {
      border: '1.5px solid #3A2A10',
      background: 'rgba(224,138,48,.10)',
      color: '#E08A30',
    },
  },
  {
    quality: 4 as ReviewQuality,
    label: 'Bom',
    interval: 'em 4 dias',
    style: {
      border: '1.5px solid #1C2E4A',
      background: 'rgba(60,100,180,.08)',
      color: '#7AAAE8',
    },
  },
  {
    quality: 5 as ReviewQuality,
    label: 'Fácil',
    interval: 'em 9 dias',
    style: {
      border: '1.5px solid #1A3528',
      background: 'rgba(61,170,120,.10)',
      color: '#3DAA78',
    },
  },
]

function formatLastReview(lastReview: string | null): string {
  if (!lastReview) return 'Primeira revisão'
  const diffDays = Math.floor((Date.now() - new Date(lastReview).getTime()) / 86_400_000)
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

export function ReviewCard({ review, onAnswer, onSkip, isLoading, subjectColor }: ReviewCardProps) {
  const accentColor = subjectColor || '#3DAA78'

  return (
    <div
      className="bg-card border border-edge-s rounded-[2px] overflow-hidden"
      style={{ borderLeftWidth: '4px', borderLeftColor: accentColor }}
    >
      <div className="px-8 py-7">
        {/* Meta row */}
        <div className="flex items-center gap-4 mb-4">
          <span
            className="font-mono text-[9.5px] tracking-[0.1em] uppercase"
            style={{ color: accentColor }}
          >
            Revisão
          </span>
          <span className="font-mono text-[9.5px] text-ink-muted">
            {formatLastReview(review.lastReview)}
          </span>
          {review.streak > 0 && (
            <span className="font-mono text-[9.5px] text-ember ml-auto">
              {review.streak} dias ›
            </span>
          )}
        </div>

        {/* Topic */}
        <div className="mb-8">
          <h2 className="font-serif text-[25px] font-bold tracking-[-0.02em] text-ink leading-[1.15] text-balance">
            {review.topic.name}
          </h2>
          {review.topic.description && (
            <p className="mt-2 text-[12.5px] text-ink-muted leading-[1.65]">
              {review.topic.description}
            </p>
          )}
        </div>

        {/* Quality buttons — 4 colunas com intervalo visível */}
        <div className="grid grid-cols-4 gap-[9px] mb-3">
          {QUALITY_OPTIONS.map(({ quality, label, interval, style }) => (
            <button
              key={quality}
              onClick={() => onAnswer(quality)}
              disabled={isLoading}
              className="rounded-[4px] px-2 py-[11px] pb-[9px] text-center transition-opacity disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-80"
              style={style}
            >
              <span className="block text-[12px] font-bold leading-none mb-[3px]">{label}</span>
              <span className="block font-mono text-[8.5px] opacity-60">{interval}</span>
            </button>
          ))}
        </div>

        {/* Skip */}
        <div className="text-center">
          <button
            onClick={onSkip}
            disabled={isLoading}
            className="text-[11px] text-ink-muted hover:text-ink transition-colors underline underline-offset-2 disabled:opacity-40"
          >
            Pular por agora
          </button>
        </div>
      </div>
    </div>
  )
}
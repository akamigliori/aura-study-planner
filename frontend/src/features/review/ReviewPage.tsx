import { useEffect } from 'react'
import { useReviewStore } from '../../store/review.store'
import { useSubjectStore } from '../../store/subject.store'
import type { ReviewQuality } from '../../types/review.types'
import { ReviewProgress } from './ReviewProgress'
import { ReviewCard } from './ReviewCard'
import { ReviewEmptyState } from './ReviewEmptyState'
import { ReviewSessionComplete } from './ReviewSessionComplete'

export function ReviewPage() {
  const {
    dueReviews,
    session,
    isLoading,
    error,
    fetchDueReviews,
    completeReview,
    skipReview,
    resetSession,
  } = useReviewStore()
  const { subjects, fetchSubjects } = useSubjectStore()

  useEffect(() => {
    fetchDueReviews()
    fetchSubjects()
  }, [fetchDueReviews, fetchSubjects])

  const currentReview = dueReviews[0]
  const isSessionComplete = !isLoading && session.total > 0 && dueReviews.length === 0

  const currentSubject = currentReview
    ? subjects.find((s) => s.id === currentReview.topic.subjectId)
    : undefined

  const handleAnswer = async (quality: ReviewQuality) => {
    if (!currentReview) return
    await completeReview(currentReview.id, quality)
  }

  const handleSkip = () => {
    if (!currentReview) return
    skipReview(currentReview.id)
  }

  const handleRestart = () => {
    resetSession()
    fetchDueReviews()
  }

  if (isLoading && dueReviews.length === 0 && session.total === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 rounded-full border-2 border-edge border-t-forest animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Page header */}
      <div className="flex items-start justify-between mb-7">
        <div>
          <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-ink-dim mb-[5px]">
            Repetição espaçada
          </div>
          <h1 className="font-serif text-[26px] font-bold tracking-[-0.02em] text-ink leading-none">
            Revisões
          </h1>
        </div>
        {session.total > 0 && !isSessionComplete && (
          <div className="text-right">
            <div className="font-mono text-[9.5px] text-ink-muted mb-[6px]">
              {session.completed} de {session.total} revisadas hoje
            </div>
            <div className="w-[180px] h-[2px] bg-edge rounded-full overflow-hidden ml-auto">
              <div
                className="h-full bg-forest rounded-full transition-all duration-500"
                style={{ width: `${session.total > 0 ? (session.completed / session.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 py-3 bg-red-900/20 border border-red-800/40 rounded-[4px] text-[13px] text-red-400 mb-4">
          {error}
        </div>
      )}

      {/* Session complete */}
      {isSessionComplete && (
        <ReviewSessionComplete session={session} onRestart={handleRestart} />
      )}

      {/* Active session */}
      {!isSessionComplete && session.total > 0 && (
        <div className="space-y-4">
          <ReviewProgress completed={session.completed} total={session.total} />
          {currentReview && (
            <ReviewCard
              review={currentReview}
              onAnswer={handleAnswer}
              onSkip={handleSkip}
              isLoading={isLoading}
              subjectColor={currentSubject?.color}
            />
          )}
        </div>
      )}

      {/* Empty — sem revisões */}
      {!isLoading && session.total === 0 && !isSessionComplete && (
        <ReviewEmptyState />
      )}
    </div>
  )
}
import { useEffect } from 'react'
import { BrainCircuit } from 'lucide-react'
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
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center shrink-0">
          <BrainCircuit className="w-5 h-5 text-violet-600 dark:text-violet-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
            Revisões
          </h1>
          {session.total > 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {session.total} {session.total === 1 ? 'item' : 'itens'} para revisar
            </p>
          )}
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-4 py-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Session complete */}
      {isSessionComplete && (
        <ReviewSessionComplete session={session} onRestart={handleRestart} />
      )}

      {/* Active session */}
      {!isSessionComplete && session.total > 0 && (
        <>
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
        </>
      )}

      {/* Empty state — no reviews due */}
      {!isLoading && session.total === 0 && !isSessionComplete && (
        <ReviewEmptyState />
      )}
    </div>
  )
}

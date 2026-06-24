import { create } from 'zustand'
import { api } from '../lib/api'
import type { Review, ReviewQuality, ReviewSession } from '../types/review.types'

interface ReviewStore {
  dueReviews: Review[]
  session: ReviewSession
  isLoading: boolean
  error: string | null
  fetchDueReviews: () => Promise<void>
  completeReview: (id: string, quality: ReviewQuality) => Promise<void>
  skipReview: (id: string) => void
  resetSession: () => void
}

export const useReviewStore = create<ReviewStore>((set) => ({
  dueReviews: [],
  session: { total: 0, completed: 0, skipped: 0 },
  isLoading: false,
  error: null,

  fetchDueReviews: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get<{ data: { reviews: Review[]; count: number } }>('/reviews/due')
      const reviews = response.data.reviews
      set({
        dueReviews: reviews,
        session: { total: reviews.length, completed: 0, skipped: 0 },
        isLoading: false,
      })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  completeReview: async (id, quality) => {
    try {
      await api.post(`/reviews/${id}/complete`, { quality })
      set((state) => ({
        dueReviews: state.dueReviews.filter((r) => r.id !== id),
        session: { ...state.session, completed: state.session.completed + 1 },
      }))
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  skipReview: (id) => {
    set((state) => {
      const review = state.dueReviews.find((r) => r.id === id)
      if (!review) return state
      const remaining = state.dueReviews.filter((r) => r.id !== id)
      return {
        dueReviews: [...remaining, review],
        session: { ...state.session, skipped: state.session.skipped + 1 },
      }
    })
  },

  resetSession: () => {
    set({
      dueReviews: [],
      session: { total: 0, completed: 0, skipped: 0 },
      error: null,
      isLoading: false,
    })
  },
}))

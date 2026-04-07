import { create } from 'zustand'
import { api } from '../lib/api'

interface Review {
  id: string
  subjectId: string
  topicId: string
  nextReview: string
  interval: number
  easeFactor: number
  streak: number
}

interface ReviewStore {
  dueReviews: Review[]
  isLoading: boolean
  error: string | null
  fetchDueReviews: () => Promise<void>
}

export const useReviewStore = create<ReviewStore>((set) => ({
  dueReviews: [],
  isLoading: false,
  error: null,
  fetchDueReviews: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get<{ data: { reviews: Review[] } | Review[] }>('/reviews/due')
      // Handling both unwrapped arrays and { reviews } wrap
      const reviewsData = Array.isArray(response.data) ? response.data : (response.data as any).reviews || []
      set({ dueReviews: reviewsData, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  }
}))

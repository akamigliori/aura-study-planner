import { describe, it, expect, beforeEach } from 'vitest'
import { useReviewStore } from '../../../src/store/review.store'

describe('ReviewStore', () => {
  beforeEach(() => {
    useReviewStore.setState({ dueReviews: [], isLoading: false, error: null })
  })

  it('deve inicializar com array vazio', () => {
    const { dueReviews, isLoading, error } = useReviewStore.getState()
    expect(dueReviews).toEqual([])
    expect(isLoading).toBe(false)
    expect(error).toBeNull()
  })
})

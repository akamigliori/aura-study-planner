import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useReviewStore } from '../../src/store/review.store'

vi.mock('../../src/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import { api } from '../../src/lib/api'

const mockReview = {
  id: 'review-1',
  topicId: 'topic-1',
  userId: 'user-1',
  interval: 3,
  easeFactor: 2.5,
  nextReview: '2026-06-24T00:00:00.000Z',
  lastReview: '2026-06-21T00:00:00.000Z',
  streak: 2,
  status: 'DUE' as const,
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-24T00:00:00.000Z',
  topic: {
    id: 'topic-1',
    name: 'Hooks do React',
    description: null,
    subjectId: 'subject-1',
  },
}

const initialState = {
  dueReviews: [],
  session: { total: 0, completed: 0, skipped: 0 },
  isLoading: false,
  error: null,
}

describe('review.store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useReviewStore.setState(initialState)
  })

  describe('fetchDueReviews', () => {
    it('deve buscar revisões pendentes e inicializar a sessão', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { reviews: [mockReview], count: 1 },
      })

      await useReviewStore.getState().fetchDueReviews()

      expect(api.get).toHaveBeenCalledWith('/reviews/due')
      expect(useReviewStore.getState().dueReviews).toEqual([mockReview])
      expect(useReviewStore.getState().session.total).toBe(1)
      expect(useReviewStore.getState().session.completed).toBe(0)
    })

    it('deve setar isLoading como true durante o fetch e false ao concluir', async () => {
      let resolvePromise!: (v: unknown) => void
      const promise = new Promise<unknown>((resolve) => {
        resolvePromise = resolve
      })
      vi.mocked(api.get).mockReturnValueOnce(promise as ReturnType<typeof api.get>)

      const fetchPromise = useReviewStore.getState().fetchDueReviews()
      expect(useReviewStore.getState().isLoading).toBe(true)

      resolvePromise({ data: { reviews: [], count: 0 } })
      await fetchPromise

      expect(useReviewStore.getState().isLoading).toBe(false)
    })

    it('deve setar error e finalizar o loading em caso de falha', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Erro de rede'))

      await useReviewStore.getState().fetchDueReviews()

      expect(useReviewStore.getState().error).toBe('Erro de rede')
      expect(useReviewStore.getState().isLoading).toBe(false)
      expect(useReviewStore.getState().dueReviews).toEqual([])
    })

    it('deve reinicializar o contador de sessão a cada fetch', async () => {
      useReviewStore.setState({ session: { total: 5, completed: 3, skipped: 1 } })
      vi.mocked(api.get).mockResolvedValueOnce({
        data: { reviews: [mockReview], count: 1 },
      })

      await useReviewStore.getState().fetchDueReviews()

      const { session } = useReviewStore.getState()
      expect(session.total).toBe(1)
      expect(session.completed).toBe(0)
      expect(session.skipped).toBe(0)
    })
  })

  describe('completeReview', () => {
    it('deve remover o review da fila e incrementar completed na sessão', async () => {
      const review2 = { ...mockReview, id: 'review-2' }
      useReviewStore.setState({
        dueReviews: [mockReview, review2],
        session: { total: 2, completed: 0, skipped: 0 },
      })
      vi.mocked(api.post).mockResolvedValueOnce({
        data: { review: { ...mockReview, status: 'COMPLETED' } },
      })

      await useReviewStore.getState().completeReview('review-1', 4)

      expect(api.post).toHaveBeenCalledWith('/reviews/review-1/complete', { quality: 4 })
      expect(useReviewStore.getState().dueReviews).toHaveLength(1)
      expect(useReviewStore.getState().dueReviews[0].id).toBe('review-2')
      expect(useReviewStore.getState().session.completed).toBe(1)
    })

    it('deve aceitar qualidade 0 (De Novo)', async () => {
      useReviewStore.setState({
        dueReviews: [mockReview],
        session: { total: 1, completed: 0, skipped: 0 },
      })
      vi.mocked(api.post).mockResolvedValueOnce({ data: { review: mockReview } })

      await useReviewStore.getState().completeReview('review-1', 0)

      expect(api.post).toHaveBeenCalledWith('/reviews/review-1/complete', { quality: 0 })
    })

    it('deve manter o review na fila e setar error se o backend falhar', async () => {
      useReviewStore.setState({
        dueReviews: [mockReview],
        session: { total: 1, completed: 0, skipped: 0 },
      })
      vi.mocked(api.post).mockRejectedValueOnce(new Error('Server Error'))

      await useReviewStore.getState().completeReview('review-1', 3)

      expect(useReviewStore.getState().dueReviews).toEqual([mockReview])
      expect(useReviewStore.getState().session.completed).toBe(0)
      expect(useReviewStore.getState().error).toBe('Server Error')
    })
  })

  describe('skipReview', () => {
    it('deve mover o review para o final da fila e incrementar skipped', () => {
      const review2 = { ...mockReview, id: 'review-2' }
      useReviewStore.setState({
        dueReviews: [mockReview, review2],
        session: { total: 2, completed: 0, skipped: 0 },
      })

      useReviewStore.getState().skipReview('review-1')

      const { dueReviews, session } = useReviewStore.getState()
      expect(dueReviews[0].id).toBe('review-2')
      expect(dueReviews[1].id).toBe('review-1')
      expect(session.skipped).toBe(1)
    })

    it('não deve alterar nada se o review não existir na fila', () => {
      useReviewStore.setState({
        dueReviews: [mockReview],
        session: { total: 1, completed: 0, skipped: 0 },
      })

      useReviewStore.getState().skipReview('nao-existe')

      expect(useReviewStore.getState().dueReviews).toEqual([mockReview])
      expect(useReviewStore.getState().session.skipped).toBe(0)
    })
  })

  describe('resetSession', () => {
    it('deve restaurar o estado inicial limpo', () => {
      useReviewStore.setState({
        dueReviews: [mockReview],
        session: { total: 5, completed: 3, skipped: 2 },
        error: 'algum erro anterior',
        isLoading: true,
      })

      useReviewStore.getState().resetSession()

      const state = useReviewStore.getState()
      expect(state.dueReviews).toEqual([])
      expect(state.session).toEqual({ total: 0, completed: 0, skipped: 0 })
      expect(state.error).toBeNull()
      expect(state.isLoading).toBe(false)
    })
  })
})

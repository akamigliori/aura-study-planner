import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { ReviewPage } from '../../../src/features/review/ReviewPage'
import { server } from '../../../src/mocks/server'
import { http, HttpResponse } from 'msw'
import { useReviewStore } from '../../../src/store/review.store'
import { useSubjectStore } from '../../../src/store/subject.store'

const mockReview = {
  id: 'review-1',
  topicId: 'topic-1',
  userId: 'user-1',
  interval: 3,
  easeFactor: 2.5,
  nextReview: '2026-06-24T00:00:00.000Z',
  lastReview: null,
  streak: 0,
  status: 'DUE',
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-24T00:00:00.000Z',
  topic: {
    id: 'topic-1',
    name: 'Hooks do React',
    description: null,
    subjectId: 'subject-1',
  },
}

const emptySubjectsHandler = http.get('http://localhost:3000/subjects', () =>
  HttpResponse.json({ data: { subjects: [] } }),
)

describe('ReviewPage', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
  afterEach(() => {
    server.resetHandlers()
    useReviewStore.setState({
      dueReviews: [],
      session: { total: 0, completed: 0, skipped: 0 },
      isLoading: false,
      error: null,
    })
    useSubjectStore.setState({ subjects: [], isLoading: false, error: null })
  })
  afterAll(() => server.close())

  it('deve mostrar estado vazio quando não há revisões pendentes', async () => {
    server.use(
      http.get('http://localhost:3000/reviews/due', () =>
        HttpResponse.json({ data: { reviews: [], count: 0 } }),
      ),
      emptySubjectsHandler,
    )

    render(<ReviewPage />)

    expect(await screen.findByText(/nenhuma revisão pendente/i)).toBeInTheDocument()
  })

  it('deve exibir o nome do tópico da revisão atual', async () => {
    server.use(
      http.get('http://localhost:3000/reviews/due', () =>
        HttpResponse.json({ data: { reviews: [mockReview], count: 1 } }),
      ),
      emptySubjectsHandler,
    )

    render(<ReviewPage />)

    expect(await screen.findByText('Hooks do React')).toBeInTheDocument()
  })

  it('deve exibir o progresso da sessão', async () => {
    server.use(
      http.get('http://localhost:3000/reviews/due', () =>
        HttpResponse.json({ data: { reviews: [mockReview], count: 1 } }),
      ),
      emptySubjectsHandler,
    )

    render(<ReviewPage />)

    expect(await screen.findByText('0 / 1')).toBeInTheDocument()
  })

  it('deve exibir os quatro botões de qualidade SM-2', async () => {
    server.use(
      http.get('http://localhost:3000/reviews/due', () =>
        HttpResponse.json({ data: { reviews: [mockReview], count: 1 } }),
      ),
      emptySubjectsHandler,
    )

    render(<ReviewPage />)

    expect(await screen.findByRole('button', { name: /de novo/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /difícil/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /bom/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /fácil/i })).toBeInTheDocument()
  })

  it('deve mostrar tela de conclusão após completar todas as revisões', async () => {
    server.use(
      http.get('http://localhost:3000/reviews/due', () =>
        HttpResponse.json({ data: { reviews: [mockReview], count: 1 } }),
      ),
      http.post('http://localhost:3000/reviews/review-1/complete', () =>
        HttpResponse.json({ data: { review: { ...mockReview, status: 'COMPLETED' } } }),
      ),
      emptySubjectsHandler,
    )

    render(<ReviewPage />)
    const easyButton = await screen.findByRole('button', { name: /fácil/i })
    fireEvent.click(easyButton)

    expect(await screen.findByText(/sessão concluída/i)).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('deve mover o review para o final ao pular e não mostrar conclusão', async () => {
    const review2 = { ...mockReview, id: 'review-2', topic: { ...mockReview.topic, name: 'Closures' } }
    server.use(
      http.get('http://localhost:3000/reviews/due', () =>
        HttpResponse.json({ data: { reviews: [mockReview, review2], count: 2 } }),
      ),
      emptySubjectsHandler,
    )

    render(<ReviewPage />)
    await screen.findByText('Hooks do React')

    fireEvent.click(screen.getByRole('button', { name: /pular/i }))

    expect(screen.getByText('Closures')).toBeInTheDocument()
    expect(screen.queryByText(/sessão concluída/i)).not.toBeInTheDocument()
  })
})

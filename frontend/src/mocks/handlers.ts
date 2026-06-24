import { http, HttpResponse } from 'msw'

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000'

const mockReview = {
  id: 'review-1',
  topicId: 'topic-1',
  userId: 'user-1',
  interval: 1,
  easeFactor: 2.5,
  nextReview: new Date().toISOString(),
  lastReview: null,
  streak: 0,
  status: 'DUE',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  topic: {
    id: 'topic-1',
    name: 'Tópico de Exemplo',
    description: null,
    subjectId: 'subject-1',
  },
}

export const handlers = [
  http.get(`${API_URL}/reviews/due`, () => {
    return HttpResponse.json({ data: { reviews: [mockReview], count: 1 } })
  }),

  http.post(`${API_URL}/reviews/:id/complete`, () => {
    return HttpResponse.json({ data: { review: { ...mockReview, status: 'COMPLETED' } } })
  }),

  http.post(`${API_URL}/auth/login`, async () => {
    return HttpResponse.json({
      data: {
        user: {
          id: '1',
          name: 'MSW User',
          email: 'teste@msw.com',
          avatarUrl: null,
          createdAt: new Date().toISOString()
        },
        tokens: {
          accessToken: 'fake-access-token',
          refreshToken: 'fake-refresh-token'
        }
      }
    })
  }),

  http.get(`${API_URL}/auth/me`, () => {
    return HttpResponse.json({
      data: {
        user: {
          id: '1',
          name: 'MSW User',
          email: 'teste@msw.com',
          avatarUrl: null,
          createdAt: new Date().toISOString()
        }
      }
    })
  })
]

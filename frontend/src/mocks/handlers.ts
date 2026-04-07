import { http, HttpResponse } from 'msw'

const API_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3000'

export const handlers = [
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

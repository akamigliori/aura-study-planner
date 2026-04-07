import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { SubjectPage } from '../../../src/features/subjects/SubjectPage'
import { server } from '../../../src/mocks/server'
import { http, HttpResponse } from 'msw'

describe('SubjectPage', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())

  it('deve exibir um botão de adicionar nova matéria', async () => {
    render(<SubjectPage />)
    expect(await screen.findByText(/Nova Matéria/i)).toBeInTheDocument()
  })

  it('deve listar as matérias vindas do backend via store', async () => {
    // Interceptar a API e devolver duas matérias mockadas
    server.use(
      http.get('http://localhost:3000/subjects', () => {
        return HttpResponse.json({
          success: true,
          data: {
            subjects: [
              { id: '1', name: 'Biologia', color: '#00ff00', icon: 'leaf', userId: 'user1', createdAt: '', updatedAt: '' },
              { id: '2', name: 'História', color: '#ff00ff', icon: 'book', userId: 'user1', createdAt: '', updatedAt: '' }
            ]
          }
        })
      })
    )

    render(<SubjectPage />)

    // Aguarda a promessa do Zustand e o componente re-renderizar
    expect(await screen.findByText('Biologia')).toBeInTheDocument()
    expect(await screen.findByText('História')).toBeInTheDocument()
  })
})

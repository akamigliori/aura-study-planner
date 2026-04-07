import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, beforeEach, beforeAll, afterEach, afterAll } from 'vitest'
import { useSubjectStore } from '../../src/store/subject.store'
import { server } from '../../src/mocks/server'
import { http, HttpResponse } from 'msw'
import type { Subject } from '../../src/types/subject.types'

const API_URL = 'http://localhost:3000'

const mockSubject: Subject = {
  id: '1',
  name: 'Matemática',
  color: '#ff0000',
  icon: 'math',
  userId: 'user1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
}

describe('SubjectStore', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
  
  beforeEach(() => {
    useSubjectStore.setState({ subjects: [], isLoading: false, error: null })
  })

  it('deve possuir estado inicial vazio', () => {
    const { result } = renderHook(() => useSubjectStore())
    expect(result.current.subjects).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('deve realizar fetchSubjects e preencher a store em caso de sucesso', async () => {
    server.use(
      http.get(`${API_URL}/subjects`, () => {
        return HttpResponse.json({
          success: true,
          data: { subjects: [ mockSubject ] }
        })
      })
    )

    const { result } = renderHook(() => useSubjectStore())

    await act(async () => {
      await result.current.fetchSubjects()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.subjects).toHaveLength(1)
    expect(result.current.subjects[0].name).toBe('Matemática')
  })

  it('deve preencher o estado de erro caso falhe ao buscar subjects', async () => {
    server.use(
      http.get(`${API_URL}/subjects`, () => {
        return HttpResponse.json({ message: 'Erro interno' }, { status: 500 })
      })
    )

    const { result } = renderHook(() => useSubjectStore())

    await act(async () => {
      await result.current.fetchSubjects()
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.subjects).toEqual([])
    expect(result.current.error).not.toBeNull()
  })

  it('deve realizar createSubject e atualizar a store com sucesso', async () => {
    server.use(
      http.post(`${API_URL}/subjects`, async () => {
        return HttpResponse.json({
          success: true,
          data: { subject: { ...mockSubject, id: '2', name: 'História' } }
        }, { status: 201 })
      })
    )

    const { result } = renderHook(() => useSubjectStore())

    await act(async () => {
      await result.current.createSubject({ name: 'História', color: '#00ff00' })
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.subjects).toHaveLength(1)
    expect(result.current.subjects[0].name).toBe('História')
  })

  it('deve realizar updateSubject e atualizar o item correto na store', async () => {
    useSubjectStore.setState({ subjects: [mockSubject] })
    
    server.use(
      http.put(`${API_URL}/subjects/:id`, async () => {
        return HttpResponse.json({
          success: true,
          data: { subject: { ...mockSubject, name: 'Matemática Avançada' } }
        })
      })
    )

    const { result } = renderHook(() => useSubjectStore())

    await act(async () => {
      await result.current.updateSubject('1', { name: 'Matemática Avançada' })
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.subjects).toHaveLength(1)
    expect(result.current.subjects[0].name).toBe('Matemática Avançada')
  })

  it('deve realizar deleteSubject e remover o item da store', async () => {
    useSubjectStore.setState({ subjects: [mockSubject] })
    
    server.use(
      http.delete(`${API_URL}/subjects/:id`, async () => {
        return HttpResponse.json({ success: true })
      })
    )

    const { result } = renderHook(() => useSubjectStore())

    await act(async () => {
      await result.current.deleteSubject('1')
    })

    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBeNull()
    expect(result.current.subjects).toHaveLength(0)
  })
})

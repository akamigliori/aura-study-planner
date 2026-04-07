import { create } from 'zustand'
import { api } from '../lib/api'
import type { Subject, CreateSubjectRequest, UpdateSubjectRequest } from '../types/subject.types'

interface SubjectStore {
  subjects: Subject[]
  isLoading: boolean
  error: string | null
  fetchSubjects: () => Promise<void>
  createSubject: (data: CreateSubjectRequest) => Promise<void>
  updateSubject: (id: string, data: UpdateSubjectRequest) => Promise<void>
  deleteSubject: (id: string) => Promise<void>
}

export const useSubjectStore = create<SubjectStore>((set) => ({
  subjects: [],
  isLoading: false,
  error: null,

  fetchSubjects: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get<{ data: { subjects: Subject[] } }>('/subjects')
      set({ subjects: response.data.subjects, isLoading: false })
    } catch (err: any) {
      set({ 
        error: err.message || 'Erro ao carregar matérias', 
        isLoading: false 
      })
    }
  },

  createSubject: async (data: CreateSubjectRequest) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post<{ data: { subject: Subject } }>('/subjects', data)
      set((state) => ({ 
        subjects: [...state.subjects, response.data.subject], 
        isLoading: false 
      }))
    } catch (err: any) {
      set({ error: err.message || 'Erro ao criar matéria', isLoading: false })
      throw err
    }
  },

  updateSubject: async (id: string, data: UpdateSubjectRequest) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.put<{ data: { subject: Subject } }>(`/subjects/${id}`, data)
      set((state) => ({
        subjects: state.subjects.map(sub => 
          sub.id === id ? response.data.subject : sub
        ),
        isLoading: false
      }))
    } catch (err: any) {
      set({ error: err.message || 'Erro ao atualizar matéria', isLoading: false })
      throw err
    }
  },

  deleteSubject: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/subjects/${id}`)
      set((state) => ({
        subjects: state.subjects.filter(sub => sub.id !== id),
        isLoading: false
      }))
    } catch (err: any) {
      set({ error: err.message || 'Erro ao deletar matéria', isLoading: false })
      throw err
    }
  }
}))

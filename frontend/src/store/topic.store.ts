import { create } from 'zustand'
import { api } from '../lib/api'
import type { Topic, CreateTopicData, UpdateTopicData } from '../types/topic.types'

interface TopicStore {
  topics: Topic[]
  isLoading: boolean
  error: string | null
  
  // Ações baseadas no subjectId atual
  fetchTopics: (subjectId: string) => Promise<void>
  addTopic: (subjectId: string, data: CreateTopicData) => Promise<void>
  updateTopic: (subjectId: string, id: string, data: UpdateTopicData) => Promise<void>
  deleteTopic: (subjectId: string, id: string) => Promise<void>
}

export const useTopicStore = create<TopicStore>((set) => ({
  topics: [],
  isLoading: false,
  error: null,

  fetchTopics: async (subjectId) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get<{ data: { topics: Topic[] } | Topic[] }>(`/subjects/${subjectId}/topics`)
      const topicsData = Array.isArray(response.data) ? response.data : (response.data as any).topics || []
      set({ topics: topicsData, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addTopic: async (subjectId, data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post<{ data: { topic: Topic } }>(`/subjects/${subjectId}/topics`, data)
      set((state) => ({ 
        topics: [...state.topics, response.data.topic], 
        isLoading: false 
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error // Permitir que o componente consuma o erro para Toast
    }
  },

  updateTopic: async (subjectId, id, data) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.put<{ data: { topic: Topic } }>(`/subjects/${subjectId}/topics/${id}`, data)
      set((state) => ({
        topics: state.topics.map(t => t.id === id ? response.data.topic : t),
        isLoading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  deleteTopic: async (subjectId, id) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/subjects/${subjectId}/topics/${id}`)
      set((state) => ({
        topics: state.topics.filter(t => t.id !== id),
        isLoading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  }
}))

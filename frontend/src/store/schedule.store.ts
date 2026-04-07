import { create } from 'zustand'
import { api } from '../lib/api'
import type { ScheduleBlock, CreateScheduleData, UpdateScheduleData } from '../types/schedule.types'

interface ScheduleStore {
  blocks: ScheduleBlock[]
  isLoading: boolean
  error: string | null
  fetchSchedule: () => Promise<void>
  addBlock: (data: CreateScheduleData) => Promise<void>
  updateBlock: (id: string, data: UpdateScheduleData) => Promise<void>
  deleteBlock: (id: string) => Promise<void>
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  blocks: [],
  isLoading: false,
  error: null,
  
  fetchSchedule: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get<{ data: { blocks: ScheduleBlock[] } | ScheduleBlock[] }>('/schedule')
      const blocksData = Array.isArray(response.data) ? response.data : (response.data as any).blocks || []
      set({ blocks: blocksData, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  addBlock: async (data: CreateScheduleData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.post<{ data: { schedule: ScheduleBlock } }>('/schedule', data)
      set((state) => ({
        blocks: [...state.blocks, response.data.schedule],
        isLoading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  updateBlock: async (id: string, data: UpdateScheduleData) => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.put<{ data: { schedule: ScheduleBlock } }>(`/schedule/${id}`, data)
      set((state) => ({
        blocks: state.blocks.map(b => b.id === id ? response.data.schedule : b),
        isLoading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  },

  deleteBlock: async (id: string) => {
    set({ isLoading: true, error: null })
    try {
      await api.delete(`/schedule/${id}`)
      set((state) => ({
        blocks: state.blocks.filter(b => b.id !== id),
        isLoading: false
      }))
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
      throw error
    }
  }
}))

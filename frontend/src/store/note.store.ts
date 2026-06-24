import { create } from 'zustand'
import { api } from '../lib/api'
import type { Note, CreateNoteData } from '../types/note.types'

interface NoteStore {
  notes: Note[]
  isLoading: boolean
  error: string | null
  fetchNotes: () => Promise<void>
  createNote: (data: CreateNoteData) => Promise<void>
  deleteNote: (id: string) => Promise<void>
  togglePin: (id: string) => void
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get<{ data: { notes: Note[] } }>('/notes')
      set({ notes: response.data.notes, isLoading: false })
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false })
    }
  },

  createNote: async (data) => {
    try {
      const response = await api.post<{ data: { note: Note } }>('/notes', data)
      set((state) => ({ notes: [...state.notes, response.data.note] }))
    } catch (error) {
      set({ error: (error as Error).message })
    }
  },

  deleteNote: async (id) => {
    const noteToDelete = get().notes.find((n) => n.id === id)
    set((state) => ({ notes: state.notes.filter((n) => n.id !== id) }))
    try {
      await api.delete(`/notes/${id}`)
    } catch (error) {
      if (noteToDelete) {
        set((state) => ({ notes: [...state.notes, noteToDelete], error: (error as Error).message }))
      } else {
        set({ error: (error as Error).message })
      }
    }
  },

  togglePin: (id) => {
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? { ...n, isPinned: !n.isPinned } : n)),
    }))
  },
}))

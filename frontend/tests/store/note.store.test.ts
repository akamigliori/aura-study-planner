import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useNoteStore } from '../../src/store/note.store'

vi.mock('../../src/lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import { api } from '../../src/lib/api'

const mockNote = {
  id: 'note-1',
  title: 'Derivadas',
  content: 'Regra da cadeia: d/dx[f(g(x))] = f\'(g(x)) · g\'(x)',
  tags: ['cálculo', 'fórmulas'],
  isPinned: false,
  subjectId: 'subject-1',
  userId: 'user-1',
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-24T00:00:00.000Z',
}

const initialState = {
  notes: [],
  isLoading: false,
  error: null,
}

describe('note.store', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useNoteStore.setState(initialState)
  })

  it('deve ter estado inicial correto', () => {
    const state = useNoteStore.getState()
    expect(state.notes).toEqual([])
    expect(state.isLoading).toBe(false)
    expect(state.error).toBeNull()
  })

  describe('fetchNotes', () => {
    it('deve buscar notas e popular o estado', async () => {
      vi.mocked(api.get).mockResolvedValueOnce({ data: { notes: [mockNote] } })

      await useNoteStore.getState().fetchNotes()

      expect(api.get).toHaveBeenCalledWith('/notes')
      expect(useNoteStore.getState().notes).toEqual([mockNote])
      expect(useNoteStore.getState().isLoading).toBe(false)
    })

    it('deve setar isLoading como true durante o fetch e false ao concluir', async () => {
      let resolve!: (v: unknown) => void
      const promise = new Promise<unknown>((r) => { resolve = r })
      vi.mocked(api.get).mockReturnValueOnce(promise as ReturnType<typeof api.get>)

      const fetchPromise = useNoteStore.getState().fetchNotes()
      expect(useNoteStore.getState().isLoading).toBe(true)

      resolve({ data: { notes: [] } })
      await fetchPromise

      expect(useNoteStore.getState().isLoading).toBe(false)
    })

    it('deve setar error e finalizar loading em caso de falha', async () => {
      vi.mocked(api.get).mockRejectedValueOnce(new Error('Erro de rede'))

      await useNoteStore.getState().fetchNotes()

      expect(useNoteStore.getState().error).toBe('Erro de rede')
      expect(useNoteStore.getState().isLoading).toBe(false)
      expect(useNoteStore.getState().notes).toEqual([])
    })

    it('deve resetar error antes de nova chamada', async () => {
      useNoteStore.setState({ error: 'erro anterior' })
      vi.mocked(api.get).mockResolvedValueOnce({ data: { notes: [] } })

      await useNoteStore.getState().fetchNotes()

      expect(useNoteStore.getState().error).toBeNull()
    })
  })

  describe('createNote', () => {
    it('deve adicionar a nova nota ao array sem refetch', async () => {
      vi.mocked(api.post).mockResolvedValueOnce({ data: { note: mockNote } })

      await useNoteStore.getState().createNote({
        title: 'Derivadas',
        content: 'Regra da cadeia...',
        subjectId: 'subject-1',
        tags: ['cálculo'],
      })

      expect(api.post).toHaveBeenCalledWith('/notes', expect.objectContaining({ title: 'Derivadas' }))
      expect(useNoteStore.getState().notes).toHaveLength(1)
      expect(useNoteStore.getState().notes[0]).toEqual(mockNote)
    })

    it('deve criar nota com dados mínimos (sem tags, sem subjectId)', async () => {
      const minimalNote = { ...mockNote, tags: [], subjectId: null, id: 'note-min' }
      vi.mocked(api.post).mockResolvedValueOnce({ data: { note: minimalNote } })

      await useNoteStore.getState().createNote({ title: 'Rascunho', content: 'Conteúdo' })

      expect(useNoteStore.getState().notes[0].id).toBe('note-min')
    })

    it('deve setar error em caso de falha da API', async () => {
      vi.mocked(api.post).mockRejectedValueOnce(new Error('Sem permissão'))

      await useNoteStore.getState().createNote({ title: 'X', content: 'Y' })

      expect(useNoteStore.getState().error).toBe('Sem permissão')
      expect(useNoteStore.getState().notes).toHaveLength(0)
    })
  })

  describe('deleteNote', () => {
    it('deve remover a nota do estado otimisticamente', async () => {
      useNoteStore.setState({ notes: [mockNote] })
      vi.mocked(api.delete).mockResolvedValueOnce({})

      await useNoteStore.getState().deleteNote('note-1')

      expect(api.delete).toHaveBeenCalledWith('/notes/note-1')
      expect(useNoteStore.getState().notes).toHaveLength(0)
    })

    it('deve restaurar a nota se a API falhar', async () => {
      useNoteStore.setState({ notes: [mockNote] })
      vi.mocked(api.delete).mockRejectedValueOnce(new Error('Server Error'))

      await useNoteStore.getState().deleteNote('note-1')

      expect(useNoteStore.getState().notes).toHaveLength(1)
      expect(useNoteStore.getState().notes[0]).toEqual(mockNote)
      expect(useNoteStore.getState().error).toBe('Server Error')
    })
  })

  describe('togglePin', () => {
    it('deve inverter isPinned de nota não-pinada para pinada', () => {
      useNoteStore.setState({ notes: [{ ...mockNote, isPinned: false }] })

      useNoteStore.getState().togglePin('note-1')

      expect(useNoteStore.getState().notes[0].isPinned).toBe(true)
    })

    it('deve inverter isPinned de nota pinada para não-pinada', () => {
      useNoteStore.setState({ notes: [{ ...mockNote, isPinned: true }] })

      useNoteStore.getState().togglePin('note-1')

      expect(useNoteStore.getState().notes[0].isPinned).toBe(false)
    })
  })
})

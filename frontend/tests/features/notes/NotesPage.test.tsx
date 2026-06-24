import { render, screen, fireEvent, waitFor, within } from '@testing-library/react'
import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest'
import { NotesPage } from '../../../src/features/notes/NotesPage'
import { server } from '../../../src/mocks/server'
import { http, HttpResponse } from 'msw'
import { useNoteStore } from '../../../src/store/note.store'
import { useSubjectStore } from '../../../src/store/subject.store'

const mockNote = {
  id: 'note-1',
  title: 'Derivadas',
  content: 'Regra da cadeia: d/dx[f(g(x))] = f\'(g(x)) · g\'(x)',
  tags: ['cálculo'],
  isPinned: false,
  subjectId: null,
  userId: 'user-1',
  createdAt: '2026-06-01T00:00:00.000Z',
  updatedAt: '2026-06-24T00:00:00.000Z',
}

const emptySubjectsHandler = http.get('http://localhost:3000/subjects', () =>
  HttpResponse.json({ data: { subjects: [] } }),
)

describe('NotesPage', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
  afterEach(() => {
    server.resetHandlers()
    useNoteStore.setState({ notes: [], isLoading: false, error: null })
    useSubjectStore.setState({ subjects: [], isLoading: false, error: null })
  })
  afterAll(() => server.close())

  it('deve renderizar a lista de notas buscadas', async () => {
    server.use(
      http.get('http://localhost:3000/notes', () =>
        HttpResponse.json({ data: { notes: [mockNote] } }),
      ),
      emptySubjectsHandler,
    )

    render(<NotesPage />)

    expect(await screen.findByText('Derivadas')).toBeInTheDocument()
  })

  it('deve filtrar notas por texto de busca', async () => {
    const note2 = { ...mockNote, id: 'note-2', title: 'Integrais', content: 'Regra da potência' }
    server.use(
      http.get('http://localhost:3000/notes', () =>
        HttpResponse.json({ data: { notes: [mockNote, note2] } }),
      ),
      emptySubjectsHandler,
    )

    render(<NotesPage />)
    await screen.findByText('Derivadas')

    const searchInput = screen.getByPlaceholderText(/buscar/i)
    fireEvent.change(searchInput, { target: { value: 'Integrais' } })

    expect(screen.queryByText('Derivadas')).not.toBeInTheDocument()
    expect(screen.getByText('Integrais')).toBeInTheDocument()
  })

  it('deve abrir o modal ao clicar em Nova Anotação', async () => {
    server.use(
      http.get('http://localhost:3000/notes', () =>
        HttpResponse.json({ data: { notes: [] } }),
      ),
      emptySubjectsHandler,
    )

    render(<NotesPage />)
    // exact match para não confundir com o botão "+ Nova Anotação" do empty state
    const btn = await screen.findByRole('button', { name: 'Nova Anotação' })
    fireEvent.click(btn)

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(within(dialog).getByText('Nova Anotação')).toBeInTheDocument()
  })

  it('deve criar nota via formulário e exibi-la na lista', async () => {
    const newNote = { ...mockNote, id: 'note-new', title: 'Nova Nota', content: 'Conteúdo da nova nota' }
    server.use(
      http.get('http://localhost:3000/notes', () =>
        HttpResponse.json({ data: { notes: [] } }),
      ),
      http.post('http://localhost:3000/notes', () =>
        HttpResponse.json({ data: { note: newNote } }),
      ),
      emptySubjectsHandler,
    )

    render(<NotesPage />)
    fireEvent.click(await screen.findByRole('button', { name: 'Nova Anotação' }))

    fireEvent.change(screen.getByLabelText(/título/i), { target: { value: 'Nova Nota' } })
    fireEvent.change(screen.getByLabelText(/conteúdo/i), { target: { value: 'Conteúdo da nova nota' } })
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }))

    expect(await screen.findByText('Nova Nota')).toBeInTheDocument()
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('deve excluir nota após confirmação no ConfirmDialog', async () => {
    server.use(
      http.get('http://localhost:3000/notes', () =>
        HttpResponse.json({ data: { notes: [mockNote] } }),
      ),
      http.delete('http://localhost:3000/notes/note-1', () =>
        new HttpResponse(null, { status: 204 }),
      ),
      emptySubjectsHandler,
    )

    render(<NotesPage />)
    await screen.findByText('Derivadas')

    fireEvent.click(screen.getByRole('button', { name: 'Excluir nota' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // exact match 'Excluir' para não ambigurar com aria-label 'Excluir nota'
    fireEvent.click(screen.getByRole('button', { name: 'Excluir' }))

    await waitFor(() => {
      expect(screen.queryByText('Derivadas')).not.toBeInTheDocument()
    })
  })
})

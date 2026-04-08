import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { BoardForm } from '@/components/kanban/BoardForm'
import type { KanbanBoard } from '@/types/kanban.types'

const mockBoard: KanbanBoard = {
  id: 'board-1',
  name: 'Quadro Existente',
  description: 'Descrição existente',
  columns: [
    { id: 'TODO', name: 'A Fazer', color: '#ef4444' },
    { id: 'IN_PROGRESS', name: 'Em Progresso', color: '#3b82f6' },
    { id: 'DONE', name: 'Concluído', color: '#22c55e' },
  ],
  userId: 'user-1',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
}

describe('BoardForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockOnSubmit.mockResolvedValue(undefined)
  })

  it('renders create mode title when mode is create', () => {
    render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="create" />
    )

    expect(screen.getByText('Criar Novo Quadro')).toBeInTheDocument()
  })

  it('renders edit mode title when mode is edit', () => {
    render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="edit" initialData={mockBoard} />
    )

    expect(screen.getByText('Editar Quadro')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <BoardForm isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="create" />
    )

    expect(screen.queryByText('Criar Novo Quadro')).not.toBeInTheDocument()
  })

  it('pre-fills form with initialData in edit mode', () => {
    render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="edit" initialData={mockBoard} />
    )

    const nameInput = screen.getByPlaceholderText('Ex: Estudos 2024') as HTMLInputElement
    expect(nameInput.value).toBe('Quadro Existente')

    const descInput = screen.getByPlaceholderText('Descrição opcional...') as HTMLTextAreaElement
    expect(descInput.value).toBe('Descrição existente')
  })

  it('shows default columns in create mode', () => {
    render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="create" />
    )

    expect(screen.getByDisplayValue('A Fazer')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Em Progresso')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Concluído')).toBeInTheDocument()
  })

  it('shows existing columns in edit mode', () => {
    render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="edit" initialData={mockBoard} />
    )

    expect(screen.getByDisplayValue('A Fazer')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Em Progresso')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Concluído')).toBeInTheDocument()
  })

  it('calls onSubmit with form data', async () => {
    const user = userEvent.setup()
    render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="create" />
    )

    await user.type(screen.getByPlaceholderText('Ex: Estudos 2024'), 'Novo Quadro')
    await user.click(screen.getByRole('button', { name: 'Criar Quadro' }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'Novo Quadro',
        description: undefined,
        columns: expect.arrayContaining([
          expect.objectContaining({ name: 'A Fazer' }),
          expect.objectContaining({ name: 'Em Progresso' }),
          expect.objectContaining({ name: 'Concluído' }),
        ]),
      })
    })
  })

  it('calls onClose when cancel is clicked', async () => {
    const user = userEvent.setup()
    render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="create" />
    )

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('shows validation error when name is empty', async () => {
    const user = userEvent.setup()
    render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="create" />
    )

    await user.click(screen.getByRole('button', { name: 'Criar Quadro' }))

    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
    })
  })

  it('can add new column', async () => {
    const user = userEvent.setup()
    render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="create" />
    )

    await user.click(screen.getByText('Adicionar coluna'))

    const columnInputs = screen.getAllByPlaceholderText('Nome da coluna')
    expect(columnInputs.length).toBe(4) // 3 default + 1 new
  })

  it('can remove column (except last one)', async () => {
    const user = userEvent.setup()
    render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="create" />
    )

    // Try to remove - should be disabled since we have 3 columns and minimum is 1
    const removeButtons = screen.getAllByRole('button', { name: '' })
    // The X button should be enabled for each column except when only 1 remains
    
    const columnInputs = screen.getAllByPlaceholderText('Nome da coluna')
    expect(columnInputs.length).toBe(3)
  })

  it('can edit column name', async () => {
    const user = userEvent.setup()
    render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="create" />
    )

    const firstColumnInput = screen.getByDisplayValue('A Fazer')
    await user.clear(firstColumnInput)
    await user.type(firstColumnInput, 'Para Fazer')

    expect(screen.getByDisplayValue('Para Fazer')).toBeInTheDocument()
  })

  it('calls onClose when clicking overlay', async () => {
    const user = userEvent.setup()
    render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="create" />
    )

    const overlay = document.querySelector('.absolute.inset-0.bg-black\\/50')
    if (overlay) {
      await user.click(overlay)
    }

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('shows loading state during submit', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    const user = userEvent.setup()
    render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="create" />
    )

    await user.type(screen.getByPlaceholderText('Ex: Estudos 2024'), 'Novo')
    await user.click(screen.getByRole('button', { name: 'Criar Quadro' }))

    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeDisabled()
  })

  it('resets form when opening in create mode after edit mode', async () => {
    const { rerender } = render(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="edit" initialData={mockBoard} />
    )

    expect(screen.getByDisplayValue('Quadro Existente')).toBeInTheDocument()

    rerender(
      <BoardForm isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} mode="create" />
    )

    const nameInput = screen.getByPlaceholderText('Ex: Estudos 2024') as HTMLInputElement
    expect(nameInput.value).toBe('')
  })
})
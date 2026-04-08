import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { KanbanTaskModal } from '@/features/kanban/KanbanTaskModal'
import type { KanbanTask, UpdateKanbanTaskData, KanbanColumn } from '@/types/kanban.types'

const mockTask: KanbanTask = {
  id: 'task-1',
  title: 'Tarefa Original',
  description: 'Descrição original',
  column: 'TODO' as KanbanColumn,
  position: 0,
  priority: 'MEDIUM' as const,
  dueDate: '2026-12-31',
  boardId: 'board-1',
  userId: 'user-1',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
}

describe('KanbanTaskModal', () => {
  const mockOnSubmit = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockOnSubmit.mockResolvedValue(undefined)
  })

  it('renders modal when isOpen is true', () => {
    render(
      <KanbanTaskModal isOpen={true} onClose={mockOnClose} task={mockTask} onSubmit={mockOnSubmit} />
    )

    expect(screen.getByText('Editar Tarefa')).toBeInTheDocument()
  })

  it('does not render when isOpen is false', () => {
    render(
      <KanbanTaskModal isOpen={false} onClose={mockOnClose} task={mockTask} onSubmit={mockOnSubmit} />
    )

    expect(screen.queryByText('Editar Tarefa')).not.toBeInTheDocument()
  })

  it('pre-fills form with task data', () => {
    render(
      <KanbanTaskModal isOpen={true} onClose={mockOnClose} task={mockTask} onSubmit={mockOnSubmit} />
    )

    const titleInput = screen.getByLabelText('Título *') as HTMLInputElement
    expect(titleInput.value).toBe('Tarefa Original')

    const descInput = screen.getByLabelText('Descrição') as HTMLTextAreaElement
    expect(descInput.value).toBe('Descrição original')
  })

  it('calls onSubmit with updated data', async () => {
    const user = userEvent.setup()
    render(
      <KanbanTaskModal isOpen={true} onClose={mockOnClose} task={mockTask} onSubmit={mockOnSubmit} />
    )

    await user.clear(screen.getByLabelText('Título *'))
    await user.type(screen.getByLabelText('Título *'), 'Tarefa Atualizada')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'Tarefa Atualizada',
        description: 'Descrição original',
        priority: 'MEDIUM',
        dueDate: '2026-12-31',
      })
    })
  })

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <KanbanTaskModal isOpen={true} onClose={mockOnClose} task={mockTask} onSubmit={mockOnSubmit} />
    )

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(mockOnClose).toHaveBeenCalled()
  })

  it.skip('calls onClose when clicking overlay', async () => {
    const user = userEvent.setup()
    render(
      <KanbanTaskModal isOpen={true} onClose={mockOnClose} task={mockTask} onSubmit={mockOnSubmit} />
    )

    await user.click(screen.getByText('Editar Tarefa').parentElement!.parentElement!.firstChild as HTMLElement)

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('shows validation error for empty title', async () => {
    const user = userEvent.setup()
    render(
      <KanbanTaskModal isOpen={true} onClose={mockOnClose} task={mockTask} onSubmit={mockOnSubmit} />
    )

    await user.clear(screen.getByLabelText('Título *'))
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(screen.getByText('O título é obrigatório')).toBeInTheDocument()
    })
  })

  it('shows loading state during submit', async () => {
    mockOnSubmit.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    const user = userEvent.setup()
    render(
      <KanbanTaskModal isOpen={true} onClose={mockOnClose} task={mockTask} onSubmit={mockOnSubmit} />
    )

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeDisabled()
  })
})
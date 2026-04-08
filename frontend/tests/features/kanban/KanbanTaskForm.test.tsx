import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import userEvent from '@testing-library/user-event'
import { KanbanTaskForm } from '@/features/kanban/KanbanTaskForm'
import type { CreateKanbanTaskData } from '@/types/kanban.types'

describe('KanbanTaskForm', () => {
  const mockOnSubmit = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form fields', () => {
    render(
      <KanbanTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    expect(screen.getByLabelText('Título da Tarefa')).toBeInTheDocument()
    expect(screen.getByLabelText('Descrição (opcional)')).toBeInTheDocument()
    expect(screen.getByLabelText('Prioridade')).toBeInTheDocument()
  })

  it('renders submit and cancel buttons', () => {
    render(
      <KanbanTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancelar' })).toBeInTheDocument()
  })

  it('shows validation error when title is empty', async () => {
    const user = userEvent.setup()
    render(
      <KanbanTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(screen.getByText('O título é obrigatório')).toBeInTheDocument()
    })
  })

  it('calls onSubmit with form data when valid', async () => {
    const user = userEvent.setup()
    render(
      <KanbanTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    await user.type(screen.getByLabelText('Título da Tarefa'), 'Nova Tarefa')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
      const call = mockOnSubmit.mock.calls[0][0]
      expect(call.title).toBe('Nova Tarefa')
      expect(call.priority).toBe('MEDIUM')
    })
  })

  it('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(
      <KanbanTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    await user.click(screen.getByRole('button', { name: 'Cancelar' }))

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('shows loading state when isLoading is true', () => {
    render(
      <KanbanTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isLoading={true} />
    )

    expect(screen.getByRole('button', { name: 'Salvando...' })).toBeDisabled()
  })

  it('allows selecting priority', async () => {
    const user = userEvent.setup()
    render(
      <KanbanTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    await user.selectOptions(screen.getByLabelText('Prioridade'), 'HIGH')
    await user.type(screen.getByLabelText('Título da Tarefa'), 'Tarefa Alta')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
      const call = mockOnSubmit.mock.calls[0][0]
      expect(call.title).toBe('Tarefa Alta')
      expect(call.priority).toBe('HIGH')
    })
  })

  it('can enter description', async () => {
    const user = userEvent.setup()
    render(
      <KanbanTaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    )

    await user.type(screen.getByLabelText('Descrição (opcional)'), 'Descrição da tarefa')
    await user.type(screen.getByLabelText('Título da Tarefa'), 'Tarefa')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalled()
      const call = mockOnSubmit.mock.calls[0][0]
      expect(call.title).toBe('Tarefa')
      expect(call.description).toBe('Descrição da tarefa')
      expect(call.priority).toBe('MEDIUM')
    })
  })
})
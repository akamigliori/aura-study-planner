import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { BoardSelector } from '@/components/kanban/BoardSelector'
import { useKanbanStore } from '@/store/kanban.store'
import type { KanbanBoard } from '@/types/kanban.types'

const mockBoards: KanbanBoard[] = [
  {
    id: 'board-1',
    name: 'Quadro Principal',
    description: 'Meu quadro principal',
    columns: [
      { id: 'TODO', name: 'A Fazer' },
      { id: 'IN_PROGRESS', name: 'Em Progresso' },
      { id: 'DONE', name: 'Concluído' },
    ],
    userId: 'user-1',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'board-2',
    name: 'Quadro de Estudos',
    description: null,
    columns: [],
    userId: 'user-1',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
]

vi.mock('@/store/kanban.store', () => ({
  useKanbanStore: vi.fn(),
}))

const mockUseKanbanStore = useKanbanStore as ReturnType<typeof vi.fn>

describe('BoardSelector', () => {
  const mockOnCreateBoard = vi.fn()
  const mockOnEditBoard = vi.fn()
  const mockOnDeleteBoard = vi.fn()
  const mockSetActiveBoard = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseKanbanStore.mockReturnValue({
      boards: mockBoards,
      activeBoard: mockBoards[0],
      setActiveBoard: mockSetActiveBoard,
    })
  })

  it('renders active board name', () => {
    render(
      <BoardSelector
        onCreateBoard={mockOnCreateBoard}
        onEditBoard={mockOnEditBoard}
        onDeleteBoard={mockOnDeleteBoard}
      />
    )

    expect(screen.getByText('Quadro Principal')).toBeInTheDocument()
  })

  it('shows default text when no active board', () => {
    mockUseKanbanStore.mockReturnValue({
      boards: [],
      activeBoard: null,
      setActiveBoard: mockSetActiveBoard,
    })

    render(
      <BoardSelector
        onCreateBoard={mockOnCreateBoard}
        onEditBoard={mockOnEditBoard}
        onDeleteBoard={mockOnDeleteBoard}
      />
    )

    expect(screen.getByText('Selecionar Quadro')).toBeInTheDocument()
  })

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup()
    render(
      <BoardSelector
        onCreateBoard={mockOnCreateBoard}
        onEditBoard={mockOnEditBoard}
        onDeleteBoard={mockOnDeleteBoard}
      />
    )

    await user.click(screen.getByText('Quadro Principal'))

    await waitFor(() => {
      expect(screen.getByText('Meus Quadros')).toBeInTheDocument()
    })
  })

  it('lists all boards in dropdown', async () => {
    const user = userEvent.setup()
    render(
      <BoardSelector
        onCreateBoard={mockOnCreateBoard}
        onEditBoard={mockOnEditBoard}
        onDeleteBoard={mockOnDeleteBoard}
      />
    )

    await user.click(screen.getByText('Quadro Principal'))

    await waitFor(() => {
      expect(screen.getByText('Quadro de Estudos')).toBeInTheDocument()
    })
  })

  it('calls setActiveBoard when selecting a board', async () => {
    const user = userEvent.setup()
    render(
      <BoardSelector
        onCreateBoard={mockOnCreateBoard}
        onEditBoard={mockOnEditBoard}
        onDeleteBoard={mockOnDeleteBoard}
      />
    )

    await user.click(screen.getByText('Quadro Principal'))
    await user.click(screen.getByText('Quadro de Estudos'))

    expect(mockSetActiveBoard).toHaveBeenCalledWith(mockBoards[1])
  })

  it('shows settings menu when activeBoard exists', async () => {
    const user = userEvent.setup()
    render(
      <BoardSelector
        onCreateBoard={mockOnCreateBoard}
        onEditBoard={mockOnEditBoard}
        onDeleteBoard={mockOnDeleteBoard}
      />
    )

    const settingsButton = screen.getByTitle('Configurações do quadro')
    await user.click(settingsButton)

    await waitFor(() => {
      expect(screen.getByText('Editar quadro')).toBeInTheDocument()
      expect(screen.getByText('Excluir quadro')).toBeInTheDocument()
    })
  })

  it('calls onEditBoard when clicking edit', async () => {
    const user = userEvent.setup()
    render(
      <BoardSelector
        onCreateBoard={mockOnCreateBoard}
        onEditBoard={mockOnEditBoard}
        onDeleteBoard={mockOnDeleteBoard}
      />
    )

    const settingsButton = screen.getByTitle('Configurações do quadro')
    await user.click(settingsButton)
    await user.click(screen.getByText('Editar quadro'))

    expect(mockOnEditBoard).toHaveBeenCalledWith(mockBoards[0])
  })

  it('calls onDeleteBoard when clicking delete', async () => {
    const user = userEvent.setup()
    render(
      <BoardSelector
        onCreateBoard={mockOnCreateBoard}
        onEditBoard={mockOnEditBoard}
        onDeleteBoard={mockOnDeleteBoard}
      />
    )

    const settingsButton = screen.getByTitle('Configurações do quadro')
    await user.click(settingsButton)
    await user.click(screen.getByText('Excluir quadro'))

    expect(mockOnDeleteBoard).toHaveBeenCalledWith('board-1')
  })

  it('shows create new board option in dropdown', async () => {
    const user = userEvent.setup()
    render(
      <BoardSelector
        onCreateBoard={mockOnCreateBoard}
        onEditBoard={mockOnEditBoard}
        onDeleteBoard={mockOnDeleteBoard}
      />
    )

    await user.click(screen.getByText('Quadro Principal'))

    await waitFor(() => {
      expect(screen.getByText('Criar novo quadro')).toBeInTheDocument()
    })
  })

  it('calls onCreateBoard when clicking create new board', async () => {
    const user = userEvent.setup()
    render(
      <BoardSelector
        onCreateBoard={mockOnCreateBoard}
        onEditBoard={mockOnEditBoard}
        onDeleteBoard={mockOnDeleteBoard}
      />
    )

    await user.click(screen.getByText('Quadro Principal'))
    await user.click(screen.getByText('Criar novo quadro'))

    expect(mockOnCreateBoard).toHaveBeenCalled()
  })

  it('shows empty state when no boards', async () => {
    mockUseKanbanStore.mockReturnValue({
      boards: [],
      activeBoard: null,
      setActiveBoard: mockSetActiveBoard,
    })

    render(
      <BoardSelector
        onCreateBoard={mockOnCreateBoard}
        onEditBoard={mockOnEditBoard}
        onDeleteBoard={mockOnDeleteBoard}
      />
    )

    await userEvent.click(screen.getByText('Selecionar Quadro'))

    await waitFor(() => {
      expect(screen.getByText('Nenhum quadro encontrado')).toBeInTheDocument()
    })
  })
})
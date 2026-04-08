import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import { KanbanPage } from '@/features/kanban/KanbanPage'
import { useKanbanStore } from '@/store/kanban.store'
import type { KanbanBoard, KanbanTask, KanbanColumn } from '@/types/kanban.types'

vi.mock('@dnd-kit/sortable', async () => {
  const actual = await vi.importActual('@dnd-kit/sortable')
  return {
    ...actual,
    sortableKeyboardCoordinates: {},
    SortableContext: ({ children }: { children: React.ReactNode }) => children,
    verticalListSortingStrategy: {},
    useSortable: vi.fn(() => ({
      attributes: {},
      listeners: {},
      setNodeRef: vi.fn(),
      transform: null,
      transition: null,
      isDragging: false,
    })),
  }
})

vi.mock('@dnd-kit/core', async () => {
  const actual = await vi.importActual('@dnd-kit/core')
  return {
    ...actual,
    DndContext: ({ children }: { children: React.ReactNode }) => children,
    DragOverlay: ({ children }: { children: React.ReactNode }) => children,
    closestCorners: {},
    PointerSensor: vi.fn(() => ({})),
    KeyboardSensor: vi.fn(() => ({})),
    useSensor: vi.fn(() => ({})),
    useSensors: vi.fn(() => ({})),
    useDroppable: vi.fn(() => ({
      setNodeRef: vi.fn(),
      isOver: false,
    })),
  }
})

vi.mock('@/store/kanban.store', () => ({
  useKanbanStore: vi.fn(),
}))

const mockBoards: KanbanBoard[] = [
  {
    id: 'board-1',
    name: 'Quadro Principal',
    description: 'Meu quadro',
    columns: [
      { id: 'TODO', name: 'Para Fazer' },
      { id: 'IN_PROGRESS', name: 'Em Progresso' },
      { id: 'DONE', name: 'Concluído' },
    ],
    userId: 'user-1',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
]

const mockTasks: KanbanTask[] = [
  {
    id: 'task-1',
    title: 'Tarefa 1',
    description: null,
    column: 'TODO' as KanbanColumn,
    position: 0,
    priority: 'MEDIUM' as const,
    dueDate: null,
    boardId: 'board-1',
    userId: 'user-1',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'task-2',
    title: 'Tarefa 2',
    description: null,
    column: 'TODO' as KanbanColumn,
    position: 1,
    priority: 'HIGH' as const,
    dueDate: null,
    boardId: 'board-1',
    userId: 'user-1',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
]

const mockUseKanbanStore = useKanbanStore as ReturnType<typeof vi.fn>

describe('KanbanPage', () => {
  const mockFetchBoardsAndInitialize = vi.fn()
  const mockCreateBoard = vi.fn()
  const mockUpdateBoard = vi.fn()
  const mockDeleteBoard = vi.fn()
  const mockCreateTask = vi.fn()
  const mockUpdateTask = vi.fn()
  const mockMoveTask = vi.fn()
  const mockDeleteTask = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockCreateTask.mockResolvedValue(undefined)
    mockUpdateTask.mockResolvedValue(undefined)
    mockDeleteTask.mockResolvedValue(undefined)
    mockMoveTask.mockResolvedValue(undefined)
    mockCreateBoard.mockResolvedValue({})
    mockUpdateBoard.mockResolvedValue({})

    mockUseKanbanStore.mockReturnValue({
      activeBoard: mockBoards[0],
      boards: mockBoards,
      tasks: mockTasks,
      isLoading: false,
      fetchBoardsAndInitialize: mockFetchBoardsAndInitialize,
      createBoard: mockCreateBoard,
      updateBoard: mockUpdateBoard,
      deleteBoard: mockDeleteBoard,
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      moveTask: mockMoveTask,
      deleteTask: mockDeleteTask,
    })
  })

  it('fetches boards on mount', () => {
    render(<KanbanPage />)
    expect(mockFetchBoardsAndInitialize).toHaveBeenCalled()
  })

  it('renders board name', () => {
    render(<KanbanPage />)
    expect(screen.getByText('Quadro Principal')).toBeInTheDocument()
  })

  it('renders columns', () => {
    render(<KanbanPage />)
    expect(screen.getByText('Para Fazer')).toBeInTheDocument()
    expect(screen.getByText('Em Progresso')).toBeInTheDocument()
    expect(screen.getByText('Concluído')).toBeInTheDocument()
  })

  it('renders tasks', () => {
    render(<KanbanPage />)
    expect(screen.getByText('Tarefa 1')).toBeInTheDocument()
    expect(screen.getByText('Tarefa 2')).toBeInTheDocument()
  })

  it('renders task count in column', () => {
    render(<KanbanPage />)
    const todoColumn = screen.getByText('Para Fazer').closest('.flex.w-80')
    expect(todoColumn).toHaveTextContent('2')
  })

  it('opens task form when Nova Tarefa button is clicked', async () => {
    const user = userEvent.setup()
    render(<KanbanPage />)

    const buttons = await screen.findAllByRole('button', { name: 'Nova Tarefa' })
    await user.click(buttons[0])

    expect(screen.getByRole('heading', { name: 'Nova Tarefa' })).toBeInTheDocument()
    expect(screen.getByLabelText('Título da Tarefa')).toBeInTheDocument()
  })

  it('calls createTask when form is submitted', async () => {
    const user = userEvent.setup()
    render(<KanbanPage />)

    const buttons = await screen.findAllByRole('button', { name: 'Nova Tarefa' })
    await user.click(buttons[0])
    await user.type(screen.getByLabelText('Título da Tarefa'), 'Nova Tarefa')
    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    await waitFor(() => {
      expect(mockCreateTask).toHaveBeenCalled()
      const call = mockCreateTask.mock.calls[0]
      expect(call[0]).toBe('board-1')
      expect(call[1].title).toBe('Nova Tarefa')
      expect(call[1].priority).toBe('MEDIUM')
      expect(call[1].column).toBe('TODO')
    })
  })

  it('shows loading state when isLoading', () => {
    mockUseKanbanStore.mockReturnValue({
      activeBoard: null,
      boards: [],
      tasks: [],
      isLoading: true,
      fetchBoardsAndInitialize: mockFetchBoardsAndInitialize,
      createBoard: mockCreateBoard,
      updateBoard: mockUpdateBoard,
      deleteBoard: mockDeleteBoard,
      createTask: mockCreateTask,
      updateTask: mockUpdateTask,
      moveTask: mockMoveTask,
      deleteTask: mockDeleteTask,
    })

    render(<KanbanPage />)
    expect(document.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('renders BoardSelector component', () => {
    render(<KanbanPage />)
    expect(screen.getByText('Quadro Principal')).toBeInTheDocument()
  })
})
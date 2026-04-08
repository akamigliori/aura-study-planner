import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { KanbanColumn } from '@/features/kanban/KanbanColumn'
import type { KanbanTask, KanbanColumn as ColumnType } from '@/types/kanban.types'
import * as dndKit from '@dnd-kit/core'

vi.mock('@dnd-kit/core', () => ({
  useDroppable: vi.fn(() => ({
    setNodeRef: vi.fn(),
    isOver: false,
  })),
}))

vi.mock('@dnd-kit/sortable', () => ({
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
}))

const mockTasks: KanbanTask[] = [
  {
    id: 'task-1',
    title: 'Task 1',
    description: null,
    column: 'TODO' as ColumnType,
    position: 0,
    priority: 'LOW' as const,
    dueDate: null,
    boardId: 'board-1',
    userId: 'user-1',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'task-2',
    title: 'Task 2',
    description: null,
    column: 'TODO' as ColumnType,
    position: 1,
    priority: 'HIGH' as const,
    dueDate: null,
    boardId: 'board-1',
    userId: 'user-1',
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
]

const mockColumn = {
  id: 'TODO' as ColumnType,
  title: 'Para Fazer',
  color: '#3B82F6',
}

describe('KanbanColumn', () => {
  const mockOnAddTask = vi.fn()
  const mockOnEditTask = vi.fn()
  const mockOnDeleteTask = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders column title', () => {
    render(
      <KanbanColumn
        column={mockColumn}
        tasks={mockTasks}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(screen.getByText('Para Fazer')).toBeInTheDocument()
  })

  it('renders task count', () => {
    render(
      <KanbanColumn
        column={mockColumn}
        tasks={mockTasks}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders all tasks', () => {
    render(
      <KanbanColumn
        column={mockColumn}
        tasks={mockTasks}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(screen.getByText('Task 1')).toBeInTheDocument()
    expect(screen.getByText('Task 2')).toBeInTheDocument()
  })

  it('shows empty state when no tasks', () => {
    render(
      <KanbanColumn
        column={mockColumn}
        tasks={[]}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    expect(screen.getByText('Nenhuma tarefa')).toBeInTheDocument()
  })

  it('calls onAddTask when add button is clicked', () => {
    render(
      <KanbanColumn
        column={mockColumn}
        tasks={mockTasks}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    const addButton = screen.getByTitle('Nova Tarefa')
    addButton.click()

    expect(mockOnAddTask).toHaveBeenCalledWith('TODO')
  })

  it('renders column color indicator when color is provided', () => {
    render(
      <KanbanColumn
        column={mockColumn}
        tasks={[]}
        onAddTask={mockOnAddTask}
        onEditTask={mockOnEditTask}
        onDeleteTask={mockOnDeleteTask}
      />
    )

    const colorDot = document.querySelector('.rounded-full')
    expect(colorDot).toBeInTheDocument()
  })
})
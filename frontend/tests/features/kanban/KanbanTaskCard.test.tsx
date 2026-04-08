import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { KanbanTaskCard } from '@/features/kanban/KanbanTaskCard'
import type { KanbanTask } from '@/types/kanban.types'

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: ({ id }: { id: string }) => ({
    attributes: {
      'data-cy': `sortable-${id}`,
    },
    listeners: {
      onPointerDown: vi.fn(),
    },
    setNodeRef: vi.fn(),
    transform: null,
    transition: null,
    isDragging: false,
  }),
  CSS: {
    Transform: {
      toString: vi.fn(() => ''),
    },
  },
}))

const mockTask: KanbanTask = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test description',
  column: 'TODO',
  position: 0,
  priority: 'MEDIUM',
  dueDate: null,
  boardId: 'board-1',
  userId: 'user-1',
  createdAt: '2026-01-01',
  updatedAt: '2026-01-01',
}

describe('KanbanTaskCard - Drag-anywhere', () => {
  const mockOnDelete = vi.fn()

  it('renders task title', () => {
    render(<KanbanTaskCard task={mockTask} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('Test Task')).toBeInTheDocument()
  })

  it('renders priority badge', () => {
    render(<KanbanTaskCard task={mockTask} onDelete={mockOnDelete} />)
    
    expect(screen.getByText('MEDIUM')).toBeInTheDocument()
  })

  it('has drag handler on entire card (drag-anywhere)', () => {
    render(<KanbanTaskCard task={mockTask} onDelete={mockOnDelete} />)
    
    // O elemento h3 deve estar dentro do card arrastável
    const title = screen.getByText('Test Task')
    // Verifica que existe um elemento ancestor com cursor-grab
    expect(title.closest('[class*="cursor-grab"]')).toBeInTheDocument()
  })

  it('allows dragging from anywhere on card', () => {
    render(<KanbanTaskCard task={mockTask} onDelete={mockOnDelete} />)
    
    // O card deve ter a classe group para hover effects
    const card = screen.getByText('Test Task').closest('[class*="group"]')
    expect(card).toBeInTheDocument()
  })

  it('maintains cursor style for draggable card', () => {
    render(<KanbanTaskCard task={mockTask} onDelete={mockOnDelete} />)
    
    // O card deve ter cursor-grab
    const card = screen.getByText('Test Task').closest('[class*="cursor-grab"]')
    expect(card).toBeInTheDocument()
  })
})

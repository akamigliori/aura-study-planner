import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { DashboardPage } from '../../../src/features/dashboard/DashboardPage'

// Mock the stores so the component doesn't fail fetching
vi.mock('../../../src/store/subject.store.ts', () => ({
  useSubjectStore: () => ({ subjects: [], fetchSubjects: vi.fn() })
}))
vi.mock('../../../src/store/review.store.ts', () => ({
  useReviewStore: () => ({ dueReviews: [], fetchDueReviews: vi.fn() })
}))
vi.mock('../../../src/store/schedule.store.ts', () => ({
  useScheduleStore: () => ({ blocks: [], fetchSchedule: vi.fn() })
}))
vi.mock('../../../src/store/kanban.store.ts', () => ({
  useKanbanStore: () => ({ tasks: [], fetchBoardsAndInitialize: vi.fn() })
}))

describe('DashboardPage', () => {
  it('deve renderizar o título do painel corretamente', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText(/Visão Geral/i)).toBeInTheDocument()
  })

  it('deve exibir os cartões interativos de métricas', () => {
    render(<DashboardPage />)
    
    expect(screen.getByText(/Matérias Atívas/i)).toBeInTheDocument()
    expect(screen.getByText(/Revisões Hoje/i)).toBeInTheDocument()
    expect(screen.getByText(/Dias Seguidos/i)).toBeInTheDocument()
  })
})

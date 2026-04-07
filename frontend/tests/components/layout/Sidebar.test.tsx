import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from '../../../src/components/layout/Sidebar'
import { useAuthStore } from '../../../src/store/auth.store'

vi.mock('../../../src/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

describe('Sidebar', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@test.com',
    avatarUrl: null,
    createdAt: '2024-01-01',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  function renderSidebar() {
    return render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    )
  }

  it('should render the app name "Aura"', () => {
    vi.mocked(useAuthStore).mockReturnValue({ user: mockUser, logout: vi.fn() })
    renderSidebar()
    expect(screen.getByText('Aura')).toBeInTheDocument()
  })

  it('should render all navigation items', () => {
    vi.mocked(useAuthStore).mockReturnValue({ user: mockUser, logout: vi.fn() })
    renderSidebar()

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Matérias')).toBeInTheDocument()
    expect(screen.getByText('Cronograma')).toBeInTheDocument()
    expect(screen.getByText('Revisões')).toBeInTheDocument()
    expect(screen.getByText('Kanban')).toBeInTheDocument()
    expect(screen.getByText('Anotações')).toBeInTheDocument()
  })

  it('should display user name and email', () => {
    vi.mocked(useAuthStore).mockReturnValue({ user: mockUser, logout: vi.fn() })
    renderSidebar()

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@test.com')).toBeInTheDocument()
  })

  it('should display user initial when no avatar', () => {
    vi.mocked(useAuthStore).mockReturnValue({ user: mockUser, logout: vi.fn() })
    renderSidebar()

    expect(screen.getByText('T')).toBeInTheDocument()
  })

  it('should display "?" when user has no name', () => {
    const userWithoutName = { ...mockUser, name: '' }
    vi.mocked(useAuthStore).mockReturnValue({ user: userWithoutName, logout: vi.fn() })
    renderSidebar()

    expect(screen.getByText('U')).toBeInTheDocument()
  })

  it('should call logout and navigate to /login when logout button is clicked', async () => {
    const mockLogout = vi.fn()
    vi.mocked(useAuthStore).mockReturnValue({ user: mockUser, logout: mockLogout })

    renderSidebar()

    const logoutButton = screen.getByText('Sair').closest('button')
    expect(logoutButton).toBeInTheDocument()

    if (logoutButton) {
      await logoutButton.click()
    }

    expect(mockLogout).toHaveBeenCalledTimes(1)
  })
})

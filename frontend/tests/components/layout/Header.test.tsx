import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Header } from '../../../src/components/layout/Header'
import { useAuthStore } from '../../../src/store/auth.store'

vi.mock('../../../src/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

describe('Header', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@test.com'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useAuthStore).mockReturnValue({ user: mockUser, logout: vi.fn() })
  })

  function renderHeader() {
    return render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    )
  }

  it('should render the application title conditionally or just User info', () => {
    renderHeader()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('should have a button for notifications or settings', () => {
    renderHeader()
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})

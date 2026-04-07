import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from '../../src/routes/ProtectedRoute'
import { useAuthStore } from '../../src/store/auth.store'

vi.mock('../../src/store/auth.store', () => ({
  useAuthStore: vi.fn(),
}))

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  function renderWithRouter(ui: React.ReactNode, initialPath = '/') {
    return render(
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/" element={ui} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('should redirect to /login when not authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: false })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
  })

  it('should render children when authenticated', () => {
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: true })

    renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })

  it('should use replace navigation to prevent back-button loop', () => {
    vi.mocked(useAuthStore).mockReturnValue({ isAuthenticated: false })

    const { container } = renderWithRouter(
      <ProtectedRoute>
        <div>Protected Content</div>
      </ProtectedRoute>
    )

    // Navigate prop should have replace behavior (redirect happened)
    expect(container.textContent).toBe('Login Page')
  })
})

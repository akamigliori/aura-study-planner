import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { MainLayout } from '../../../src/components/layout/MainLayout'

vi.mock('../../../src/store/auth.store', () => ({
  useAuthStore: vi.fn(() => ({ user: null, logout: vi.fn() })),
}))

describe('MainLayout', () => {
  it('should render children', () => {
    render(
      <MemoryRouter>
        <MainLayout>
          <div>Page Content</div>
        </MainLayout>
      </MemoryRouter>
    )

    expect(screen.getByText('Page Content')).toBeInTheDocument()
  })

  it('should include Sidebar', () => {
    render(
      <MemoryRouter>
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      </MemoryRouter>
    )

    expect(screen.getByText('Aura')).toBeInTheDocument()
  })

  it('should render with main element', () => {
    const { container } = render(
      <MemoryRouter>
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      </MemoryRouter>
    )

    expect(container.querySelector('main')).toBeInTheDocument()
  })
})

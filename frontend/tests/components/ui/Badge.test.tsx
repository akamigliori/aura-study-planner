import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from '../../../src/components/ui/Badge'

describe('Badge', () => {
  it('should render children', () => {
    render(<Badge>Active</Badge>)
    expect(screen.getByText(/active/i)).toBeInTheDocument()
  })

  it('should apply default variant', () => {
    render(<Badge>Default</Badge>)
    expect(screen.getByText(/default/i)).toHaveClass('bg-primary-100')
  })

  it('should apply success variant', () => {
    render(<Badge variant="success">Success</Badge>)
    expect(screen.getByText(/success/i)).toHaveClass('bg-green-100')
  })

  it('should apply warning variant', () => {
    render(<Badge variant="warning">Warning</Badge>)
    expect(screen.getByText(/warning/i)).toHaveClass('bg-yellow-100')
  })

  it('should apply danger variant', () => {
    render(<Badge variant="danger">Danger</Badge>)
    expect(screen.getByText(/danger/i)).toHaveClass('bg-red-100')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from '../../../src/components/ui/Card'

describe('Card', () => {
  it('should render children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText(/card content/i)).toBeInTheDocument()
  })

  it('should render with title', () => {
    render(<Card title="My Card">Content</Card>)
    expect(screen.getByText(/my card/i)).toBeInTheDocument()
  })

  it('should be clickable when onClick is provided', () => {
    render(<Card onClick={() => {}}>Clickable</Card>)
    expect(screen.getByText(/clickable/i).closest('div')).toHaveAttribute('role', 'button')
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Avatar } from '../../../src/components/ui/Avatar'

describe('Avatar', () => {
  it('should render with image', () => {
    render(<Avatar src="/photo.jpg" alt="User" />)
    expect(screen.getByAltText(/user/i)).toHaveAttribute('src', '/photo.jpg')
  })

  it('should render initials when no image', () => {
    render(<Avatar initials="JD" />)
    expect(screen.getByText(/JD/i)).toBeInTheDocument()
  })

  it('should apply small size', () => {
    render(<Avatar initials="JD" size="sm" />)
    const container = screen.getByText(/JD/i).parentElement
    expect(container).toHaveClass('w-8 h-8')
  })

  it('should apply large size', () => {
    render(<Avatar initials="JD" size="lg" />)
    const container = screen.getByText(/JD/i).parentElement
    expect(container).toHaveClass('w-16 h-16')
  })
})

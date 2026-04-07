import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '../../../src/components/ui/Button'

describe('Button', () => {
  it('should render children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('should apply primary variant by default', () => {
    render(<Button>Primary</Button>)
    const button = screen.getByRole('button', { name: /primary/i })
    expect(button).toHaveClass('bg-primary-600')
  })

  it('should apply secondary variant', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByRole('button', { name: /secondary/i })
    expect(button).toHaveClass('bg-white')
  })

  it('should apply danger variant', () => {
    render(<Button variant="danger">Delete</Button>)
    const button = screen.getByRole('button', { name: /delete/i })
    expect(button).toHaveClass('bg-red-600')
  })

  it('should apply ghost variant', () => {
    render(<Button variant="ghost">Ghost</Button>)
    const button = screen.getByRole('button', { name: /ghost/i })
    expect(button).toHaveClass('bg-transparent')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled()
  })

  it('should call onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await screen.getByRole('button', { name: /click/i }).click()
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('should apply full width when fullWidth is true', () => {
    render(<Button fullWidth>Full Width</Button>)
    expect(screen.getByRole('button', { name: /full width/i })).toHaveClass('w-full')
  })

  it('should render with small size', () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button', { name: /small/i })).toHaveClass('px-3')
  })

  it('should render with large size', () => {
    render(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button', { name: /large/i })).toHaveClass('px-8')
  })
})

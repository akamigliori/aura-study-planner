import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from '../../../src/components/ui/Input'

describe('Input', () => {
  it('should render with label', () => {
    render(<Input id="email" label="Email" />)
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('should render error message', () => {
    render(<Input id="email" label="Email" error="Invalid email" />)
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument()
  })

  it('should render placeholder', () => {
    render(<Input id="name" label="Name" placeholder="Enter name" />)
    expect(screen.getByPlaceholderText(/enter name/i)).toBeInTheDocument()
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input id="name" label="Name" disabled />)
    expect(screen.getByLabelText(/name/i)).toBeDisabled()
  })

  it('should render with type password', () => {
    render(<Input id="pass" label="Password" type="password" />)
    expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password')
  })

  it('should render with icon', () => {
    const Icon = () => <svg data-testid="icon" />
    render(<Input id="search" label="Search" icon={<Icon />} />)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})

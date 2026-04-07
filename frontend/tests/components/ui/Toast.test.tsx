import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Toast } from '../../../src/components/ui/Toast'

describe('Toast', () => {
  it('should not render when message is empty', () => {
    render(<Toast message="" type="success" />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('should render message', () => {
    render(<Toast message="Success!" type="success" />)
    expect(screen.getByText(/success!/i)).toBeInTheDocument()
  })

  it('should apply success type', () => {
    render(<Toast message="Done" type="success" />)
    expect(screen.getByText(/done/i)).toHaveClass('bg-green-600')
  })

  it('should apply error type', () => {
    render(<Toast message="Error" type="error" />)
    expect(screen.getByText(/error/i)).toHaveClass('bg-red-600')
  })
})

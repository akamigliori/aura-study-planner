import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Modal } from '../../../src/components/ui/Modal'

describe('Modal', () => {
  it('should not render when isOpen is false', () => {
    render(<Modal isOpen={false} onClose={() => {}}>Content</Modal>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should render when isOpen is true', () => {
    render(<Modal isOpen={true} onClose={() => {}}>Content</Modal>)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/content/i)).toBeInTheDocument()
  })

  it('should render title', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="My Modal">
        Content
      </Modal>
    )
    expect(screen.getByText(/my modal/i)).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', async () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        Content
      </Modal>
    )
    const closeBtn = screen.getByLabelText('Close')
    await closeBtn.click()
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})

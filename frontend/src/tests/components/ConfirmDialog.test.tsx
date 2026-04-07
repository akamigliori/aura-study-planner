import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'

describe('ConfirmDialog Component', () => {
  it('renders correctly when isOpen is true', () => {
    render(
      <ConfirmDialog 
        isOpen={true} 
        title="Atenção" 
        description="Tem certeza?" 
        onConfirm={vi.fn()} 
        onClose={vi.fn()} 
      />
    )
    
    expect(screen.getByText('Atenção')).toBeInTheDocument()
    expect(screen.getByText('Tem certeza?')).toBeInTheDocument()
  })

  it('calls onConfirm when confirm button is clicked', () => {
    const handleConfirm = vi.fn()
    const handleClose = vi.fn()

    render(
      <ConfirmDialog 
        isOpen={true} 
        title="Atenção" 
        description="Tem certeza?" 
        onConfirm={handleConfirm} 
        onClose={handleClose} 
      />
    )

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar' }))
    expect(handleConfirm).toHaveBeenCalled()
    expect(handleClose).toHaveBeenCalled() // Close is called automatically
  })
})

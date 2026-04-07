import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { SubjectForm } from '../../../src/features/subjects/SubjectForm'

describe('SubjectForm', () => {
  it('deve renderizar os campos obrigatórios', () => {
    // Renderiza a ui sem propriedades
    render(<SubjectForm onSubmit={vi.fn()} onCancel={vi.fn()} />)
    
    expect(screen.getByLabelText(/Nome/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Cor/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Salvar/i })).toBeInTheDocument()
  })

  it('deve disparar erros de validação ao submeter dados vazios', async () => {
    const handleSubmit = vi.fn()
    render(<SubjectForm onSubmit={handleSubmit} onCancel={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }))

    expect(await screen.findByText(/Nome é obrigatório/i)).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('deve preencher os campos com initialData quando for fornecido', () => {
    const initialData = { name: 'História', color: '#ffcc00', icon: 'book' }
    render(<SubjectForm initialData={initialData} onSubmit={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByLabelText(/Nome/i)).toHaveValue('História')
    expect(screen.getByLabelText(/Cor/i)).toHaveValue('#ffcc00')
  })

  it('deve chamar onSubmit em caso de sucesso', async () => {
    const handleSubmit = vi.fn()
    render(<SubjectForm onSubmit={handleSubmit} onCancel={vi.fn()} />)

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Geografia' } })
    fireEvent.change(screen.getByLabelText(/Cor/i), { target: { value: '#00ffcc' } })
    
    fireEvent.click(screen.getByRole('button', { name: /Salvar/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'Geografia',
        color: '#00ffcc',
        icon: ''
      })
    })
  })
})

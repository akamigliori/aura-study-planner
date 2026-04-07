import { describe, it, expect, beforeEach } from 'vitest'
import { useKanbanStore } from '../../../src/store/kanban.store'

describe('KanbanStore', () => {
  beforeEach(() => {
    useKanbanStore.setState({ board: null, isLoading: false, error: null })
  })

  it('deve inicializar com board null', () => {
    const { board, isLoading, error } = useKanbanStore.getState()
    expect(board).toBeNull()
    expect(isLoading).toBe(false)
    expect(error).toBeNull()
  })
})

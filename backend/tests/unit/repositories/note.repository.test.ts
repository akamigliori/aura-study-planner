import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NoteRepository } from '../../../src/repositories/note.repository'
import type { PrismaClient, Note } from '../../../src/generated'

function createMockPrisma() {
  return {
    note: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  } as unknown as PrismaClient
}

describe('NoteRepository', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>
  let repo: NoteRepository

  const mockNote: Note = {
    id: 'note-1',
    title: 'Math Notes',
    content: '# Derivatives\n\nf\'(x) = ...',
    subjectId: 'sub-1',
    userId: 'user-1',
    tags: 'math,calculus',
    isPinned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    repo = new NoteRepository(mockPrisma)
    vi.clearAllMocks()
  })

  describe('findByUserId', () => {
    it('should return all notes for a user', async () => {
      vi.mocked(mockPrisma.note.findMany).mockResolvedValue([mockNote])

      const result = await repo.findByUserId('user-1')

      expect(result).toEqual([mockNote])
    })
  })

  describe('findByIdAndUserId', () => {
    it('should return note when found', async () => {
      vi.mocked(mockPrisma.note.findUnique).mockResolvedValue(mockNote)

      const result = await repo.findByIdAndUserId('note-1', 'user-1')

      expect(result).toEqual(mockNote)
    })

    it('should return null when not found', async () => {
      vi.mocked(mockPrisma.note.findUnique).mockResolvedValue(null)

      const result = await repo.findByIdAndUserId('note-1', 'user-1')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create and return note', async () => {
      vi.mocked(mockPrisma.note.create).mockResolvedValue(mockNote)

      const result = await repo.create({
        title: 'Math Notes',
        content: '# Derivatives',
        userId: 'user-1',
        subjectId: 'sub-1',
      })

      expect(result).toEqual(mockNote)
    })
  })

  describe('update', () => {
    it('should update and return note', async () => {
      const updated = { ...mockNote, title: 'Updated' }
      vi.mocked(mockPrisma.note.update).mockResolvedValue(updated)

      const result = await repo.update('note-1', 'user-1', { title: 'Updated' })

      expect(result.title).toBe('Updated')
    })
  })

  describe('delete', () => {
    it('should delete note', async () => {
      vi.mocked(mockPrisma.note.delete).mockResolvedValue(mockNote)

      const result = await repo.delete('note-1', 'user-1')

      expect(result).toEqual(mockNote)
    })
  })
})

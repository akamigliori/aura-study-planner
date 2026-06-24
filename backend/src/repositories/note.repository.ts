/**
 * Note repository — data access layer for Note model.
 */

import { PrismaClient, Note } from '../generated/client'

export class NoteRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUserId(userId: string): Promise<Note[]> {
    return this.prisma.note.findMany({
      where: { userId },
      orderBy: [{ isPinned: 'desc' }, { updatedAt: 'desc' }],
    })
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Note | null> {
    return this.prisma.note.findUnique({
      where: { id, userId },
    })
  }

  async create(data: {
    title: string
    content?: string
    subjectId?: string | null
    userId: string
    tags?: string | null
    isPinned?: boolean
  }): Promise<Note> {
    return this.prisma.note.create({ data })
  }

  async update(id: string, userId: string, data: Partial<Note>): Promise<Note> {
    return this.prisma.note.update({
      where: { id, userId },
      data,
    })
  }

  async delete(id: string, userId: string): Promise<Note> {
    return this.prisma.note.delete({
      where: { id, userId },
    })
  }
}

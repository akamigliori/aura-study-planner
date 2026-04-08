/**
 * Note service — business logic for note operations.
 */

import { PrismaClient } from './generated/client'
import { NoteRepository } from '../repositories/note.repository.js'
import { NotFoundError } from '../utils/errors.js'
import type { CreateNoteInput, UpdateNoteInput } from '../schemas/note.schema.js'

export class NoteService {
  private repository: NoteRepository

  constructor(private prisma: PrismaClient) {
    this.repository = new NoteRepository(prisma)
  }

  async listByUser(userId: string) {
    return this.repository.findByUserId(userId)
  }

  async getById(id: string, userId: string) {
    const note = await this.repository.findByIdAndUserId(id, userId)
    if (!note) throw new NotFoundError('Note')
    return note
  }

  async create(userId: string, input: CreateNoteInput) {
    return this.repository.create({ ...input, userId })
  }

  async update(id: string, userId: string, input: UpdateNoteInput) {
    await this.getById(id, userId)
    return this.repository.update(id, userId, input)
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId)
    return this.repository.delete(id, userId)
  }
}

/**
 * Subject service — business logic for subject operations.
 */

import { PrismaClient } from './generated/client'
import { SubjectRepository } from '../repositories/subject.repository.js'
import { NotFoundError } from '../utils/errors.js'
import type { CreateSubjectInput, UpdateSubjectInput } from '../schemas/subject.schema.js'

export class SubjectService {
  private repository: SubjectRepository

  constructor(private prisma: PrismaClient) {
    this.repository = new SubjectRepository(prisma)
  }

  /**
   * List all subjects for a user.
   */
  async listByUser(userId: string) {
    return this.repository.findByUserId(userId)
  }

  /**
   * Get a single subject by ID, ensuring ownership.
   */
  async getById(id: string, userId: string) {
    const subject = await this.repository.findByIdAndUserId(id, userId)

    if (!subject) {
      throw new NotFoundError('Subject')
    }

    return subject
  }

  /**
   * Create a new subject.
   */
  async create(userId: string, input: CreateSubjectInput) {
    return this.repository.create({
      ...input,
      userId,
    })
  }

  /**
   * Update an existing subject.
   */
  async update(id: string, userId: string, input: UpdateSubjectInput) {
    await this.getById(id, userId)

    return this.repository.update(id, userId, input)
  }

  /**
   * Delete a subject.
   */
  async delete(id: string, userId: string) {
    await this.getById(id, userId)

    return this.repository.delete(id, userId)
  }
}

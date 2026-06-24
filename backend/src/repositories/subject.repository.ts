/**
 * Subject repository — data access layer for Subject model.
 *
 * Provides type-safe database operations for study subjects
 * scoped to a specific user.
 */

import { PrismaClient, Subject } from '../generated/client'

export class SubjectRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find all subjects for a user, ordered by creation date.
   */
  async findByUserId(userId: string): Promise<Subject[]> {
    return this.prisma.subject.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  }

  /**
   * Find a subject by ID, ensuring it belongs to the user.
   */
  async findByIdAndUserId(
    id: string,
    userId: string
  ): Promise<Subject | null> {
    return this.prisma.subject.findUnique({
      where: { id, userId },
    })
  }

  /**
   * Create a new subject for a user.
   */
  async create(data: {
    name: string
    color: string
    description?: string
    userId: string
  }): Promise<Subject> {
    return this.prisma.subject.create({ data })
  }

  /**
   * Update a subject, ensuring it belongs to the user.
   */
  async update(
    id: string,
    userId: string,
    data: Partial<Subject>
  ): Promise<Subject> {
    return this.prisma.subject.update({
      where: { id, userId },
      data,
    })
  }

  /**
   * Delete a subject, ensuring it belongs to the user.
   */
  async delete(id: string, userId: string): Promise<Subject> {
    return this.prisma.subject.delete({
      where: { id, userId },
    })
  }
}

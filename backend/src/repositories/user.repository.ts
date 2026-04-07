/**
 * User repository — data access layer for User model.
 *
 * Provides type-safe database operations using Prisma Client.
 * Abstracts database queries from business logic in services.
 *
 * Usage:
 *   const repo = new UserRepository(prisma)
 *   const user = await repo.findByEmail('test@example.com')
 */

import { PrismaClient, User } from '../generated'

export class UserRepository {
  constructor(private prisma: PrismaClient) {}

  /**
   * Find user by email address.
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    })
  }

  /**
   * Find user by ID.
   */
  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    })
  }

  /**
   * Create a new user.
   */
  async create(data: {
    name: string
    email: string
    password: string
  }): Promise<User> {
    return this.prisma.user.create({
      data,
    })
  }

  /**
   * Update user fields.
   */
  async update(id: string, data: Partial<User>): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    })
  }

  /**
   * Check if email is already taken.
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email)
    return user !== null
  }
}

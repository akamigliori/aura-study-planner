/**
 * Schedule service — business logic for schedule operations.
 */

import { PrismaClient } from './generated/client'
import { ScheduleRepository } from '../repositories/schedule.repository.js'
import { NotFoundError } from '../utils/errors.js'
import type { CreateScheduleInput, UpdateScheduleInput } from '../schemas/schedule.schema.js'

export class ScheduleService {
  private repository: ScheduleRepository

  constructor(private prisma: PrismaClient) {
    this.repository = new ScheduleRepository(prisma)
  }

  async listByUser(userId: string) {
    return this.repository.findByUserId(userId)
  }

  async getById(id: string, userId: string) {
    const schedule = await this.repository.findByIdAndUserId(id, userId)

    if (!schedule) {
      throw new NotFoundError('Schedule')
    }

    return schedule
  }

  async create(userId: string, input: CreateScheduleInput) {
    return this.repository.create({ ...input, userId })
  }

  async update(id: string, userId: string, input: UpdateScheduleInput) {
    await this.getById(id, userId)
    return this.repository.update(id, userId, input)
  }

  async delete(id: string, userId: string) {
    await this.getById(id, userId)
    return this.repository.delete(id, userId)
  }
}

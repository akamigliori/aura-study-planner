/**
 * Schedule repository — data access layer for Schedule model.
 */

import { PrismaClient, Schedule } from '../generated/client'

export class ScheduleRepository {
  constructor(private prisma: PrismaClient) {}

  async findByUserId(userId: string): Promise<Schedule[]> {
    return this.prisma.schedule.findMany({
      where: { userId },
      include: { subject: true },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    })
  }

  async findByIdAndUserId(
    id: string,
    userId: string
  ): Promise<Schedule | null> {
    return this.prisma.schedule.findUnique({
      where: { id, userId },
    })
  }

  async create(data: {
    dayOfWeek: number
    startTime: string
    endTime: string
    subjectId: string
    userId: string
  }): Promise<Schedule> {
    return this.prisma.schedule.create({ data })
  }

  async update(
    id: string,
    userId: string,
    data: Partial<Schedule>
  ): Promise<Schedule> {
    return this.prisma.schedule.update({
      where: { id, userId },
      data,
    })
  }

  async delete(id: string, userId: string): Promise<Schedule> {
    return this.prisma.schedule.delete({
      where: { id, userId },
    })
  }
}

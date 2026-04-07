import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ScheduleRepository } from '../../../src/repositories/schedule.repository'
import type { PrismaClient, Schedule } from '../../../src/generated'

function createMockPrisma() {
  return {
    schedule: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  } as unknown as PrismaClient
}

describe('ScheduleRepository', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>
  let repo: ScheduleRepository

  const mockSchedule: Schedule = {
    id: 'sched-1',
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '10:00',
    subjectId: 'sub-1',
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  beforeEach(() => {
    mockPrisma = createMockPrisma()
    repo = new ScheduleRepository(mockPrisma)
    vi.clearAllMocks()
  })

  describe('findByUserId', () => {
    it('should return all schedules for a user', async () => {
      vi.mocked(mockPrisma.schedule.findMany).mockResolvedValue([mockSchedule])

      const result = await repo.findByUserId('user-1')

      expect(result).toEqual([mockSchedule])
    })
  })

  describe('findByIdAndUserId', () => {
    it('should return schedule when found', async () => {
      vi.mocked(mockPrisma.schedule.findUnique).mockResolvedValue(mockSchedule)

      const result = await repo.findByIdAndUserId('sched-1', 'user-1')

      expect(result).toEqual(mockSchedule)
    })

    it('should return null when not found', async () => {
      vi.mocked(mockPrisma.schedule.findUnique).mockResolvedValue(null)

      const result = await repo.findByIdAndUserId('sched-1', 'user-1')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create and return schedule', async () => {
      vi.mocked(mockPrisma.schedule.create).mockResolvedValue(mockSchedule)

      const result = await repo.create({
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '10:00',
        subjectId: 'sub-1',
        userId: 'user-1',
      })

      expect(result).toEqual(mockSchedule)
    })
  })

  describe('update', () => {
    it('should update and return schedule', async () => {
      const updated = { ...mockSchedule, dayOfWeek: 2 }
      vi.mocked(mockPrisma.schedule.update).mockResolvedValue(updated)

      const result = await repo.update('sched-1', 'user-1', { dayOfWeek: 2 })

      expect(result.dayOfWeek).toBe(2)
    })
  })

  describe('delete', () => {
    it('should delete schedule', async () => {
      vi.mocked(mockPrisma.schedule.delete).mockResolvedValue(mockSchedule)

      const result = await repo.delete('sched-1', 'user-1')

      expect(result).toEqual(mockSchedule)
    })
  })
})

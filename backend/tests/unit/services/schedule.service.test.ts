import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ScheduleService } from '../../../src/services/schedule.service'
import { PrismaClient } from '../../../src/generated'
import { NotFoundError } from '../../../src/utils/errors'

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

describe('ScheduleService', () => {
  let mockPrisma: ReturnType<typeof createMockPrisma>
  let service: ScheduleService

  const mockSchedule = {
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
    service = new ScheduleService(mockPrisma)
    vi.clearAllMocks()
  })

  describe('listByUser', () => {
    it('should return all schedules for a user', async () => {
      vi.mocked(mockPrisma.schedule.findMany).mockResolvedValue([mockSchedule])

      const result = await service.listByUser('user-1')

      expect(result).toHaveLength(1)
    })
  })

  describe('getById', () => {
    it('should return schedule when found', async () => {
      vi.mocked(mockPrisma.schedule.findUnique).mockResolvedValue(mockSchedule)

      const result = await service.getById('sched-1', 'user-1')

      expect(result).toEqual(mockSchedule)
    })

    it('should throw NotFoundError when not found', async () => {
      vi.mocked(mockPrisma.schedule.findUnique).mockResolvedValue(null)

      await expect(service.getById('sched-1', 'user-1')).rejects.toThrow(
        'Schedule not found'
      )
    })
  })

  describe('create', () => {
    it('should create and return schedule', async () => {
      vi.mocked(mockPrisma.schedule.create).mockResolvedValue(mockSchedule)

      const result = await service.create('user-1', {
        dayOfWeek: 1,
        startTime: '08:00',
        endTime: '10:00',
        subjectId: 'sub-1',
      })

      expect(result).toEqual(mockSchedule)
    })
  })

  describe('update', () => {
    it('should update and return schedule', async () => {
      const updated = { ...mockSchedule, dayOfWeek: 2 }
      vi.mocked(mockPrisma.schedule.findUnique).mockResolvedValue(mockSchedule)
      vi.mocked(mockPrisma.schedule.update).mockResolvedValue(updated)

      const result = await service.update('sched-1', 'user-1', { dayOfWeek: 2 })

      expect(result.dayOfWeek).toBe(2)
    })

    it('should throw NotFoundError when schedule does not exist', async () => {
      vi.mocked(mockPrisma.schedule.findUnique).mockResolvedValue(null)

      await expect(
        service.update('sched-1', 'user-1', { dayOfWeek: 2 })
      ).rejects.toThrow('Schedule not found')
    })
  })

  describe('delete', () => {
    it('should delete schedule', async () => {
      vi.mocked(mockPrisma.schedule.findUnique).mockResolvedValue(mockSchedule)
      vi.mocked(mockPrisma.schedule.delete).mockResolvedValue(mockSchedule)

      const result = await service.delete('sched-1', 'user-1')

      expect(result).toEqual(mockSchedule)
    })

    it('should throw NotFoundError when schedule does not exist', async () => {
      vi.mocked(mockPrisma.schedule.findUnique).mockResolvedValue(null)

      await expect(service.delete('sched-1', 'user-1')).rejects.toThrow(
        'Schedule not found'
      )
    })
  })
})

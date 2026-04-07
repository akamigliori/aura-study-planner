/**
 * Zod schemas for schedule request validation.
 */

import { z } from 'zod'

export const createScheduleSchema = z.object({
  body: z.object({
    dayOfWeek: z.number().int().min(0).max(6, 'dayOfWeek must be 0-6'),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:MM)'),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format (HH:MM)'),
    subjectId: z.string().min(1, 'Subject ID is required'),
  }),
})

export const updateScheduleSchema = z.object({
  body: z.object({
    dayOfWeek: z.number().int().min(0).max(6, 'dayOfWeek must be 0-6').optional(),
    startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format').optional(),
    endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format').optional(),
    subjectId: z.string().min(1, 'Subject ID is required').optional(),
  }),
})

export type CreateScheduleInput = z.infer<typeof createScheduleSchema>['body']
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>['body']

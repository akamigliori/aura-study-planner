export interface ScheduleBlock {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  subjectId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateScheduleData {
  dayOfWeek: number
  startTime: string
  endTime: string
  subjectId: string
}

export interface UpdateScheduleData {
  dayOfWeek?: number
  startTime?: string
  endTime?: string
  subjectId?: string
}

export type ReviewStatus = 'PENDING' | 'DUE' | 'COMPLETED' | 'SKIPPED'
export type ReviewQuality = 0 | 1 | 2 | 3 | 4 | 5

export interface ReviewTopic {
  id: string
  name: string
  description: string | null
  subjectId: string
}

export interface Review {
  id: string
  topicId: string
  userId: string
  interval: number
  easeFactor: number
  nextReview: string
  lastReview: string | null
  streak: number
  status: ReviewStatus
  createdAt: string
  updatedAt: string
  topic: ReviewTopic
}

export interface ReviewSession {
  total: number
  completed: number
  skipped: number
}

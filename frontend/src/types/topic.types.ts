export interface Topic {
  id: string
  name: string
  description: string | null
  subjectId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTopicData {
  name: string
  description?: string
}

export interface UpdateTopicData {
  name?: string
  description?: string
}

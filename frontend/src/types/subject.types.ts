export interface Subject {
  id: string
  name: string
  color: string
  icon: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateSubjectRequest {
  name: string
  color: string
  icon?: string | null
}

export interface UpdateSubjectRequest {
  name?: string
  color?: string
  icon?: string | null
}

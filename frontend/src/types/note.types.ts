export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  isPinned: boolean
  subjectId: string | null
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateNoteData {
  title: string
  content: string
  subjectId?: string
  tags?: string[]
  isPinned?: boolean
}

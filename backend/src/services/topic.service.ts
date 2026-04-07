/**
 * Topic service — business logic for topic operations.
 */

import { PrismaClient } from '../generated'
import { TopicRepository } from '../repositories/topic.repository.js'
import { NotFoundError } from '../utils/errors.js'
import type { CreateTopicInput, UpdateTopicInput } from '../schemas/topic.schema.js'

export class TopicService {
  private repository: TopicRepository

  constructor(private prisma: PrismaClient) {
    this.repository = new TopicRepository(prisma)
  }

  async listBySubject(subjectId: string) {
    return this.repository.findBySubjectId(subjectId)
  }

  async getById(id: string, subjectId: string) {
    const topic = await this.repository.findByIdAndSubjectId(id, subjectId)

    if (!topic) {
      throw new NotFoundError('Topic')
    }

    return topic
  }

  async create(subjectId: string, input: CreateTopicInput) {
    return this.repository.create({ ...input, subjectId })
  }

  async update(id: string, subjectId: string, input: UpdateTopicInput) {
    await this.getById(id, subjectId)
    return this.repository.update(id, subjectId, input)
  }

  async delete(id: string, subjectId: string) {
    await this.getById(id, subjectId)
    return this.repository.delete(id, subjectId)
  }
}

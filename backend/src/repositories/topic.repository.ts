/**
 * Topic repository — data access layer for Topic model.
 */

import { PrismaClient, Topic } from './generated/client'

export class TopicRepository {
  constructor(private prisma: PrismaClient) {}

  async findBySubjectId(subjectId: string): Promise<Topic[]> {
    return this.prisma.topic.findMany({
      where: { subjectId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findByIdAndSubjectId(
    id: string,
    subjectId: string
  ): Promise<Topic | null> {
    return this.prisma.topic.findUnique({
      where: { id, subjectId },
    })
  }

  async create(data: {
    name: string
    description?: string
    subjectId: string
  }): Promise<Topic> {
    return this.prisma.topic.create({ data })
  }

  async update(
    id: string,
    subjectId: string,
    data: Partial<Topic>
  ): Promise<Topic> {
    return this.prisma.topic.update({
      where: { id, subjectId },
      data,
    })
  }

  async delete(id: string, subjectId: string): Promise<Topic> {
    return this.prisma.topic.delete({
      where: { id, subjectId },
    })
  }
}

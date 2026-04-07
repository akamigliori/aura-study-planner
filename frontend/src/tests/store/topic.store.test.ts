import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useTopicStore } from '../../store/topic.store'
import { api } from '../../lib/api'

vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  }
}))

describe('Topic Store', () => {
  beforeEach(() => {
    useTopicStore.setState({ topics: [], isLoading: false, error: null })
  })

  it('fetches topics successfully', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: { topics: [] } })
    const store = useTopicStore.getState()
    await store.fetchTopics('subject-1')
    
    expect(useTopicStore.getState().topics).toEqual([])
    expect(useTopicStore.getState().isLoading).toBe(false)
  })

  it('adds a new topic', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { topic: { id: 'new-id', name: 'New Topic', subjectId: 'subj-1' } }
    })

    const store = useTopicStore.getState()
    await store.addTopic('subj-1', { name: 'New Topic' })
    
    expect(useTopicStore.getState().topics.length).toBe(1)
    expect(useTopicStore.getState().topics[0].name).toBe('New Topic')
  })
})

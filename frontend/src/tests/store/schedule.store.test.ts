import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useScheduleStore } from '../../store/schedule.store'
import { api } from '../../lib/api'

vi.mock('../../lib/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
  }
}))

describe('Schedule Store', () => {
  beforeEach(() => {
    useScheduleStore.setState({ blocks: [], isLoading: false, error: null })
  })

  it('fetches schedule successfully', async () => {
    vi.mocked(api.get).mockResolvedValueOnce({ data: { blocks: [] } })
    const store = useScheduleStore.getState()
    await store.fetchSchedule()
    
    expect(useScheduleStore.getState().blocks).toEqual([])
    expect(useScheduleStore.getState().isLoading).toBe(false)
  })

  it('adds a new block', async () => {
    vi.mocked(api.post).mockResolvedValueOnce({
      data: { schedule: { id: 'bk-1', dayOfWeek: 2, startTime: '10:00', endTime: '12:00', subjectId: 'subj-1', userId: 'user-1', createdAt: '', updatedAt: '' } }
    })

    const store = useScheduleStore.getState()
    await store.addBlock({ dayOfWeek: 2, startTime: '10:00', endTime: '12:00', subjectId: 'subj-1' })
    
    expect(useScheduleStore.getState().blocks.length).toBe(1)
    expect(useScheduleStore.getState().blocks[0].id).toBe('bk-1')
  })
})

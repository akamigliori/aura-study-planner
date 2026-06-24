import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MetricCard } from './MetricCard'
import { useSubjectStore } from '../../store/subject.store'
import { useReviewStore } from '../../store/review.store'
import { useScheduleStore } from '../../store/schedule.store'
import { useKanbanStore } from '../../store/kanban.store'
import { useAuthStore } from '../../store/auth.store'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <span className="font-mono text-[8.5px] tracking-[0.13em] uppercase text-ink-dim">
        {children}
      </span>
      <span className="flex-1 h-px bg-edge" />
    </div>
  )
}

export function DashboardPage() {
  const { subjects, fetchSubjects } = useSubjectStore()
  const { dueReviews, fetchDueReviews } = useReviewStore()
  const { blocks, fetchSchedule } = useScheduleStore()
  const { tasks: kanbanTasks, fetchBoardsAndInitialize } = useKanbanStore()
  const { user } = useAuthStore()

  useEffect(() => {
    fetchSubjects()
    fetchDueReviews()
    fetchSchedule()
    fetchBoardsAndInitialize()
  }, [fetchSubjects, fetchDueReviews, fetchSchedule, fetchBoardsAndInitialize])

  const firstName = user?.name?.split(' ')[0] || 'você'

  const maxStreak = dueReviews.reduce((acc, curr) => Math.max(acc, curr.streak || 0), 0)

  const kanbanInProgress = useMemo(
    () => kanbanTasks.filter((t) => t.column === 'IN_PROGRESS').length,
    [kanbanTasks],
  )

  const nextBlock = useMemo(() => {
    if (!blocks?.length) return null
    const sorted = [...blocks].sort((a, b) => a.startTime.localeCompare(b.startTime))
    const block = sorted[0]
    const subject = subjects.find((s) => s.id === block.subjectId)
    return { ...block, subjectName: subject?.name || 'Atividade', subjectColor: subject?.color }
  }, [blocks, subjects])

  // Agrupa reviews por matéria para o painel direito
  const reviewsBySubject = useMemo(() => {
    const map = new Map<string, { name: string; color?: string; count: number }>()
    for (const review of dueReviews) {
      const subjectId = review.topic.subjectId
      const subject = subjects.find((s) => s.id === subjectId)
      const existing = map.get(subjectId)
      if (existing) {
        existing.count++
      } else {
        map.set(subjectId, {
          name: subject?.name || 'Matéria',
          color: subject?.color,
          count: 1,
        })
      }
    }
    return [...map.values()]
  }, [dueReviews, subjects])

  const today = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())

  return (
    <div>
      {/* Top bar */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <div className="font-mono text-[9px] tracking-[0.14em] uppercase text-ink-dim mb-[5px] capitalize">
            {today}
          </div>
          <h1 className="font-serif text-[26px] font-bold tracking-[-0.02em] text-ink leading-none text-balance">
            Bom dia, {firstName}.
          </h1>
        </div>
        {maxStreak > 0 && (
          <div className="flex items-center gap-[7px] bg-ember/10 border border-ember/20 rounded px-3 py-[6px] flex-shrink-0">
            <span className="font-serif text-[20px] font-bold text-ember tracking-[-0.02em] leading-none tabular">
              {maxStreak}
            </span>
            <div className="font-mono text-[8px] tracking-[0.1em] uppercase text-ember/70 leading-[1.3]">
              dias de<br />sequência
            </div>
          </div>
        )}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-[10px] mb-6">
        <MetricCard
          label="Matérias ativas"
          value={subjects.length}
          sub={subjects.length === 1 ? '1 matéria' : `${subjects.length} matérias`}
        />
        <MetricCard
          label="Revisões hoje"
          value={dueReviews.length}
          sub={dueReviews.length > 0 ? `${dueReviews.length} pendentes` : 'tudo em dia'}
          subVariant={dueReviews.length > 0 ? 'warn' : 'up'}
        />
        <MetricCard
          label="Em progresso"
          value={kanbanInProgress}
          sub="tarefas ativas"
        />
        <MetricCard
          label="Próxima sessão"
          value={nextBlock ? nextBlock.startTime : '—'}
          sub={nextBlock ? nextBlock.subjectName : 'cronograma livre'}
          subVariant={nextBlock ? 'warn' : 'default'}
        />
      </div>

      {/* Two-column content */}
      <div className="grid grid-cols-[1fr_300px] gap-5 mb-5">

        {/* Subjects */}
        <div>
          <SectionLabel>Matérias</SectionLabel>
          <div className="flex flex-col gap-2">
            {subjects.length === 0 ? (
              <div className="bg-card border border-edge rounded-[5px] px-4 py-6 text-ink-muted text-[13px] text-center">
                Nenhuma matéria cadastrada.{' '}
                <Link to="/subjects" className="text-forest hover:underline">
                  Adicionar matéria
                </Link>
              </div>
            ) : (
              subjects.map((subject) => {
                const color = subject.color || '#3DAA78'
                const reviewsForSubject = reviewsBySubject.find(
                  (r) => r.name === subject.name,
                )?.count || 0

                return (
                  <Link
                    key={subject.id}
                    to={`/subjects/${subject.id}`}
                    className="bg-card border border-edge rounded-[5px] px-4 py-3 flex items-center gap-3 hover:border-edge-s transition-colors group"
                    style={{ borderLeftWidth: '3px', borderLeftColor: color }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-serif text-[14.5px] font-bold tracking-[-0.01em] text-ink leading-none mb-[5px]">
                        {subject.name}
                      </div>
                      <div className="font-mono text-[9px] text-ink-dim">
                        {reviewsForSubject > 0
                          ? `${reviewsForSubject} revisão${reviewsForSubject > 1 ? 'ões' : ''} pendente${reviewsForSubject > 1 ? 's' : ''}`
                          : 'sem revisões hoje'}
                      </div>
                    </div>
                    <div
                      className="font-mono text-[10px] font-bold group-hover:opacity-100 opacity-0 transition-opacity"
                      style={{ color }}
                    >
                      →
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* Review queue */}
        <div>
          <SectionLabel>Revisões de hoje</SectionLabel>
          <div className="flex flex-col gap-2">
            {dueReviews.length === 0 ? (
              <div className="bg-card border border-edge rounded-[5px] px-4 py-6 text-center">
                <div className="font-serif text-[13px] text-ink mb-1">Tudo revisado.</div>
                <div className="font-mono text-[9px] text-ink-dim">Volte amanhã.</div>
              </div>
            ) : (
              <>
                {dueReviews.slice(0, 6).map((review) => {
                  const subject = subjects.find((s) => s.id === review.topic.subjectId)
                  const color = subject?.color || '#3DAA78'
                  return (
                    <div
                      key={review.id}
                      className="bg-card border border-edge rounded-r-[5px] px-3 py-[10px]"
                      style={{ borderLeftWidth: '3px', borderLeftColor: color }}
                    >
                      <div className="flex items-center justify-between mb-[3px]">
                        <span
                          className="font-mono text-[8px] tracking-[0.1em] uppercase"
                          style={{ color }}
                        >
                          {subject?.name || 'Matéria'}
                        </span>
                        {review.streak > 0 && (
                          <span className="font-mono text-[8px] text-ember">
                            {review.streak} ›
                          </span>
                        )}
                      </div>
                      <div className="font-serif text-[12.5px] font-bold text-ink leading-[1.3] line-clamp-2">
                        {review.topic.name}
                      </div>
                    </div>
                  )
                })}
                {dueReviews.length > 6 && (
                  <Link
                    to="/reviews"
                    className="text-center font-mono text-[9px] text-ink-dim hover:text-forest transition-colors py-2 border-t border-edge mt-1"
                  >
                    + {dueReviews.length - 6} revisões restantes
                  </Link>
                )}
                <Link
                  to="/reviews"
                  className="bg-forest/10 border border-forest/20 rounded-[4px] px-4 py-[10px] text-center font-mono text-[9.5px] tracking-[0.08em] uppercase text-forest hover:bg-forest/15 transition-colors mt-1"
                >
                  Iniciar sessão de revisão
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Kanban snapshot */}
      {kanbanTasks.length > 0 && (
        <div>
          <SectionLabel>Tarefas em aberto</SectionLabel>
          <div className="grid grid-cols-3 gap-2">
            {kanbanTasks
              .filter((t) => t.column !== 'DONE')
              .slice(0, 3)
              .map((task) => {
                const colColor =
                  task.column === 'IN_PROGRESS' ? '#E08A30' : '#344F6A'
                const colLabel =
                  task.column === 'IN_PROGRESS' ? 'Em progresso' : 'A fazer'
                return (
                  <div
                    key={task.id}
                    className="bg-card border border-edge rounded-r-[5px] rounded-b-[5px] px-[13px] py-[11px]"
                    style={{ borderTopWidth: '2.5px', borderTopColor: colColor }}
                  >
                    <div
                      className="font-mono text-[7.5px] tracking-[0.08em] uppercase mb-[5px]"
                      style={{ color: colColor }}
                    >
                      {colLabel}
                    </div>
                    <div className="text-[12.5px] font-semibold text-ink leading-[1.35] line-clamp-2">
                      {task.title}
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
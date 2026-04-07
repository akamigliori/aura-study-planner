import { useEffect, useMemo } from 'react'
import { Calendar, Target, Brain, Flame, ArrowRight } from 'lucide-react'
import { MetricCard } from './MetricCard'
import { DonutChart } from './DonutChart'
import { useSubjectStore } from '../../store/subject.store'
import { useReviewStore } from '../../store/review.store'
import { useScheduleStore } from '../../store/schedule.store'
import { useKanbanStore } from '../../store/kanban.store'

export function DashboardPage() {
  const { subjects, fetchSubjects } = useSubjectStore()
  const { dueReviews, fetchDueReviews } = useReviewStore()
  const { blocks, fetchSchedule } = useScheduleStore()
  const { tasks: kanbanTasks, fetchBoardsAndInitialize } = useKanbanStore()

  useEffect(() => {
    fetchSubjects()
    fetchDueReviews()
    fetchSchedule()
    fetchBoardsAndInitialize()
  }, [fetchSubjects, fetchDueReviews, fetchSchedule, fetchBoardsAndInitialize])

  // Fake "Dias Seguidos" calculation based on user presence or max review streak.
  // In a real scenario, this would come from the auth endpoint's user data.
  const maxStreak = dueReviews.reduce((acc, curr) => Math.max(acc, curr.streak || 0), 2)

  // Kanban Tasks Calculation
  const kanbanTasksTotal = useMemo(() => {
    return kanbanTasks.length
  }, [kanbanTasks])

  const kanbanTodo = useMemo(() => {
    return kanbanTasks.filter(t => t.column === 'TODO').length
  }, [kanbanTasks])

  // Next study activity based on closest ScheduleBlock
  const nextActivity = useMemo(() => {
    if (!blocks || blocks.length === 0) return null
    // Here we just pick the first block for prototype purposes
    const nextBlock = blocks[0]
    const subject = subjects.find(s => s.id === nextBlock.subjectId)
    return {
      name: subject ? subject.name : 'Atividade Padrão',
      time: nextBlock.startTime
    }
  }, [blocks, subjects])

  // Chart Data preparation (Subjects Distribution)
  const chartData = useMemo(() => {
    if (!subjects || subjects.length === 0) {
      return [{ label: 'Nenhuma matéria', value: 1, color: '#e2e8f0' }]
    }
    
    return subjects.map(sub => ({
      label: sub.name,
      value: 1, // Representa a proporção da matéria
      color: sub.color || '#38bdf8'
    }))
  }, [subjects])

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Visão Geral</h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
          Acompanhe seu progresso e planeje seu dia.
        </p>
      </header>

      {/* Bento Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <MetricCard 
          title="Matérias Atívas"
          value={subjects.length}
          subtitle="Currículo atual"
          icon={<Target size={24} />}
          trend={{ value: "+1", isPositive: true }}
        />

        <MetricCard 
          title="Revisões Hoje"
          value={dueReviews.length}
          subtitle="Repetição Espaçada"
          icon={<Brain size={24} />}
          trend={dueReviews.length > 0 ? { value: `${dueReviews.length} urgentes`, isPositive: false } : undefined}
        />

        <MetricCard 
          title="Tarefas Restantes"
          value={kanbanTasksTotal}
          subtitle={`${kanbanTodo} a fazer`}
          icon={<Calendar size={24} />}
        />

        {/* Streak special card */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 border-orange-200/50 dark:border-orange-900/50">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Dias Seguidos</p>
              <h3 className="text-3xl font-bold mt-2 text-orange-700 dark:text-orange-300 tracking-tight">{maxStreak}</h3>
            </div>
            <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-full text-orange-600 dark:text-orange-400">
              <Flame size={24} />
            </div>
          </div>
          <span className="inline-block mt-4 text-xs text-orange-600 dark:text-orange-400 font-medium uppercase tracking-wider">
            Mantenha o foco!
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        
        {/* Next Activity Panel */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-8 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Calendar size={120} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 relative z-10">
            Próxima Atividade
          </h2>
          {nextActivity ? (
            <div className="mt-4 relative z-10">
              <p className="text-3xl font-extrabold text-primary-600 dark:text-primary-400 tracking-tight">
                {nextActivity.name}
              </p>
              <div className="flex items-center gap-2 mt-4 text-gray-600 dark:text-gray-300">
                <span className="font-semibold">{nextActivity.time}</span>
                <ArrowRight size={16} />
                <span className="text-sm">Iniciando em breve</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 mt-4 relative z-10">O cronograma está livre hoje.</p>
          )}
        </div>

        {/* Circular Progress Panel */}
        <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 w-full text-center">
            Suas Matérias
          </h2>
          <DonutChart data={chartData} title="Matérias" size={180} strokeWidth={20} />
        </div>
      </div>

    </div>
  )
}

import 'dotenv/config'
import { PrismaClient } from '../src/generated'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo user
  const user = await prisma.user.upsert({
    where: { email: 'demo@aura.com' },
    update: {},
    create: {
      name: 'Usuário Demo',
      email: 'demo@aura.com',
      password: '$2b$10$dummy.hash.replace.with.real.bcrypt.hash',
    },
  })

  console.log(`✅ User created: ${user.name}`)

  // Create subjects
  const subjects = await Promise.all([
    prisma.subject.upsert({
      where: { id: 'subject-math' },
      update: {},
      create: {
        id: 'subject-math',
        name: 'Matemática',
        color: '#6366f1',
        description: 'Cálculo, Álgebra Linear e Geometria',
        userId: user.id,
      },
    }),
    prisma.subject.upsert({
      where: { id: 'subject-law' },
      update: {},
      create: {
        id: 'subject-law',
        name: 'Direito Constitucional',
        color: '#ef4444',
        description: 'Constituição Federal e legislação complementar',
        userId: user.id,
      },
    }),
    prisma.subject.upsert({
      where: { id: 'subject-programming' },
      update: {},
      create: {
        id: 'subject-programming',
        name: 'Programação',
        color: '#10b981',
        description: 'JavaScript, TypeScript, React e Node.js',
        userId: user.id,
      },
    }),
  ])

  console.log(`✅ ${subjects.length} subjects created`)

  // Create topics for Math
  const topics = await Promise.all([
    prisma.topic.create({
      data: {
        name: 'Limites e Derivadas',
        description: 'Cálculo diferencial',
        subjectId: subjects[0].id,
      },
    }),
    prisma.topic.create({
      data: {
        name: 'Álgebra Linear',
        description: 'Matrizes, vetores e transformações lineares',
        subjectId: subjects[0].id,
      },
    }),
    prisma.topic.create({
      data: {
        name: 'Art. 1º ao 5º - Direitos Fundamentais',
        description: 'Princípios fundamentais da CF',
        subjectId: subjects[1].id,
      },
    }),
    prisma.topic.create({
      data: {
        name: 'React Hooks',
        description: 'useState, useEffect, useContext, useMemo',
        subjectId: subjects[2].id,
      },
    }),
  ])

  console.log(`✅ ${topics.length} topics created`)

  // Create schedule entries
  const schedule = await Promise.all([
    prisma.schedule.create({
      data: {
        dayOfWeek: 1, // Monday
        startTime: '08:00',
        endTime: '10:00',
        subjectId: subjects[0].id,
        userId: user.id,
      },
    }),
    prisma.schedule.create({
      data: {
        dayOfWeek: 2, // Tuesday
        startTime: '14:00',
        endTime: '16:00',
        subjectId: subjects[1].id,
        userId: user.id,
      },
    }),
    prisma.schedule.create({
      data: {
        dayOfWeek: 3, // Wednesday
        startTime: '09:00',
        endTime: '11:00',
        subjectId: subjects[2].id,
        userId: user.id,
      },
    }),
  ])

  console.log(`✅ ${schedule.length} schedule entries created`)

  // Create reviews
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        topicId: topics[0].id,
        userId: user.id,
        interval: 1,
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'DUE',
      },
    }),
    prisma.review.create({
      data: {
        topicId: topics[2].id,
        userId: user.id,
        interval: 3,
        nextReview: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
        status: 'PENDING',
      },
    }),
  ])

  console.log(`✅ ${reviews.length} reviews created`)

  // Create Kanban board
  const board = await prisma.kanbanBoard.create({
    data: {
      name: 'Estudos da Semana',
      description: 'Tarefas de estudo para esta semana',
      userId: user.id,
    },
  })

  // Create Kanban tasks
  const tasks = await Promise.all([
    prisma.kanbanTask.create({
      data: {
        title: 'Resolver exercícios de derivadas',
        description: 'Capítulo 5 do livro de Cálculo',
        column: 'TODO',
        priority: 'HIGH',
        boardId: board.id,
        userId: user.id,
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      },
    }),
    prisma.kanbanTask.create({
      data: {
        title: 'Ler Art. 1º ao 5º da CF',
        description: 'Focar nos direitos fundamentais',
        column: 'IN_PROGRESS',
        priority: 'MEDIUM',
        boardId: board.id,
        userId: user.id,
      },
    }),
    prisma.kanbanTask.create({
      data: {
        title: 'Criar projeto React com hooks',
        description: 'Praticar useState e useEffect',
        column: 'DONE',
        priority: 'LOW',
        boardId: board.id,
        userId: user.id,
      },
    }),
  ])

  console.log(`✅ ${tasks.length} Kanban tasks created`)

  // Create notes
  const notes = await Promise.all([
    prisma.note.create({
      data: {
        title: 'Resumo: Regra da Cadeia',
        content: '# Regra da Cadeia\n\nf(g(x))\' = f\'(g(x)) * g\'(x)\n\nExemplo: d/dx[sin(x²)] = cos(x²) * 2x',
        subjectId: subjects[0].id,
        userId: user.id,
        tags: 'calculo,derivadas,formula',
        isPinned: true,
      },
    }),
    prisma.note.create({
      data: {
        title: 'Princípios Fundamentais da CF',
        content: '# Princípios Fundamentais\n\n- Soberania\n- Cidadania\n- Dignidade da pessoa humana\n- Valores sociais do trabalho\n- Pluralismo político',
        subjectId: subjects[1].id,
        userId: user.id,
        tags: 'direito,constitucional,principios',
        isPinned: false,
      },
    }),
  ])

  console.log(`✅ ${notes.length} notes created`)

  console.log('\n🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

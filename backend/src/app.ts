import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import { PrismaClient } from './generated'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { errorHandler } from './middlewares/error.middleware.js'
import { registerAuthRoutes } from './routes/auth.routes.js'
import { registerSubjectRoutes } from './routes/subject.routes.js'
import { registerTopicRoutes } from './routes/topic.routes.js'
import { registerScheduleRoutes } from './routes/schedule.routes.js'
import { registerReviewRoutes } from './routes/review.routes.js'
import { registerKanbanRoutes } from './routes/kanban.routes.js'
import { registerNoteRoutes } from './routes/note.routes.js'

const adapter = new PrismaBetterSqlite3({ url: 'file:./dev.db' })
const prisma = new PrismaClient({ adapter })

const app = Fastify({
  logger: true,
})

// Register error handler
app.setErrorHandler(errorHandler)

// Register CORS
app.register(cors, {
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
})

// Register JWT plugin
app.register(jwt, {
  secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
  sign: {
    expiresIn: process.env.JWT_EXPIRATION || '15m',
  },
})

// Register all routes
registerAuthRoutes(app, prisma)
registerSubjectRoutes(app, prisma)
registerTopicRoutes(app, prisma)
registerScheduleRoutes(app, prisma)
registerReviewRoutes(app, prisma)
registerKanbanRoutes(app, prisma)
registerNoteRoutes(app, prisma)

// Health check
app.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'connected',
  }
})

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '3000', 10)
    const host = process.env.HOST || '0.0.0.0'

    await app.listen({ port, host })
    console.log(`🚀 Servidor rodando em http://${host}:${port}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()

export { app, prisma }

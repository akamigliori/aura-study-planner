import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './src/mocks/server'

// Estabelecer a interceptação de requisições de teste antes de todos os testes começarem
beforeAll(() => {
  console.log('--- MSW STARTING ---')
  server.listen({ onUnhandledRequest: 'error' })
})

// Limpar os handlers entre testes para não afetarem os próximos
afterEach(() => server.resetHandlers())

// Limpar ao final geral
afterAll(() => server.close())

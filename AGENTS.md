# Aura Study Planner

## Stack
- **Frontend:** React 18+, TypeScript, Vite, Tailwind, Zustand, React Hook Form + Zod
- **Backend:** Fastify, Prisma, SQLite (dev) / PostgreSQL (prod), JWT auth

## Estrutura
```
aura-study-planner/
├── frontend/          # React app
├── backend/           # Fastify API
├── shared/            # Código compartilhado
└── docs/              # Documentação
```

## Prioridades
1. Kanban Board com drag-and-drop (Fase 6)
2. Repetição Espaçada / Flashcards (Fase 7)
3. Theme Switcher

## Regras
- TypeScript estrito com tipagem completa
- TDD: testes com Vitest + React Testing Library
- Sempre criar `.md` explicativo junto de cada novo arquivo
- Validar input com Zod, hash de senha com bcrypt
- Branches: `feature/nome`, `fix/nome` | Commits: `feat:`, `fix:`, `docs:`

## Comandos
```bash
# Frontend
cd aura-study-planner/frontend && npm run dev

# Backend
cd aura-study-planner/backend && npm run dev

# Testes
cd aura-study-planner && npm run test
```

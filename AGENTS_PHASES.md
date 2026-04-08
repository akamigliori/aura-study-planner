# Fases do Projeto — Aura Study Planner

## Status Geral

| Fase | Status | Descrição |
|------|--------|-----------|
| 1-2 | ✅ | Backend completo + Frontend base |
| 3-5 | ✅ | UI, Auth, Dashboard, CRUD, Topics, Schedule |
| 6 | ⏳ | Kanban Board com drag-and-drop |
| 7 | ⏳ | Repetição Espaçada / Flashcards + Theme Switcher |

---

## ✅ Backend — COMPLETO

### Fundação
- Prisma schema com 8 modelos: User, Subject, Topic, Schedule, Review, KanbanBoard, KanbanTask, Note
- Migração SQLite executada + seed com dados demo
- Utils: `errors.ts`, `password.ts`, `jwt.ts`
- Middlewares: auth, validate, error

### Módulos CRUD
| Módulo | Repository | Service | Controller | Routes | Schemas | Testes |
|--------|:----------:|:-------:|:----------:|:------:|:-------:|:------:|
| Auth | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 14 |
| Subjects | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 15 |
| Topics | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 13 |
| Schedule | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 13 |
| Reviews | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 13 |
| Kanban | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 11 |
| Notes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 13 |

**Total: 99 testes unitários passando**

### Algoritmo SM-2 (Repetição Espaçada)
- Implementado em `review.service.ts`
- Intervals: [1, 3, 7, 14, 30, 60, 90] dias
- Ease Factor ajustável (mínimo 1.3)
- Endpoint `/reviews/due` para revisões pendentes

---

## ✅ Frontend — COMPLETO

### Fase 2: Base + UI + Auth
- Vite + React 19 + TypeScript + Tailwind CSS v4
- Componentes UI: Button, Input, Card, Modal, Badge, Avatar, Toast
- Layout: Header, Sidebar, MainLayout
- Auth: Login, Register, ProtectedRoute

### Fase 3-4: Dashboard + Funcionalidades
- Dashboard Principal com Bento Box + DonutChart SVG
- CRUD de Matérias (Subjects) completo
- Stores Zustand para kanban, schedule, reviews

### Fase 5: Tópicos + Cronograma
- CRUD de Tópicos vinculado a Subjects
- Weekly Schedule com colunas iterativas 0-6
- Componente ConfirmDialog para deleções

---

## ⏳ Pendente

### Fase 6: Kanban Board
- Interface drag-and-drop
- Integração com stores Zustand

### Fase 7: Repetição Espaçada + Theme
- Flashcards consumindo lógica SM-2 do backend
- Theme Switcher baseado em CSS variables
- Testes E2E finais

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Fastify-5-000000?logo=fastify&logoColor=white" alt="Fastify 5" />
  <img src="https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma&logoColor=white" alt="Prisma 7" />
  <img src="https://img.shields.io/badge/Vitest-2-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
</p>

# Aura Study Planner

> Aplicativo fullstack de planejamento de estudos com repetição espaçada (SM-2), Kanban interativo, cronograma semanal, anotações e analytics — construído como projeto de aprendizado.

---

## Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Setup](#instalação-e-setup)
- [Execução](#execução)
- [Testes](#testes)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [API Reference](#api-reference)
- [Roadmap](#roadmap)

---

## Visão Geral

O **Aura Study Planner** é um sistema fullstack projetado para ajudar estudantes a organizar suas matérias, agendar sessões de estudo semanais, gerenciar tarefas com Kanban visual (drag-and-drop), revisar conteúdo com o algoritmo SM-2 de repetição espaçada e manter anotações organizadas por matéria.

O projeto também serve como veículo de aprendizado prático em React, TypeScript, arquitetura de software, TDD e segurança.

---

## Funcionalidades

| Módulo | Descrição | Status |
|--------|-----------|--------|
| **Autenticação** | Login/Register com JWT (access + refresh tokens) | ✅ |
| **Matérias (Subjects)** | CRUD completo com cores personalizadas | ✅ |
| **Tópicos (Topics)** | CRUD vinculado a cada matéria | ✅ |
| **Cronograma Semanal** | Grade visual de Segunda a Domingo com blocos de estudo | ✅ |
| **Dashboard** | Painel com métricas, gráfico Donut interativo e próxima atividade | ✅ |
| **Kanban Board** | Quadro de tarefas com Drag-and-Drop (`@dnd-kit`) e UI otimista | ✅ |
| **Repetição Espaçada** | Sessão de revisão SM-2 com qualidade 0–5, barra de progresso e tela de conclusão | ✅ |
| **Anotações** | CRUD de notas por matéria com busca, filtros e pin | ⏳ |
| **Tema Personalizado** | Theme Switcher com paletas customizáveis (dark/light + cores de acento) | ⏳ |

---

## Tecnologias

### Frontend
| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| React | 19 | Biblioteca de UI |
| TypeScript | 5+ | Tipagem estática |
| Vite | 5+ | Bundler e dev server |
| Tailwind CSS | 4 | Classes utilitárias |
| React Router | 7 | Roteamento SPA |
| Zustand | 4+ | Gerenciamento de estado |
| React Hook Form | 7+ | Formulários tipados |
| Zod | 3+ | Validação de schemas |
| @dnd-kit | 6+ | Drag-and-Drop |
| Lucide React | — | Ícones SVG |

### Backend
| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| Fastify | 5 | Servidor HTTP |
| Prisma | 7 | ORM type-safe |
| SQLite | — | Banco de dados (dev) |
| bcrypt | — | Hash de senhas |
| JWT | — | Autenticação stateless |
| Zod | 3+ | Validação de entrada |

### Testes
| Tecnologia | Propósito |
|-----------|-----------|
| Vitest | Test runner (frontend + backend) |
| React Testing Library | Testes de componentes |
| MSW 2 | Mock Service Worker para testes de integração |

---

## Arquitetura

```
┌─────────────────────┐     HTTP/JSON       ┌──────────────────────┐
│                     │ ◄─────────────────► │                      │
│   FRONTEND (SPA)    │                      │   BACKEND (API)      │
│   React + Vite      │                      │   Fastify + Prisma   │
│   Port: 5173        │                      │   Port: 3000         │
│                     │                      │                      │
│  ┌───────────────┐  │                      │  ┌────────────────┐  │
│  │ Zustand Store │  │                      │  │ Routes         │  │
│  │ (State Mgmt)  │──┼──── fetch() ────────►│  │ Controllers    │  │
│  └───────────────┘  │                      │  │ Services       │  │
│  ┌───────────────┐  │                      │  │ Repositories   │  │
│  │ React Router  │  │                      │  └───────┬────────┘  │
│  │ (Navigation)  │  │                      │          │           │
│  └───────────────┘  │                      │  ┌───────▼────────┐  │
│                     │                      │  │  Prisma ORM    │  │
└─────────────────────┘                      │  │  SQLite (dev)  │  │
                                             │  └────────────────┘  │
                                             └──────────────────────┘
```

O backend segue o padrão **Repository → Service → Controller → Route**, mantendo separação de responsabilidades e facilitando testes unitários.

---

## Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Git**

---

## Instalação e Setup

```bash
# 1. Clone o repositório
git clone https://github.com/akamigliori/aura-study-planner.git
cd aura-study-planner

# 2. Instale as dependências do backend
cd backend
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com seu JWT_SECRET e DATABASE_URL

# 4. Gere o cliente Prisma e sincronize o banco
npx prisma generate
npx prisma db push

# 5. Instale as dependências do frontend
cd ../frontend
npm install
```

### Variáveis de Ambiente (Backend)

Crie um arquivo `.env` na pasta `backend/`:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="sua-chave-secreta-aqui"
JWT_REFRESH_SECRET="sua-chave-refresh-aqui"
PORT=3000
```

> **Importante**: O Prisma 7 gera o cliente em `src/generated/client.ts`. Nunca commite arquivos `.env`.

---

## Execução

```bash
# Terminal 1 — Backend
cd backend
npm run dev
# → Servidor em http://localhost:3000

# Terminal 2 — Frontend
cd frontend
npm run dev
# → App em http://localhost:5173
```

---

## Testes

```bash
# Rodar todos os testes do backend
cd backend
npm run test

# Rodar todos os testes do frontend
cd frontend
npm run test

# Rodar com coverage
npx vitest run --coverage
```

### Cobertura Atual

| Suite | Testes | Status |
|---|---|---|
| Backend (13 suítes) | 99 | ✅ Passando |
| Frontend store — review | 12 | ✅ Passando |
| Frontend integração — ReviewPage | 5 | ✅ Passando |
| Frontend demais stores e componentes | ~20 | ✅ Passando |

---

## Estrutura do Projeto

```
aura-study-planner/
├── frontend/                  # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Button, Input, Card, Modal, Badge, etc.
│   │   │   └── layout/        # Header, Sidebar, MainLayout
│   │   ├── features/
│   │   │   ├── auth/          # Login, Register
│   │   │   ├── dashboard/     # Dashboard, MetricCard, DonutChart
│   │   │   ├── subjects/      # CRUD de Matérias
│   │   │   ├── topics/        # CRUD de Tópicos
│   │   │   ├── schedule/      # Cronograma Semanal
│   │   │   ├── kanban/        # Kanban Board (Drag-and-Drop)
│   │   │   ├── review/        # Sessão de Revisão SM-2
│   │   │   └── notes/         # Anotações (Fase 8)
│   │   ├── store/             # Zustand stores por domínio
│   │   ├── types/             # TypeScript types por domínio
│   │   ├── lib/               # API client (com refresh automático)
│   │   ├── mocks/             # MSW handlers para testes
│   │   └── routes/            # AppRoutes.tsx + ProtectedRoute.tsx
│   └── tests/
│       ├── store/             # Testes unitários dos stores
│       └── features/          # Testes de integração com MSW
│
├── backend/                   # Fastify + Prisma
│   ├── prisma/
│   │   ├── schema.prisma      # 8 modelos de dados
│   │   └── seed.ts            # Dados iniciais
│   ├── src/
│   │   ├── routes/            # Endpoints da API
│   │   ├── controllers/       # Handlers HTTP
│   │   ├── services/          # Lógica de negócio
│   │   ├── repositories/      # Acesso ao banco
│   │   ├── middlewares/       # Auth, Validation, Error
│   │   ├── schemas/           # Zod validation schemas
│   │   └── utils/             # JWT, Password, Errors
│   └── tests/
│
└── shared/                    # Código compartilhado (futuro)
```

---

## API Reference

Todos os endpoints (exceto `/auth/*`) requerem header `Authorization: Bearer <token>`.

| Recurso | Método | Rota | Descrição |
|---------|--------|------|-----------|
| **Auth** | POST | `/auth/register` | Criar conta |
| | POST | `/auth/login` | Login |
| | POST | `/auth/refresh` | Renovar token |
| **Subjects** | GET/POST | `/subjects` | Listar / Criar matéria |
| | GET/PUT/DELETE | `/subjects/:id` | Obter / Atualizar / Excluir |
| **Topics** | GET/POST | `/subjects/:subjectId/topics` | Listar / Criar tópico |
| | PUT/DELETE | `/topics/:id` | Atualizar / Excluir tópico |
| **Schedule** | GET/POST | `/schedule` | Listar / Criar bloco |
| | PUT/DELETE | `/schedule/:id` | Atualizar / Excluir bloco |
| **Reviews** | GET | `/reviews/due` | Revisões pendentes (SM-2) |
| | POST | `/reviews/:id/complete` | Concluir revisão com qualidade 0–5 |
| **Kanban** | GET/POST | `/kanban/boards` | Listar / Criar quadros |
| | GET/POST | `/kanban/boards/:boardId/tasks` | Listar / Criar tarefas |
| | PUT | `/kanban/tasks/:id/move` | Mover tarefa entre colunas |
| **Notes** | GET/POST | `/notes` | Listar / Criar anotação |
| | DELETE | `/notes/:id` | Excluir anotação |

---

## Roadmap

- [x] **Fase 1–2**: Backend completo + Fundação do Frontend
- [x] **Fase 3–4**: Dashboard, UI Components, Autenticação, CRUD de Matérias
- [x] **Fase 5**: Tópicos e Cronograma Semanal
- [x] **Fase 6**: Kanban Board com Drag-and-Drop
- [x] **Fase 7**: Interface de Repetição Espaçada (SM-2)
- [ ] **Fase 8**: UI de Anotações (Notes) com busca e filtro por matéria
- [ ] **Fase 9**: Theme Switcher com paletas customizáveis
- [ ] **Fase 10**: Testes E2E (Playwright) e deploy (Railway + Vercel)

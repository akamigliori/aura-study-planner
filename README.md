<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Fastify-4-000000?logo=fastify&logoColor=white" alt="Fastify" />
  <img src="https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Vitest-1-6E9F18?logo=vitest&logoColor=white" alt="Vitest" />
</p>

# 🌟 Aura Study Planner

> Aplicativo completo de planejamento de estudos com repetição espaçada (SM-2), Kanban interativo, cronograma semanal e analytics — construído como projeto de aprendizado fullstack.

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Arquitetura](#-arquitetura)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Setup](#-instalação-e-setup)
- [Execução](#-execução)
- [Testes](#-testes)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API Reference](#-api-reference)
- [Roadmap](#-roadmap)
- [Contribuindo](#-contribuindo)
- [Licença](#-licença)

---

## 🔭 Visão Geral

O **Aura Study Planner** é um sistema fullstack projetado para ajudar estudantes a organizar suas matérias, agendar sessões de estudo semanais, gerenciar tarefas com Kanban visual (drag-and-drop), e revisar conteúdo com o algoritmo SM-2 de repetição espaçada.

O projeto também serve como veículo de aprendizado prático em React, TypeScript, arquitetura de software, TDD e segurança.

---

## ✨ Funcionalidades

| Módulo | Descrição | Status |
|--------|-----------|--------|
| **Autenticação** | Login/Register com JWT (access + refresh tokens) | ✅ |
| **Matérias (Subjects)** | CRUD completo com cores personalizadas | ✅ |
| **Tópicos (Topics)** | CRUD vinculado a cada matéria | ✅ |
| **Cronograma Semanal** | Grade visual de Segunda a Domingo com blocos de estudo | ✅ |
| **Dashboard** | Painel com métricas, gráfico Donut interativo e próxima atividade | ✅ |
| **Kanban Board** | Quadro de tarefas com Drag-and-Drop (`@dnd-kit`) e UI otimista | ✅ |
| **Repetição Espaçada** | Algoritmo SM-2 no backend (UI em desenvolvimento) | ⏳ |
| **Anotações** | CRUD completo no backend (UI em desenvolvimento) | ⏳ |
| **Tema Personalizado** | Theme Switcher com paletas customizáveis | ⏳ |

---

## 🛠 Tecnologias

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
| Lucide React | 0.300+ | Ícones SVG |

### Backend
| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| Fastify | 4+ | Servidor HTTP |
| Prisma | 5+ | ORM type-safe |
| SQLite | — | Banco de dados (dev) |
| bcrypt | — | Hash de senhas |
| JWT | — | Autenticação stateless |
| Zod | 3+ | Validação de entrada |

### Testes
| Tecnologia | Propósito |
|-----------|-----------|
| Vitest | Test runner (frontend + backend) |
| React Testing Library | Testes de componentes |

---

## 🏗 Arquitetura

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

## 📦 Pré-requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Git**

---

## 🚀 Instalação e Setup

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

# 4. Execute as migrações do banco de dados
npx prisma migrate dev
npx prisma generate

# 5. (Opcional) Popule o banco com dados iniciais
npx prisma db seed

# 6. Instale as dependências do frontend
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

> ⚠️ **Importante**: Nunca commite arquivos `.env` no repositório.

---

## ▶️ Execução

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

## 🧪 Testes

```bash
# Rodar todos os testes do backend
cd backend
npm run test

# Rodar todos os testes do frontend
cd frontend
npm run test

# Rodar testes com coverage
npx vitest run --coverage
```

### Cobertura Atual

- **Backend**: 99 testes unitários passando (13 suítes)
- **Frontend**: Testes para stores (Subjects, Topics, Schedule, Kanban), componentes UI e dialogs

---

## 📁 Estrutura do Projeto

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
│   │   │   └── kanban/        # Kanban Board (Drag-and-Drop)
│   │   ├── store/             # Zustand stores
│   │   ├── types/             # TypeScript types
│   │   ├── lib/               # API client, helpers
│   │   └── routes/            # React Router config
│   └── tests/
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

## 📡 API Reference

O backend expõe os seguintes grupos de endpoints (todos sob autenticação JWT):

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
| **Reviews** | GET | `/reviews/due` | Revisões pendentes |
| | POST | `/reviews/:id/complete` | Concluir revisão |
| **Kanban** | GET/POST | `/kanban/boards` | Listar / Criar quadros |
| | GET/POST | `/kanban/boards/:boardId/tasks` | Listar / Criar tarefas |
| | PUT | `/kanban/tasks/:id/move` | Mover tarefa entre colunas |
| **Notes** | GET/POST | `/notes` | Listar / Criar anotações |

---

## 🗺 Roadmap

- [x] **Fase 1-2**: Backend completo + Fundação do Frontend
- [x] **Fase 3-4**: Dashboard, UI Components, Autenticação, CRUD de Matérias
- [x] **Fase 5**: Tópicos e Cronograma Semanal
- [x] **Fase 6**: Kanban Board com Drag-and-Drop
- [ ] **Fase 7**: Interface de Repetição Espaçada (SM-2)
- [ ] **Fase 8**: Theme Switcher com paletas customizáveis
- [ ] **Fase 9**: Testes E2E e deploy em produção

---

## 🤝 Contribuindo

1. Crie sua branch a partir de `develop`: `git checkout -b feature/minha-feature develop`
2. Faça seus commits: `git commit -m "feat: descrição da feature"`
3. Envie para a branch: `git push origin feature/minha-feature`
4. Abra um Pull Request para `develop`

### Convenções de Commit

```
feat: nova funcionalidade
fix: correção de bug
docs: alteração na documentação
style: formatação, sem alteração de lógica
refactor: refatoração de código
test: adição ou correção de testes
chore: tarefas de manutenção
```

---

## 📄 Licença

Este projeto é de uso pessoal e educacional. Feito com ☕ e 🎧.

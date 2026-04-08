# Aura Study Planner — Guia para Agentes de IA

## Visão Geral

O **Aura Study Planner** é um aplicativo de planejamento de estudos inspirado no [Mentoris](https://mentorisapp.com.br). O projeto é um veículo de aprendizado para um desenvolvedor estagiário que quer aprofundar conhecimentos em React, TypeScript, Tailwind, arquitetura, TDD, segurança e DevOps.

## Objetivos do Projeto

1. **Funcionalidade:** Sistema completo de planejamento de estudos com repetição espaçada, Kanban, cronograma semanal e analytics
2. **Aprendizado:** Cada arquivo criado DEVE ter um `.md` explicativo correspondente
3. **Qualidade:** Testes desde o início (TDD), TypeScript estrito, boas práticas de segurança
4. **Arquitetura:** Frontend e Backend separados, mas claramente distintos

## Tecnologias

| Camada | Tecnologia | Versão | Notas |
|--------|-----------|--------|-------|
| Frontend | React | 18+ | Biblioteca principal |
| Linguagem | TypeScript | 5+ | Tipagem estática |
| Bundler | Vite | 5+ | Rápido e moderno |
| Estilo | Tailwind CSS | 4+ | Classes utilitárias |
| Rota | React Router | 6+ | SPA navigation |
| Estado | Zustand | 4+ | Gerenciamento de estado |
| Formulários | React Hook Form | 7+ | Formulários tipados |
| Validação | Zod | 3+ | Schemas de validação |
| Ícones | Lucide React | 0.300+ | Ícones SVG |
| Backend | Fastify | 4+ | Servidor HTTP |
| ORM | Prisma | 5+ | Type-safe database |
| Banco | SQLite (dev) | - | Desenvolvimento |
| Banco | PostgreSQL (prod) | 15+ | Produção |
| Auth | JWT | - | Access + Refresh tokens |
| Testes | Vitest | 1+ | Test runner |
| Testes UI | React Testing Library | 14+ | Testes de componente |

## Estrutura do Projeto

```
aura-study-planner/
├── frontend/                          # React + Vite + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                    # Button, Input, Card, Modal, Badge, Avatar, Toast
│   │   │   └── layout/                # Header, Sidebar, Footer, MainLayout
│   │   ├── features/
│   │   │   ├── auth/                  # Login, Register, Profile, Forgot Password
│   │   │   ├── subjects/              # CRUD de Matérias
│   │   │   ├── topics/                # CRUD de Tópicos
│   │   │   ├── schedule/              # Cronograma Semanal
│   │   │   ├── reviews/               # Repetição Espaçada
│   │   │   ├── kanban/                # Board de Tarefas
│   │   │   ├── notes/                 # Anotações
│   │   │   └── dashboard/             # Página principal com estatísticas
│   │   ├── hooks/                     # Custom hooks
│   │   ├── lib/
│   │   │   ├── api.ts                 # Cliente HTTP
│   │   │   ├── storage.ts             # LocalStorage helpers
│   │   │   └── constants.ts           # Constantes
│   │   ├── store/                     # Zustand stores
│   │   ├── types/                     # TypeScript types
│   │   └── routes/
│   │       ├── AppRoutes.tsx
│   │       └── ProtectedRoute.tsx
│   ├── tests/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── pages/
│   └── package.json
│
├── backend/                           # Fastify + Prisma
│   ├── prisma/
│   │   ├── schema.prisma              # Schema do banco
│   │   └── seed.ts                    # Dados iniciais
│   ├── src/
│   │   ├── routes/                    # Rotas da API
│   │   ├── controllers/               # Handlers
│   │   ├── services/                  # Lógica de negócio
│   │   ├── repositories/              # Acesso ao banco
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── validate.middleware.ts
│   │   │   └── error.middleware.ts
│   │   ├── schemas/                   # Validação Zod
│   │   ├── utils/
│   │   │   ├── jwt.ts
│   │   │   ├── password.ts
│   │   │   └── errors.ts
│   │   └── app.ts
│   ├── tests/
│   │   ├── integration/
│   │   └── unit/
│   └── package.json
│
├── shared/                            # Código compartilhado
│   ├── types/
│   └── utils/
│
└── docs/                              # Documentação .md
```

## Módulos de CRUD

| Módulo | Operações | Rota API |
|--------|-----------|----------|
| Usuários | Criar, Login, Perfil, Alterar senha | `/api/auth/*` |
| Matérias | CRUD completo | `/api/subjects/*` |
| Tópicos | CRUD completo | `/api/topics/*` |
| Cronograma | CRUD completo | `/api/schedule/*` |
| Revisões | CRUD + algoritmo de repetição espaçada | `/api/reviews/*` |
| Kanban | CRUD + mover entre colunas | `/api/kanban/*` |
| Notas | CRUD completo | `/api/notes/*` |

## Sistema de Autenticação (JWT)

- **Access Token:** 15 minutos de duração
- **Refresh Token:** 7 dias de duração
- **Hash de senha:** bcrypt com 10 rounds
- **Rotas protegidas:** Middleware verifica JWT no header `Authorization: Bearer <token>`

## Regras para Agentes de IA

### 1. Criação de Arquivos

- **TODO** arquivo `.tsx`, `.ts`, `.js` DEVE ter um `.md` explicativo correspondente
- Exemplo: `Button.tsx` → `Button.tsx.md`
- O `.md` deve explicar: o que o arquivo faz, por que foi criado, como funciona, exemplos de uso

### 2. Padronização de Código

- **TypeScript estrito:** Sempre tipar props, retornos e parâmetros
- **ESLint:** Seguir as regras configuradas
- **Prettier:** Formatação automática
- **Nomes descritivos:** `useAuth.ts`, `auth.routes.ts`, `subject.types.ts`

### 3. Testes (TDD)

- **Testes primeiro:** Escrever teste antes do código quando possível
- **Vitest:** Frontend e backend usam Vitest
- **React Testing Library:** Para componentes React
- **Cobertura:** Testar paths feliz e erro

### 4. Segurança

- **Nunca** commitar `.env` ou secrets
- **Sempre** validar entrada com Zod
- **Sempre** hash de senha com bcrypt
- **Sempre** verificar JWT em rotas protegidas

### 5. Git Conventions

- **Branches:** `feature/nome-da-feature`, `fix/nome-do-bug`
- **Commits:** `feat: descrição`, `fix: descrição`, `docs: descrição`
- **Pull Requests:** Descrever mudanças e testes realizados

## Comandos Úteis

```bash
# Frontend
cd aura-study-planner/frontend
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build para produção
npm run test         # Executar testes
npm run lint         # Verificar código com ESLint

# Backend
cd aura-study-planner/backend
npm run dev          # Iniciar servidor Fastify
npm run test         # Executar testes
npx prisma migrate   # Executar migração do banco
npx prisma seed      # Popular banco com dados iniciais

# Ambos (da raiz do projeto)
npm run dev          # Iniciar frontend + backend
npm run test         # Executar todos os testes
npm run build        # Build de tudo
```

## Estado Atual do Projeto

### ✅ Backend — COMPLETO (Todas as Fases)

#### Fundação
- ✅ Prisma schema com 8 modelos: User, Subject, Topic, Schedule, Review, KanbanBoard, KanbanTask, Note
- ✅ Migração SQLite executada + seed com dados demo
- ✅ Utils: `errors.ts`, `password.ts`, `jwt.ts`
- ✅ Middlewares: `auth.middleware.ts`, `validate.middleware.ts`, `error.middleware.ts`
- ✅ Bug fix: `refreshToken` catch genérico corrigido para re-lançar AppError
- ✅ Bug fix: Resolução de falha na validação Zod (ajuste em schemas e middleware para compatibilidade do payload da requisição)

#### Módulos CRUD Completos
| Módulo | Repository | Service | Controller | Routes | Schemas | Testes |
|--------|-----------|---------|-----------|--------|---------|--------|
| Auth | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 14 testes |
| Subjects | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 15 testes |
| Topics | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 13 testes |
| Schedule | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 13 testes |
| Reviews | ✅ | ✅ (SM-2) | ✅ | ✅ | ✅ | ✅ 13 testes |
| Kanban | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 11 testes |
| Notes | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ 13 testes |

#### Testes
- ✅ **99 testes unitários passando** (13 arquivos de teste)
- ✅ Cobertura: repositories, services, utils, errors

#### Algoritmo SM-2 (Repetição Espaçada)
- ✅ Implementado em `review.service.ts`
- ✅ Intervals: [1, 3, 7, 14, 30, 60, 90] dias
- ✅ Ease Factor ajustável (mínimo 1.3)
- ✅ Streak tracking
- ✅ Endpoint `/reviews/due` para revisões pendentes

### ✅ Frontend — Base Configurada
- ✅ Vite + React 19 + TypeScript + Tailwind CSS v4
- ✅ React Router v7 com placeholder pages
- ✅ Dependências: zustand, react-hook-form, zod, lucide-react

### ✅ Frontend — UI, Layout e Autenticação
- ✅ Frontend: componentes UI (Button, Input, Card, Modal, Badge, Avatar, Toast) configurados e testados
- ✅ Frontend: layout principal (Header, Sidebar, MainLayout) instanciado com TDD
- ✅ Frontend: ProtectedRoute e features de autenticação (Login, Register) com rotas ativas
- ✅ Frontend: integração segura com API backend configurada via `lib/api.ts` (Native Fetch API sem Axios)
- ✅ Documentação rigorosa em Markdown (`.md`) para todo o núcleo vital do Backend e Frontend (Fase 2 completa)
- ✅ Bug fix: Correção de mapeamento de dados (Zustand) evitando crash na renderização da aba Matérias

### ✅ Frontend — Funcionalidades e Dashboard (Fases 3 e 4)
- ✅ Frontend: CRUD de Matérias (Subjects) completo com state Zustand, API e testes TDD (`SubjectPage`, `SubjectForm`).
- ✅ Frontend: Dashboard Principal completo com Bento Box layout, *Liquid Glass* (`MetricCard`), Gráfico modular em SVG nativo interativo (`DonutChart`).
- ✅ Frontend: Stores client-side agregando resumos de `kanban`, `schedule` e `reviews`.
- ✅ Configuração: Documentação padronizada `.md` rigorosa espelhada para cada novo componente e service construído.

### ✅ Frontend — Tópicos e Cronograma (Fase 5)
- ✅ Frontend: CRUD completo de Tópicos vinculado a cada Subject (`SubjectDetailsPage`, `TopicForm`).
- ✅ Frontend: Componente reutilizável `ConfirmDialog` para proteger deleções e ações críticas (UI Glassmorphism).
- ✅ Frontend: Implementação completa do "Weekly Schedule" (`SchedulePage`), mapeamento de blocos de estudo em colunas iterativas de 0 a 6.
- ✅ Frontend: Expansão atômica de stores Zustand (`topic.store.ts` e `schedule.store.ts`) para abarcar comunicação 1:1 total do respectivo Fastify Controller.

### ⏳ Pendente
- ⏳ Frontend: Desenvolvimento e interação na interface do **Kanban Board** de tarefas (Fase 6).
- ⏳ Frontend: Módulo de Repetição Espaçada / Flashcards consumindo lógica SM-2 já construída no Backend.
- ⏳ Configuração: Tema Personalizado incorporando o `Theme Switcher` baseado nas variáveis nativas do CSS.
- ⏳ Testes abrangentes de integração E2E finais.

## Próximos Passos

1. Iniciar **Fase 6**: Desenvolvimento e interação na interface do **Kanban Board** de tarefas (Drag-and-Drop).
2. Iniciar **Fase 7**: Desenvolvimento do sistema de Sessão de Revisão Espaçada (SM-2 na Interface UI)
3. Tema Personalizado: Incorporar o `Theme Switcher` baseado nas variáveis nativas do CSS já consolidadas na Fase 3.

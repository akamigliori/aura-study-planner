# Aura Study Planner — Estado do Projeto

> Gerado em 2026-06-24. Use este arquivo para contextualizar a próxima conversa.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS 4, Zustand, React Hook Form, @dnd-kit |
| Backend | Fastify 5, Prisma 7, SQLite (better-sqlite3), JWT, Zod |
| Testes | Vitest, React Testing Library, MSW 2 |

**Portas:** backend `:3000`, frontend `:5173`

---

## Como rodar

```bash
# Terminal 1 — Backend
cd backend
npm install
npx prisma generate   # gera src/generated/client.ts
npx prisma db push    # sincroniza schema com dev.db
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

**Atenção:** O Prisma 7 gera o cliente em `src/generated/client.ts`. Todos os imports já foram corrigidos de `from './generated'` para `from './generated/client'`.

---

## O que foi feito

### Fase 1–6 (pré-existente, 100% completo)

- Backend completo: Auth (JWT access + refresh), Subjects, Topics, Schedule, Reviews (SM-2), Kanban, Notes — 99 testes passando
- Frontend: Login/Register, Dashboard (métricas + donut chart), Subjects CRUD, Topics CRUD, Schedule semanal, Kanban com drag-and-drop (@dnd-kit)

### Fix crítico — Prisma 7

- O Prisma 7 mudou o ponto de entrada do cliente gerado de `index.js` para `client.ts`
- Corrigidos 29 arquivos em `backend/src/`: todos os imports `from './generated'` → `from './generated/client'`

### Fase 7 — UI de Revisão Espaçada SM-2 (completo)

**Arquivos criados:**
```
frontend/src/types/review.types.ts
frontend/src/store/review.store.ts
frontend/src/features/review/ReviewPage.tsx
frontend/src/features/review/ReviewCard.tsx
frontend/src/features/review/ReviewProgress.tsx
frontend/src/features/review/ReviewEmptyState.tsx
frontend/src/features/review/ReviewSessionComplete.tsx
frontend/tests/store/review.store.test.ts    — 12 testes
frontend/tests/features/review/ReviewPage.test.tsx — 5 testes
```

**Arquivos modificados:**
```
frontend/src/routes/AppRoutes.tsx   — rota /reviews
frontend/src/mocks/handlers.ts      — handlers MSW para /reviews
```

**Comportamento implementado:**
- Busca revisões pendentes (`GET /reviews/due`)
- Exibe uma por vez: nome do tópico, tempo desde última revisão, streak
- 4 botões SM-2: De Novo (0) / Difícil (2) / Bom (4) / Fácil (5)
- "Pular" move o card para o fim da fila
- Barra de progresso `X / Y`
- Borda lateral com cor da matéria
- Tela de conclusão com contadores

### Fase 8 — UI de Anotações (completo)

**Arquivos criados:**
```
frontend/src/types/note.types.ts             — Note, CreateNoteData
frontend/src/store/note.store.ts             — fetchNotes, createNote, deleteNote, togglePin
frontend/src/features/notes/NotesPage.tsx    — listagem com busca e filtro
frontend/src/features/notes/NoteCard.tsx     — card com pin, delete, badge de matéria
frontend/src/features/notes/NoteForm.tsx     — modal de criação (RHF + Zod)
frontend/src/features/notes/NotesEmptyState.tsx
frontend/tests/store/note.store.test.ts      — 12 testes unitários (TDD)
frontend/tests/features/notes/NotesPage.test.tsx — 5 testes de integração
```

**Arquivos modificados:**
```
frontend/src/routes/AppRoutes.tsx   — rota /notes conectada à NotesPage
frontend/src/mocks/handlers.ts      — handlers GET/POST/DELETE /notes
```

**Comportamento implementado:**
- Busca client-side por título ou conteúdo
- Filtro por matéria via `<select>`
- Notas fixadas (isPinned) aparecem em seção separada acima das demais
- Toggle de pin é local (sem PATCH no backend — endpoint não existe)
- Delete com rollback otimista + ConfirmDialog antes de confirmar
- Borda lateral com cor da matéria (mesmo padrão do ReviewCard)
- Estado vazio distingue "sem notas" de "filtro sem resultado"
- `NotesPage` não usa `MainLayout` internamente — o `AppRoutes` envolve com `<MainLayout>` (mesmo padrão do ReviewPage)

---

## O que falta

### Fase 9 — Theme Switcher (próxima)

Implementar paletas customizáveis com suporte a dark/light e cores de acento.

**O que construir:**
- `store/theme.store.ts` — estado do tema ativo (modo + cor de acento), persistência via `localStorage`
- `features/settings/ThemePage.tsx` (ou painel lateral) — seletor de modo e paleta de cores
- Integração com Tailwind: usar variáveis CSS ou classes dinâmicas para trocar cores de acento
- Toggle dark/light no Header (já existe estrutura com `dark:` classes no Tailwind)
- Persistência: salvar preferência no `localStorage` e reaplicar ao iniciar

**Padrão a seguir:** mesmo TDD das fases anteriores — tipos → testes do store → store → componentes → testes de integração.

### Fase 10 — Testes E2E e Deploy (pendente)

- [ ] **Testes E2E** — Playwright cobrindo fluxos principais (login → criar matéria → revisar → anotar)
- [ ] **Deploy**
  - Backend: Railway (trocar SQLite por PostgreSQL em produção, configurar variáveis de ambiente)
  - Frontend: Vercel (configurar `VITE_API_URL` apontando para o Railway)

---

## Convenções do projeto

**Commits:**
```
feat: nova funcionalidade
fix: correção de bug
test: adição ou correção de testes
refactor: refatoração sem mudança de comportamento
chore: manutenção
```

**Estrutura de pastas frontend:**
```
src/
  types/          — interfaces TypeScript por domínio
  store/          — Zustand stores (um por domínio)
  features/       — páginas e componentes por feature
  components/ui/  — Button, Input, Card, Modal, Badge, Avatar, Toast, ConfirmDialog
  lib/api.ts      — cliente HTTP com refresh de token automático
  routes/         — AppRoutes.tsx + ProtectedRoute.tsx
  mocks/          — handlers MSW (server.ts + handlers.ts)
tests/
  store/          — testes unitários dos stores (vi.mock da api)
  features/       — testes de integração com MSW
```

**Padrão de store (Zustand):**
```typescript
export const useXxxStore = create<XxxStore>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  fetchItems: async () => { ... },
  createItem: async (data) => { ... },
  deleteItem: async (id) => {
    const item = get().items.find(i => i.id === id)  // captura antes de remover
    set(state => ({ items: state.items.filter(i => i.id !== id) }))  // otimista
    try { await api.delete(`/items/${id}`) }
    catch (error) { /* restaura + seta error */ }
  },
}))
```

**Padrão de teste de store:**
```typescript
vi.mock('../../src/lib/api', () => ({ api: { get: vi.fn(), post: vi.fn(), delete: vi.fn() } }))
import { api } from '../../src/lib/api'
// reset em beforeEach via useXxxStore.setState(initialState)
```

**Caminho de imports nos testes:**
- Arquivos em `tests/store/` → importar com `../../src/...`
- Arquivos em `tests/features/xxx/` → importar com `../../../src/...`

**Padrão de rota:**
- A `NotesPage` (e `ReviewPage`) **não** usam `MainLayout` internamente
- O `AppRoutes.tsx` envolve com `<ProtectedRoute><MainLayout><Page /></MainLayout></ProtectedRoute>`
- Isso é necessário para os testes renderizarem sem `useNavigate` fora de Router

**Padrão de testes de integração (MSW):**
- Usar `{ name: 'Texto Exato' }` em vez de regex quando há elementos ambíguos na tela
- Usar `within(dialog).getBy...` para queries dentro do modal
- Para botões com aria-label vs texto visível, usar o texto exato para distinguir

---

## Design Cadência — O que foi implementado (2026-06-24)

> Redesign completo do frontend. Referências: `DESIGN.md` (especificação) e [artifact dashboard](https://claude.ai/code/artifact/c6678438-6e06-4ecf-a861-b09d1f5b13cc).

### Arquivos modificados

| Arquivo | Mudança principal |
|---|---|
| `frontend/src/index.css` | Tokens Cadência no `@theme` do Tailwind v4, remove glassmorphism, body dark, scrollbar, focus forest |
| `frontend/src/components/layout/MainLayout.tsx` | Remove `<Header>`, sidebar 200px, `bg-surface`, `max-w-[1200px]` |
| `frontend/src/components/layout/Sidebar.tsx` | Sempre `bg-shell` (#080F1A), Georgia brand, mono labels, border-left ativo, `useLocation` |
| `frontend/src/features/dashboard/MetricCard.tsx` | Nova API de props (`label/value/sub/subVariant`), Georgia 36px, sem glassmorphism |
| `frontend/src/features/dashboard/DashboardPage.tsx` | Header "Bom dia + streak ember", 4 métricas, grid matérias+revisões, snapshot kanban |
| `frontend/src/features/schedule/SchedulePage.tsx` | Grid 7 colunas, cabeçalho `bg-shell`, blocos com border-left colorido, dia atual em forest |
| `frontend/src/features/review/ReviewCard.tsx` | Georgia 25px no tópico, botões SM-2 com intervalo visível ("em 4 dias"), border-left 4px |
| `frontend/src/features/review/ReviewProgress.tsx` | Track 2px, fill forest, contador mono |
| `frontend/src/features/review/ReviewPage.tsx` | Header serif, barra de progresso inline, spinner forest |
| `frontend/src/features/kanban/KanbanColumn.tsx` | border-top colorido por coluna (TODO=dim / IN_PROGRESS=ember / DONE=forest), header mono |
| `frontend/src/features/kanban/KanbanTaskCard.tsx` | Card Cadência, prioridade como tag mono colorida, sem glassmorphism |
| `frontend/src/features/kanban/KanbanPage.tsx` | Header Georgia |
| `frontend/src/features/notes/NoteCard.tsx` | border-left 3px cor da matéria, rounded-r, subject tag mono, Georgia no título |
| `frontend/src/features/notes/NotesPage.tsx` | Header Georgia, section labels padrão Cadência, remove `Button` import |
| `frontend/src/components/ui/Card.tsx` | `bg-card border-edge rounded-[5px]`, título Georgia |
| `frontend/src/components/ui/Button.tsx` | Mono uppercase, variantes Cadência (primary=forest, secondary=card2, danger, ghost) |

### Tokens Tailwind v4 disponíveis

```
bg-shell / bg-surface / bg-card / bg-card2
text-ink / text-ink-muted / text-ink-dim
border-edge / border-edge-s
text-forest / bg-forest / border-forest  (+  /10, /15, /20, /25 para fills e bordas)
text-ember  / bg-ember  / border-ember   (+  /10, /20 para fills)
font-serif (Georgia) / font-sans (System-UI) / font-mono (Courier New)
```

---

## Design Cadência — O que refinar (commits futuros)

### Alta prioridade

#### `SubjectPage` + `SubjectDetailsPage`
- Header padrão Georgia como nas demais páginas
- Cards de tópico com `border-left: 3px [cor da matéria]`
- Formulários (`SubjectForm`, `TopicForm`) com estilo Cadência (Input, Select, Button)
- Barra de progresso 2px nos cards de matéria

#### `Modal.tsx`
- Overlay: `bg-shell/80 backdrop-blur-sm` (único blur permitido no sistema)
- Container: `bg-card border border-edge-s rounded-[5px]`
- Título em Georgia
- Botão fechar discreto (X no canto, `text-ink-dim hover:text-ink`)

#### `Input.tsx`
- `bg-card2 border-edge` → focus `border-forest ring-0`
- `text-ink`, placeholder `text-ink-dim`
- Label em mono 8.5px uppercase `text-ink-dim`
- Sem `rounded-md` — usar `rounded-[4px]`

#### Select nativo (`NotesPage`, `ScheduleForm`, `SubjectForm`)
- Mesmo estilo do Input acima
- Trocar setas nativas por ícone Lucide

### Média prioridade

#### `ReviewSessionComplete.tsx`
- Número de revisões completadas em Georgia grande (36–52px)
- Texto "Sessão completa" em mono uppercase
- Acento forest, sem gradiente

#### `ReviewEmptyState.tsx` + `NotesEmptyState.tsx`
- Sem ícone oversized
- Título em Georgia, texto em sans
- CTA como botão forest mono

#### `ConfirmDialog.tsx`
- Fundo `bg-card border-edge-s rounded-[5px]`
- Título em Georgia
- Botões com variantes Cadência (danger para excluir, ghost para cancelar)

#### `Badge.tsx`
- `font-mono text-[7.5px] tracking-[0.07em] uppercase rounded-[2px]`
- Sem `rounded-full`

#### `Toast.tsx`
- Fundo `bg-card2 border border-edge-s rounded-[4px]`
- Variante success: `border-l-4 border-forest text-forest`
- Variante error: `border-l-4 border-red-600 text-red-400`

#### `Avatar.tsx`
- Círculo `bg-forest/10 border border-forest/25`
- Iniciais em forest, fonte sans bold

### Baixa prioridade

#### Páginas de Auth (Login + Register)
- Fundo `bg-shell` full screen
- "Aura" em Georgia grande centralizado
- Formulário em `bg-surface` com `border-edge`
- Sem gradientes, sem glassmorphism

#### Light mode
- Mecanismo: `html[data-theme="light"]` com CSS custom properties semânticas
- Sidebar permanece `#111D2B` em ambos os modos
- Só a área de conteúdo troca: `#F1F3F9` (light) ↔ `#0F1A28` (dark)
- Toggle no rodapé da sidebar

#### Responsividade completa
- Sidebar com hamburguer toggle em ≤ 860px
- Grids de 4 cols → 2 cols em tablet
- Stack vertical em mobile
- Cronograma: scroll horizontal com min-width por coluna

---

## Estado dos testes

| Suite | Testes | Status |
|---|---|---|
| Backend (13 suítes) | 99 | ✅ Passando |
| Frontend store — review | 12 | ✅ Passando |
| Frontend integração — ReviewPage | 5 | ✅ Passando |
| Frontend store — note | 12 | ✅ Passando |
| Frontend integração — NotesPage | 5 | ✅ Passando |
| Frontend demais stores e componentes | ~20 | ✅ Passando |
| Frontend — kanban.store, DashboardPage, SubjectPage, SubjectForm | 5 | ⚠️ Falhas pré-existentes (não relacionadas às fases 7–8) |

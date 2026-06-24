# Cadência — Guia de Implementação do Design

> Design **dark-first** para o Aura Study Planner. A metáfora central é a do livro: sidebar = encadernação, área de conteúdo = página.

---

## 1. Tokens de cor

### 1.1 Dark mode (experiência primária)

| Token | Hex | Uso |
|---|---|---|
| `--d-shell` | `#080F1A` | Sidebar, header — profundidade máxima |
| `--d-bg` | `#0F1A28` | Área de conteúdo — "a página" |
| `--d-card` | `#172436` | Cards, painéis, superfícies |
| `--d-card2` | `#1C2C40` | Cards de segundo nível, hover state |
| `--d-text` | `#D4E4F8` | Texto primário |
| `--d-text2` | `#6E88A4` | Texto secundário, metadados |
| `--d-text3` | `#344F6A` | Texto terciário, labels apagados |
| `--d-border` | `#1B2C40` | Bordas sutis |
| `--d-borders` | `#243650` | Bordas de cards com destaque |
| `--d-forest` | `#3DAA78` | Acento primário — ação, progresso, ativo |
| `--d-forestf` | `rgba(61,170,120,.10)` | Fill de fundo para estado ativo/forest |
| `--d-ember` | `#E08A30` | Streak, conquistas — uso restrito |
| `--d-emberf` | `rgba(224,138,48,.10)` | Fill de fundo para ember |

### 1.2 Light mode (alternativa)

| Token | Hex | Uso |
|---|---|---|
| `--l-shell` | `#111D2B` | Sidebar — **idêntica ao dark mode** |
| `--l-bg` | `#F1F3F9` | Fundo — cool-tinted, não branco puro |
| `--l-card` | `#FFFFFF` | Cards e superfícies |
| `--l-text` | `#111D2B` | Texto primário |
| `--l-text2` | `#647B96` | Texto secundário |
| `--l-border` | `#D9DDE9` | Bordas |
| `--l-forest` | `#2D7A55` | Forest mais escuro para contraste em fundo claro |
| `--l-ember` | `#C4711A` | Ember mais escuro para contraste em fundo claro |

> **Regra do tema:** só a área de conteúdo muda. A sidebar permanece `#111D2B` em ambos os modos. Trocar o tema = trocar `--d-bg ↔ #F1F3F9` e derivados.

---

## 2. Tipografia

Três faces, três funções distintas — a escolha tipográfica é intencional e não deve ser misturada.

| Face | Variável CSS | Uso |
|---|---|---|
| `Georgia, 'Times New Roman', serif` | `--serif` | Títulos de seção, métricas numéricas grandes, títulos de tópico na tela de revisão |
| `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` | `--sans` | Todo o texto de interface: labels, corpo, navegação |
| `'Courier New', Courier, monospace` | `--mono` | Horários no cronograma, intervalos SM-2 nos botões, contadores, eyebrows/labels uppercase |

### Escala de tamanhos

| Elemento | Font | Size | Weight | Letter-spacing |
|---|---|---|---|---|
| Hero display | `--serif` | `clamp(80px, 13vw, 130px)` | bold | `-0.04em` |
| Métrica grande | `--serif` | `34px` | bold | `-0.025em` |
| Título de seção | `--serif` | `25px` | bold | `-0.015em` |
| Título de tópico (revisão) | `--serif` | `25px` | bold | `-0.02em` |
| H2 card | `--serif` | `20px` | bold | `-0.01em` |
| Card name | `--serif` | `14px` | bold | `-0.01em` |
| Body | `--sans` | `14–15px` | normal | — |
| Nav item | `--sans` | `12.5px` | normal / 600 (ativo) | — |
| Eyebrow / label uppercase | `--mono` | `9–10px` | normal | `0.12–0.15em` |
| Intervalos SM-2 | `--mono` | `8.5px` | normal | — |
| Metadados / timestamps | `--mono` | `9.5–12.5px` | normal | — |

---

## 3. Layout e estrutura

### 3.1 Shell app

```
┌─────────────────────────────────────────────────────┐
│  Sidebar (--d-shell / --l-shell)  │  Content area   │
│  190px fixo                       │  (#0F1A28 dark  │
│                                   │   #F1F3F9 light) │
└─────────────────────────────────────────────────────┘
```

- Sidebar: `190px` de largura fixa, cor `--d-shell` (#080F1A dark) / `--l-shell` (#111D2B light — mesmos)
- Padding de seções: `72px` em desktop, `44px 28px` em mobile

### 3.2 Sidebar

```
┌─ Cabeçalho ───────────────────────┐
│  "Aura" (Georgia 18px bold)       │
│  "Planner de estudos" (mono 8px)  │
├─ Navegação ───────────────────────┤
│  [ícone] Dashboard                │
│  [ícone] Matérias                 │
│  [ícone] Cronograma               │
│▌ [ícone] Revisões  ← ATIVO        │  ← border-left 2px forest + bg forestf
│  [ícone] Kanban                   │
│  [ícone] Anotações                │
├─ Rodapé ──────────────────────────┤
│  [avatar] Pedro M.                │
│           tech@thedoor            │
└───────────────────────────────────┘
```

**Item de nav ativo:**
- `border-left: 2px solid var(--d-forest)`
- `background: var(--d-forestf)`
- `color: var(--d-forest)`
- `font-weight: 600`

**Item de nav inativo:**
- `color: var(--d-text3)`
- `border-left: 2px solid transparent`

---

## 4. Componentes

### 4.1 Cards de matéria

- Fundo: `--d-card` / border: `--d-border`
- `border-radius: 5px`
- Indicador de cor da matéria: **somente** como `width: 7px; height: 7px; border-radius: 2px` no canto do card — nunca como background fill
- Barra de progresso: `height: 2px`, fundo `--d-border`, fill com a cor da matéria

### 4.2 Cards de anotação

- `border-left: 3px solid [cor-da-matéria]`
- `border-radius: 0 5px 5px 0` — lado esquerdo reto, direito arredondado
- Tag de matéria: monospace 8px uppercase, fundo `--d-bg`, `border-radius: 2px`

### 4.3 Cards Kanban

- `border-top: 2.5px solid [cor-da-matéria]`
- `border-radius: 0 0 5px 5px` — topo reto, base arredondada
- Label de coluna: monospace 8px uppercase na cor da matéria

### 4.4 Cards de métrica (Dashboard)

- `background: --d-card`, border `--d-border`, `border-radius: 5px`
- Label: monospace 8.5px uppercase, `--d-text3`
- Valor: **Georgia** 34px bold, `--d-text`
- Card de streak: `border-left: 3px solid var(--d-ember)`, valor em `--d-ember`
- Subtítulo positivo (ex: "+3 vs ontem"): `--d-forest`

### 4.5 Cronograma semanal

- Grid 7 colunas
- Header: `--d-bg`, dia ativo: `color: --d-forest`, `background: --d-forestf`
- Bloco de sessão: `border-left: 3px solid [cor-da-matéria]`, fundo `rgba([cor], .08)`
- Nome da sessão: sans 9.5px bold
- Horário: mono 8px, `--d-text2`

---

## 5. Tela de Revisão (SM-2) — a mais importante

Esta é a tela mais característica do app. A escolha de Georgia para o título do tópico é o principal diferenciador visual.

```
┌─ Sidebar ──────┬─── Conteúdo ──────────────────────────────────┐
│                │  Revisões          6 de 14 revisadas hoje ████░│
│                │                                                 │
│                │  ┌──────────────────────────────────────────┐  │
│                │  │ ALGORITMOS · última revisão há 4 dias ·  │  │
│                │  │ 12 dias ›                                 │  │
│                │  │                                           │  │
│                │  │  Análise de Complexidade Amortizada       │  │  ← Georgia 25px bold
│                │  │  Método do potencial, agregado e...       │  │
│                │  └──────────────────────────────────────────┘  │
│                │                                                 │
│                │  [De Novo]   [Difícil]   [Bom]      [Fácil]   │
│                │  repetir hoje  em 1 dia   em 4 dias  em 9 dias │  ← mono 8.5px
│                │                                                 │
│                │              Pular por agora                   │
└────────────────┴─────────────────────────────────────────────────┘
```

**Card de revisão:**
- `border-left: 4px solid var(--d-forest)`
- `border-radius: 2px` (quase quadrado — intencionalmente mais sério)
- `background: --d-card`, border `--d-borders`

**Barra de progresso:**
- `height: 2px`, `background: --d-border`
- Fill: `--d-forest`

**Botões de qualidade:**

| Botão | Border | Background | Text |
|---|---|---|---|
| De Novo | `#3A1E1E` | `rgba(180,50,50,.08)` | `#D07070` |
| Difícil | `#3A2A10` | `--d-emberf` | `--d-ember` |
| Bom | `#1C2E4A` | `rgba(60,100,180,.08)` | `#7AAAE8` |
| Fácil | `#1A3528` | `--d-forestf` | `--d-forest` |

- `border-radius: 4px`, `border: 1.5px solid`
- Rótulo: sans 12px bold
- Intervalo: mono 8.5px, opacity 0.6

---

## 6. O que remover do design atual

| Remover | Motivo |
|---|---|
| `backdrop-filter: blur()` / glassmorphism | Sem ganho funcional; esteticamente datado |
| Cyan `#0ea5e9` como cor primária | Idêntico a qualquer SaaS de gestão |
| `rounded-xl` / `rounded-2xl` generalizados | Cria peso sem hierarquia |
| `shadow-sm → shadow-xl` no hover | Hierarquia por efeito, não por conteúdo |
| Subject color como background fill | Cores de usuário não garantem legibilidade |
| Jost como fonte display | Genérica; sem identidade do domínio |

---

## 7. O que adicionar

| Adicionar | Efeito |
|---|---|
| 3 camadas de profundidade dark: Shell / BG / Card | Hierarquia visual sem sombras ou blur |
| Georgia para métricas e títulos de página | Gravidade acadêmica — o diferenciador principal |
| Courier New para horários e intervalos SM-2 | Distingue visualmente dados calculados de rótulos |
| Left-border 3–4px como único uso de subject color | Funciona com qualquer cor; legibilidade sempre garantida |
| Ember (`#E08A30`) exclusivo para streak/conquistas | Cor de emoção usada no momento de emoção |
| Intervalos SM-2 visíveis nos botões | "em 4 dias" era informação invisível antes |

---

## 8. Cores de matéria (subject colors)

As cores das matérias são definidas pelo usuário e usadas **somente** em:
1. O pip (7×7px) no card de matéria
2. `border-left` nos cards de anotação e kanban
3. `border-top` nos cards kanban
4. `border-left` nos blocos do cronograma
5. Fill da barra de progresso

**Nunca** como background de card, chip de tag, ou texto principal.

Sugestão de paleta padrão para novas matérias:

| Matéria | Dark hex | Nome |
|---|---|---|
| Algoritmos | `#3DAA78` | Forest |
| Cálculo | `#9B7FD4` | Lavender |
| Física | `#E08A30` | Ember |
| Banco de Dados | `#5B9BE8` | Sky |
| (user-defined) | qualquer | — |

---

## 9. Responsividade

Em viewport `≤ 860px`:

- Layout de duas colunas (sidebar + conteúdo) → coluna única
- Sidebar collapse (ocultar em telas de revisão)
- Grids de 4 colunas (métricas) → 2 colunas
- Grids de 3 colunas (cards) → 2 colunas
- Padding de seção: `44px 28px`
- Paleta de cores: sem alterações

---

## 10. Stack técnica

- **Framework:** Vite + React + TypeScript
- **CSS:** Tailwind CSS v4 — tokens definidos via `@theme` em `frontend/src/index.css`
- **Roteamento:** React Router v6

### Mapeamento de tokens → Tailwind utilities

| Token Cadência | CSS var em `@theme` | Utility gerada |
|---|---|---|
| Shell `#080F1A` | `--color-shell` | `bg-shell`, `border-shell` |
| Surface `#0F1A28` | `--color-surface` | `bg-surface` |
| Card `#172436` | `--color-card` | `bg-card`, `border-card` |
| Card2 `#1C2C40` | `--color-card2` | `bg-card2` |
| Text `#D4E4F8` | `--color-ink` | `text-ink` |
| Text2 `#6E88A4` | `--color-ink-muted` | `text-ink-muted` |
| Text3 `#344F6A` | `--color-ink-dim` | `text-ink-dim` |
| Border `#1B2C40` | `--color-edge` | `border-edge`, `bg-edge` |
| Border+ `#243650` | `--color-edge-s` | `border-edge-s` |
| Forest `#3DAA78` | `--color-forest` | `text-forest`, `bg-forest`, `border-forest` — use `bg-forest/10` para fill |
| Ember `#E08A30` | `--color-ember` | `text-ember`, `bg-ember`, `border-ember` — use `bg-ember/10` para fill |
| Georgia | `--font-serif` | `font-serif` |
| System-UI | `--font-sans` | `font-sans` |
| Courier New | `--font-mono` | `font-mono` |

### Regras de componentes

- **Sidebar:** sempre `bg-shell` — não muda com tema
- **Content area:** `bg-surface`
- **Cards:** `bg-card border border-edge rounded-[5px]`
- **Subject color:** somente em `style={{ borderLeftColor: color }}` ou `style={{ borderTopColor: color }}` — nunca como `bg-*`
- **Streak/conquista:** única vez que `text-ember` / `bg-ember/10` aparece
- **Ação/progresso:** `text-forest` / `bg-forest/10` / `border-forest`

### Ordem de implementação (arquivos)

1. `frontend/src/index.css` — tokens + body
2. `frontend/src/components/layout/MainLayout.tsx` — shell sem Header
3. `frontend/src/components/layout/Sidebar.tsx` — always-dark, serif brand
4. `frontend/src/features/dashboard/DashboardPage.tsx` + `MetricCard.tsx`
5. `frontend/src/features/schedule/SchedulePage.tsx`
6. `frontend/src/features/review/ReviewCard.tsx` + `ReviewProgress.tsx`
7. `frontend/src/features/kanban/KanbanColumn.tsx` + `KanbanTaskCard.tsx`
8. `frontend/src/features/notes/NoteCard.tsx`
9. `frontend/src/components/ui/Card.tsx` + `Button.tsx`

import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { useAuthStore } from '../../store/auth.store'

const NAV_SECTIONS = [
  {
    section: 'Geral',
    items: [
      { to: '/', label: 'Dashboard', exact: true },
      { to: '/subjects', label: 'Matérias' },
      { to: '/schedule', label: 'Cronograma' },
    ],
  },
  {
    section: 'Estudo',
    items: [
      { to: '/reviews', label: 'Revisões' },
      { to: '/kanban', label: 'Kanban' },
      { to: '/notes', label: 'Anotações' },
    ],
  },
]

export function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const initials =
    user?.name
      ?.split(' ')
      .slice(0, 2)
      .map((n) => n[0])
      .join('')
      .toUpperCase() || 'U'

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[200px] bg-shell border-r border-edge flex flex-col">
      {/* Brand */}
      <div className="px-[18px] pt-[22px] pb-4 border-b border-edge flex-shrink-0">
        <Link to="/" className="block">
          <div className="font-serif text-[19px] font-bold tracking-[-0.015em] text-ink leading-none mb-[3px]">
            Aura
          </div>
          <div className="font-mono text-[8px] tracking-[0.12em] uppercase text-ink-dim">
            Study Planner
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-[10px] overflow-y-auto">
        {NAV_SECTIONS.map(({ section, items }) => (
          <div key={section}>
            <div className="font-mono text-[8px] tracking-[0.12em] uppercase text-ink-dim px-[17px] pt-[14px] pb-[5px]">
              {section}
            </div>
            {items.map(({ to, label, exact }) => {
              const isActive = exact
                ? location.pathname === to
                : location.pathname === to || location.pathname.startsWith(to + '/')
              return (
                <Link
                  key={to}
                  to={to}
                  className={[
                    'flex items-center gap-[10px] px-[17px] py-[9px] text-[12.5px] border-l-2 transition-colors duration-150',
                    isActive
                      ? 'border-forest bg-forest/10 text-forest font-semibold'
                      : 'border-transparent text-ink-dim hover:text-ink-muted hover:bg-white/[.02]',
                  ].join(' ')}
                >
                  <span
                    className={[
                      'w-[11px] h-[11px] rounded-[2px] flex-shrink-0 transition-opacity',
                      isActive ? 'bg-forest opacity-100' : 'bg-current opacity-30',
                    ].join(' ')}
                  />
                  {label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex-shrink-0 border-t border-edge">
        <div className="px-4 py-3 flex items-center gap-[10px]">
          <div className="w-7 h-7 rounded-full bg-forest/10 border border-forest/25 text-forest text-[9px] font-bold font-sans flex items-center justify-center flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-semibold text-ink-muted truncate leading-tight">
              {user?.name}
            </div>
            <div className="font-mono text-[8.5px] text-ink-dim truncate">
              {user?.email}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sair"
            className="flex-shrink-0 p-1 text-ink-dim hover:text-red-400 transition-colors rounded"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  )
}
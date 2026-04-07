import { useAuthStore } from '../../store/auth.store'
import { Bell, Search } from 'lucide-react'

export function Header() {
  const { user } = useAuthStore()

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-gray-200 bg-white px-6 dark:border-gray-800 dark:bg-gray-900 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Placeholder for Search or Breadcrumbs */}
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar..."
            className="h-9 w-64 rounded-md border border-gray-300 bg-gray-50 pl-9 pr-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500"></span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex flex-col text-right">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</span>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-primary-700">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>
    </header>
  )
}

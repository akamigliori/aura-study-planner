import type { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar />
      <div className="flex-1 ml-[200px] min-w-0">
        <main className="p-10 max-w-[1200px]">{children}</main>
      </div>
    </div>
  )
}
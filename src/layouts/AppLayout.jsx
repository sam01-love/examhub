import { useState } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import { Home, BookOpen, BarChart3, User } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import TopBar from '../components/TopBar'

const bottomNav = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/practice', label: 'Practice', icon: BookOpen },
  { to: '/performance', label: 'Progress', icon: BarChart3 },
  { to: '/settings', label: 'Profile', icon: User },
]

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 pb-24 sm:p-6 lg:p-8 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Persistent mobile bottom nav — stays visible on every route */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {bottomNav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${isActive ? 'bg-secondary' : ''}`}>
                    <Icon size={20} />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}

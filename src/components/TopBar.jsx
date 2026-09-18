import { useState } from 'react'
import { Menu, Bell, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function TopBar({ onMenuClick }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const fullName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'
  const initial = fullName.charAt(0).toUpperCase()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-card px-4 py-3 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground lg:hidden"
        >
          <Menu size={22} />
        </button>
        <div className="lg:hidden">
          <span className="font-heading text-lg font-extrabold tracking-tight text-foreground">
            EXAM<span className="text-primary">HUB</span>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive" />
        </button>

        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-1 py-1 sm:pl-1 sm:pr-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary font-heading text-sm font-semibold text-secondary-foreground">
              {initial}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold leading-tight">{fullName}</span>
              <span className="block text-xs text-muted-foreground">{user?.email}</span>
            </span>
            <ChevronDown size={16} className="hidden text-muted-foreground sm:block" />
          </button>

          {menuOpen && (
            <>
              <button
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              />
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-theme">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-destructive hover:bg-muted"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

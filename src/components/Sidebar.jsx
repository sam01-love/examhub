import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  CirclePlay,
  ClipboardCheck,
  ChartBar,
  Target,
  Settings,
  X,
} from 'lucide-react'
import Logo from './Logo'

const navGroups = [
  {
    label: 'Overview',
    items: [{ to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Practice',
    items: [
      { to: '/practice', label: 'Practice Questions', icon: CirclePlay },
      { to: '/mock-exams', label: 'Mock Exams', icon: ClipboardCheck },
    ],
  },
  {
    label: 'Progress',
    items: [
      { to: '/performance', label: 'Performance', icon: ChartBar },
      { to: '/performance#weak-topics', label: 'Weak Topics', icon: Target },
    ],
  },
]

const linkClasses = ({ isActive }) =>
  `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-secondary font-semibold text-primary'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  }`

export default function Sidebar({ streak = 12, open = false, onClose }) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 shrink-0 flex-col border-r border-border bg-card p-5 transition-transform duration-200 lg:static lg:z-0 lg:w-64 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between">
          <Logo to="/dashboard" />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-10 flex-1 space-y-7 overflow-y-auto scrollbar-none text-sm">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map(({ to, label, icon: Icon, end }) => (
                  <NavLink key={label} to={to} end={end} className={linkClasses} onClick={onClose}>
                    <Icon size={18} />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <NavLink to="/settings" className={linkClasses}>
          <Settings size={18} />
          Settings
        </NavLink>

        <div className="mt-4 rounded-xl bg-secondary p-4">
          <p className="text-xs font-semibold text-primary">{streak}-day streak</p>
          <p className="mt-1 text-sm font-medium text-secondary-foreground">Keep your momentum going.</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-card">
            <div className="h-full rounded-full bg-tertiary" style={{ width: `${Math.min(streak * 8, 100)}%` }} />
          </div>
        </div>
      </aside>
    </>
  )
}

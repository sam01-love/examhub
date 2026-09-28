import { NavLink } from 'react-router-dom'
import { LayoutDashboard, ListChecks, FilePlus, UploadCloud, X, ArrowLeftRight } from 'lucide-react'
import Logo from './Logo'

const navItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/questions', label: 'All Questions', icon: ListChecks },
  { to: '/admin/questions/new', label: 'Add Question', icon: FilePlus },
  { to: '/admin/import', label: 'Bulk Import', icon: UploadCloud },
]

const linkClasses = ({ isActive }) =>
  `flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-secondary font-semibold text-primary'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  }`

export default function AdminSidebar({ open = false, onClose }) {
  return (
    <>
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
          <Logo to="/admin" />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <span className="mt-4 w-fit rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          Admin
        </span>

        <nav className="mt-8 flex-1 space-y-1 overflow-y-auto scrollbar-none text-sm">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={label} to={to} end={end} className={linkClasses} onClick={onClose}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <NavLink to="/dashboard" className={linkClasses}>
          <ArrowLeftRight size={18} />
          Back to student view
        </NavLink>
      </aside>
    </>
  )
}

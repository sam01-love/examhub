import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Trophy, User } from 'lucide-react'

// Exactly 4 icons, always in the same order, on every screen of the app —
// the active tab highlights, but the set itself never changes or
// disappears while navigating (including mid-practice / mid-exam).
const items = [
    { to: '/dashboard', label: 'Home', icon: Home },
    { to: '/practice', label: 'Practice', icon: BookOpen },
    { to: '/mock-exams', label: 'Exams', icon: Trophy },
    { to: '/settings', label: 'Profile', icon: User },
]

export default function BottomNav() {
    const location = useLocation()

    return (
        <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md lg:hidden">
            <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
                {items.map(({ to, label, icon: Icon }) => {
                    const active = location.pathname === to || location.pathname.startsWith(`${to}/`)
                    return (
                        <Link
                            key={label}
                            to={to}
                            aria-label={label}
                            className={`flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-xl text-[11px] font-semibold transition-colors ${active ? 'text-primary' : 'text-muted-foreground hover:text-primary'
                                }`}
                        >
                            <span
                                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${active ? 'bg-secondary text-primary' : ''
                                    }`}
                            >
                                <Icon size={20} />
                            </span>
                            {label}
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

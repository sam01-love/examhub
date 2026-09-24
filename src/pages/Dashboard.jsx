import { Link, useLocation } from 'react-router-dom'
import {
  Play,
  Layers,
  ChartBar,
  CircleCheck,
  Zap,
  Home,
  BookOpen,
  BarChart3,
  User,
  ArrowRight,
  Flame,
  Sparkles,
  ChevronRight,
  Trophy,
  TrendingUp,
  FlaskConical,
  Landmark,
  Briefcase,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { weeklyActivity, subjectPerformance, weakTopics, streams, subjectMeta } from '../data/mockData'

const streamIcons = { FlaskConical, Landmark, Briefcase }

const stats = [
  { icon: Layers, label: 'Questions Practiced', value: '1,248', trend: '+86 this week', good: true },
  { icon: ChartBar, label: 'Average Score', value: '78%', trend: '+4% this month', good: true },
  { icon: CircleCheck, label: 'Correct Answers', value: '974', trend: '78% accuracy', good: false },
  { icon: Zap, label: 'Study Streak', value: '12 days', trend: 'Personal best!', good: true },
]

// Static bottom nav — always the same icons, only highlight changes
const bottomNav = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/practice', label: 'Practice', icon: BookOpen },
  { to: '/performance', label: 'Focus', icon: BarChart3 },
  { to: '/mock-exams', label: 'Mocks', icon: Trophy },
  { to: '/settings', label: 'Profile', icon: User },
]

export default function Dashboard() {
  const { user } = useAuth()
  const location = useLocation()
  const firstName = (user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there').split(' ')[0]
  const initials = (user?.user_metadata?.full_name || user?.email || 'TO')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  const maxActivity = Math.max(...weeklyActivity.map((d) => d.value))
  const weakest = weakTopics[0]
  const weakestSubjectName = subjectMeta[weakest.subject]?.name || weakest.subject

  // Mock momentum value for the circular progress
  const momentum = 64

  return (
    <div className="mx-auto w-full max-w-md space-y-6 pb-24 sm:max-w-2xl lg:max-w-6xl lg:pb-8">
      {/* ===== Header (greeting + avatar) ===== */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {today}
          </p>
          <h1 className="mt-1 truncate font-heading text-2xl font-bold sm:text-3xl">
            Good morning, {firstName}.
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Small steps. Big results.</p>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
          {initials}
        </div>
      </div>

      {/* ===== Momentum / Streak Card ===== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/85 p-6 text-primary-foreground shadow-theme sm:p-7">
        {/* decorative glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
              <Flame size={12} />
              Your Momentum
            </span>
            <h2 className="mt-3 font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
              4 day streak
            </h2>
            <p className="mt-2 max-w-xs text-sm opacity-90">
              Keep it going — you're 20 min from your weekly goal.
            </p>
          </div>

          {/* Circular progress */}
          <div className="relative h-20 w-20 shrink-0">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="3"
              />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${momentum}, 100`}
                className="text-tertiary"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
              {momentum}%
            </span>
          </div>
        </div>

        <Link
          to="/practice"
          className="relative mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-white/15 font-semibold backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
        >
          <Play size={16} className="mr-2" />
          Start a 25 min session
        </Link>
      </section>

      {/* ===== Choose a JAMB stream ===== */}
      <section>
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold">Practice by stream</h3>
          <Link to="/practice" className="text-sm font-semibold text-primary transition hover:text-primary/80">
            See all
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {streams.map((stream) => {
            const Icon = streamIcons[stream.icon]
            return (
              <Link
                key={stream.id}
                to={`/practice?stream=${stream.id}`}
                className="group flex items-start gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105">
                  <Icon size={20} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold">{stream.name}</p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{stream.tagline}</p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ===== Continue learning ===== */}
      <section>
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold">Continue learning</h3>
          <Link
            to="/practice"
            className="text-sm font-semibold text-primary transition hover:text-primary/80"
          >
            See library
          </Link>
        </div>

        <Link
          to="/practice/session?subject=mathematics&stream=science"
          className="group mt-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-theme"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tertiary/15 text-tertiary">
            <BookOpen size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-base font-bold">JAMB Mathematics</p>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">
              Science stream · Algebra & number bases
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 rounded-full bg-tertiary" />
            </div>
          </div>
          <ArrowRight
            size={18}
            className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
          />
        </Link>
      </section>

      {/* ===== Stats Grid ===== */}
      <section>
        <h3 className="font-heading text-lg font-bold">This week</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value, trend, good }) => (
            <div
              key={label}
              className="group rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-theme sm:p-5"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105 sm:h-11 sm:w-11">
                  <Icon size={20} />
                </span>
                {good && (
                  <span className="hidden items-center gap-1 rounded-full bg-tertiary/10 px-2 py-1 text-[10px] font-bold text-tertiary sm:flex">
                    <TrendingUp size={11} />
                    UP
                  </span>
                )}
              </div>
              <p className="mt-4 text-xs text-muted-foreground sm:mt-5 sm:text-sm">{label}</p>
              <p className="mt-1 font-heading text-xl font-bold sm:text-2xl">{value}</p>
              <p className={`mt-2 text-xs font-semibold ${good ? 'text-tertiary' : 'text-muted-foreground'}`}>
                {trend}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Recommended Next + Performance ===== */}
      <section className="grid gap-6 lg:grid-cols-5">
        {/* Recommended Next */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 lg:col-span-2">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/50 blur-2xl" />
          <div className="relative">
            <p className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-primary">
              <Sparkles size={13} />
              RECOMMENDED NEXT
            </p>
            <h3 className="mt-2 font-heading text-lg font-bold">
              {weakestSubjectName} — {weakest.topic}
            </h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Accuracy <span className="font-bold text-destructive">{weakest.accuracy}%</span> · Needs more practice
            </p>
            <Link
              to={`/practice/session?subject=${weakest.subject}&topic=${encodeURIComponent(weakest.topic)}`}
              className="group mt-6 flex min-h-11 w-full items-center justify-center rounded-xl bg-secondary font-semibold text-primary transition-all hover:bg-secondary/80"
            >
              Practice Topic
              <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading text-lg font-semibold">Performance</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Your activity this week</p>
            </div>
            <Link
              to="/performance"
              className="group flex items-center text-sm font-semibold text-primary transition hover:text-primary/80"
            >
              View details
              <ChevronRight size={15} className="ml-0.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-7 flex h-36 items-end justify-between gap-2 sm:gap-3">
            {weeklyActivity.map((d, i) => (
              <div key={d.day} className="group flex w-full flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-300 ${i >= 2
                        ? 'bg-gradient-to-t from-primary to-primary/70 group-hover:from-primary group-hover:to-primary'
                        : 'bg-secondary group-hover:bg-secondary/80'
                      }`}
                    style={{ height: `${(d.value / maxActivity) * 100}%` }}
                  />
                  <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-[10px] font-semibold text-background opacity-0 transition-opacity group-hover:opacity-100">
                    {d.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            {weeklyActivity.map((d) => (
              <span key={d.day} className="flex-1 text-center">
                {d.day}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Subject Performance ===== */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-primary">
            <BarChart3 size={16} />
          </span>
          <h3 className="font-heading text-lg font-semibold">Subject Performance</h3>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {subjectPerformance.map((s) => (
            <div key={s.subject}>
              <div className="flex justify-between text-sm">
                <span className="font-medium">{s.subject}</span>
                <b className={s.accuracy >= 85 ? 'text-tertiary' : 'text-primary'}>{s.accuracy}%</b>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${s.accuracy >= 85
                      ? 'bg-gradient-to-r from-tertiary to-tertiary/70'
                      : 'bg-gradient-to-r from-primary to-primary/70'
                    }`}
                  style={{ width: `${s.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== Static Mobile Bottom Navigation ===== */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {bottomNav.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to
            return (
              <Link
                key={label}
                to={to}
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
    </div>
  )
}

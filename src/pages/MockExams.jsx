import { Link } from 'react-router-dom'
import {
  Play,
  Layers,
  ChartBar,
  CircleCheck,
  Zap,
  BookOpen,
  BarChart3,
  ArrowRight,
  Flame,
  ChevronRight,
  FlaskConical,
  Landmark,
  Briefcase,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { weeklyActivity, subjectPerformance, weakTopics, streams, subjectMeta } from '../data/mockData'

const streamIcons = { FlaskConical, Landmark, Briefcase }

// Icon-led stat tiles — value does the talking, label stays to one word.
const stats = [
  { icon: Layers, label: 'Practiced', value: '1,248' },
  { icon: ChartBar, label: 'Avg. score', value: '78%' },
  { icon: CircleCheck, label: 'Correct', value: '974' },
  { icon: Zap, label: 'Streak', value: '12d' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const firstName = (user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there').split(' ')[0]
  const initials = (user?.user_metadata?.full_name || user?.email || 'TO')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
  const maxActivity = Math.max(...weeklyActivity.map((d) => d.value))
  const weakest = weakTopics[0]
  const weakestSubjectName = subjectMeta[weakest.subject]?.name || weakest.subject

  // Mock momentum value for the circular progress
  const momentum = 64

  return (
    <div className="mx-auto w-full max-w-md space-y-6 sm:max-w-2xl lg:max-w-6xl">
      {/* ===== Header (greeting + avatar) ===== */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{today}</p>
          <h1 className="mt-1 truncate font-heading text-2xl font-bold sm:text-3xl">Hi, {firstName}</h1>
        </div>
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
          {initials}
        </div>
      </div>

      {/* ===== Momentum / Streak Card ===== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/85 p-6 text-primary-foreground shadow-theme sm:p-7">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/5 blur-2xl" />

        <div className="relative flex items-center justify-between gap-4">
          <div className="flex-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
              <Flame size={12} />
              Momentum
            </span>
            <h2 className="mt-3 font-heading text-2xl font-extrabold leading-tight sm:text-3xl">4 day streak</h2>
          </div>

          {/* Circular progress */}
          <div className="relative h-20 w-20 shrink-0">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
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
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">{momentum}%</span>
          </div>
        </div>

        <Link
          to="/practice"
          className="relative mt-5 flex min-h-12 w-full items-center justify-center rounded-2xl bg-white/15 font-semibold backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
        >
          <Play size={16} className="mr-2" />
          Start practicing
        </Link>
      </section>

      {/* ===== Choose a JAMB stream — icon tiles, minimal copy ===== */}
      <section>
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-lg font-bold">Combinations</h3>
          <Link to="/practice" className="text-sm font-semibold text-primary transition hover:text-primary/80">
            See all
          </Link>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {streams.map((stream) => {
            const Icon = streamIcons[stream.icon]
            return (
              <Link
                key={stream.id}
                to={`/practice?stream=${stream.id}`}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105">
                  <Icon size={20} />
                </span>
                <p className="text-xs font-bold">{stream.name}</p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* ===== Continue learning ===== */}
      <section>
        <h3 className="font-heading text-lg font-bold">Continue</h3>
        <Link
          to="/practice/session?mode=study&subject=mathematics&stream=science"
          className="group mt-4 flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-theme"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-tertiary/15 text-tertiary">
            <BookOpen size={22} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-heading text-base font-bold">Mathematics</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <div className="h-full w-2/3 rounded-full bg-tertiary" />
            </div>
          </div>
          <ArrowRight
            size={18}
            className="shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
          />
        </Link>
      </section>

      {/* ===== Stats Grid — icon led, one-word labels ===== */}
      <section>
        <h3 className="font-heading text-lg font-bold">This week</h3>
        <div className="mt-4 grid grid-cols-4 gap-2 sm:gap-4">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-3 text-center transition-all hover:-translate-y-0.5 hover:shadow-theme sm:p-5"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-primary sm:h-11 sm:w-11">
                <Icon size={20} />
              </span>
              <p className="font-heading text-lg font-bold sm:text-2xl">{value}</p>
              <p className="text-[11px] text-muted-foreground sm:text-sm">{label}</p>
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
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <Zap size={16} />
            </span>
            <h3 className="mt-3 font-heading text-lg font-bold">
              {weakestSubjectName} — {weakest.topic}
            </h3>
            <p className="mt-2 text-sm font-bold text-destructive">{weakest.accuracy}% accuracy</p>
            <Link
              to={`/practice/session?mode=study&subject=${weakest.subject}&topic=${encodeURIComponent(weakest.topic)}`}
              className="group mt-6 flex min-h-11 w-full items-center justify-center rounded-xl bg-secondary font-semibold text-primary transition-all hover:bg-secondary/80"
            >
              Practice now
              <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <BarChart3 size={16} />
            </span>
            <Link to="/performance" className="group flex items-center text-sm font-semibold text-primary transition hover:text-primary/80">
              Details
              <ChevronRight size={15} className="ml-0.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-6 flex h-36 items-end justify-between gap-2 sm:gap-3">
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
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
          <BarChart3 size={16} />
        </span>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {subjectPerformance.map((s) => (
            <div key={s.subject}>
              <div className="flex justify-between text-sm">
                <span className="font-medium">{s.subject}</span>
                <b className={s.accuracy >= 85 ? 'text-tertiary' : 'text-primary'}>{s.accuracy}%</b>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${s.accuracy >= 85 ? 'bg-gradient-to-r from-tertiary to-tertiary/70' : 'bg-gradient-to-r from-primary to-primary/70'
                    }`}
                  style={{ width: `${s.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

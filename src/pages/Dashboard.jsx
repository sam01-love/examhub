import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Play,
  Layers,
  Percent,
  Flame,
  Target,
  FlaskConical,
  Landmark,
  Briefcase,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { streams, subjectMeta } from '../data/mockData'
import { fetchPerformanceSummary } from '../lib/attemptsApi'

const streamIcons = { FlaskConical, Landmark, Briefcase }

const FALLBACK_WEEKLY = [
  { day: 'Mon', value: 0 },
  { day: 'Tue', value: 0 },
  { day: 'Wed', value: 0 },
  { day: 'Thu', value: 0 },
  { day: 'Fri', value: 0 },
  { day: 'Sat', value: 0 },
  { day: 'Sun', value: 0 },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)

  const firstName = (user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'there').split(' ')[0]
  const initials = (user?.user_metadata?.full_name || user?.email || 'TO')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  useEffect(() => {
    let active = true
    if (!user?.id) return
    setLoading(true)
    fetchPerformanceSummary(user.id).then((result) => {
      if (active) {
        setSummary(result)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [user?.id])

  const practiced = summary?.practiced ?? 0
  const accuracy = summary?.accuracy ?? 0
  const streak = summary?.streak ?? 0
  const weeklyActivity = summary?.weeklyActivity ?? FALLBACK_WEEKLY
  const weakest = summary?.weakTopics?.[0]
  const maxActivity = Math.max(1, ...weeklyActivity.map((d) => d.value))

  const stats = [
    { icon: Layers, value: practiced.toLocaleString(), label: 'Practiced' },
    { icon: Percent, value: `${accuracy}%`, label: 'Accuracy' },
    { icon: Flame, value: String(streak), label: 'Day streak' },
    { icon: Target, value: '300+', label: 'Target' },
  ]

  return (
    <div className="mx-auto w-full max-w-md space-y-6 sm:max-w-2xl lg:max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-xl font-bold sm:text-2xl">Hi, {firstName}</h1>
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary">
          {initials}
        </div>
      </div>

      {/* Primary CTA */}
      <Link
        to="/practice"
        className="flex items-center justify-between gap-4 rounded-2xl bg-primary p-5 text-primary-foreground shadow-theme transition-all hover:-translate-y-0.5 sm:p-6"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
            <Play size={22} />
          </span>
          <div>
            <p className="font-heading text-lg font-bold">Start Practicing</p>
            <p className="text-sm opacity-85">Study or Exam Mode</p>
          </div>
        </div>
        <ArrowRight size={20} className="shrink-0" />
      </Link>

      {/* Stat row — icon-forward, minimal text */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {stats.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center rounded-2xl border border-border bg-card p-3 text-center sm:p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
              <Icon size={17} />
            </span>
            <p className="mt-2 font-heading text-base font-bold sm:text-lg">{loading ? '—' : value}</p>
            <p className="text-[10px] text-muted-foreground sm:text-xs">{label}</p>
          </div>
        ))}
      </div>

      {/* Streams — icon shortcuts */}
      <div className="grid grid-cols-3 gap-3">
        {streams.map((stream) => {
          const Icon = streamIcons[stream.icon]
          return (
            <Link
              key={stream.id}
              to={`/practice?mode=study&stream=${stream.id}`}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon size={20} />
              </span>
              <p className="mt-2 text-xs font-bold sm:text-sm">{stream.name}</p>
            </Link>
          )
        })}
      </div>

      {/* Weekly activity — compact chart, minimal labels */}
      <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
        <div className="flex h-28 items-end justify-between gap-2 sm:gap-3">
          {weeklyActivity.map((d) => (
            <div key={d.day} className="flex w-full flex-col items-center gap-2">
              <div
                className="w-full rounded-t-lg bg-secondary"
                style={{ height: `${(d.value / maxActivity) * 100}%` }}
              />
              <span className="text-[10px] font-medium text-muted-foreground">{d.day[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Focus area — single icon tile, links to Performance for detail */}
      {weakest ? (
        <Link
          to="/performance"
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-theme"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <Target size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">
              {subjectMeta[weakest.subject]?.short}: {weakest.topic}
            </p>
            <p className="text-xs text-muted-foreground">{weakest.accuracy}% accuracy</p>
          </div>
          <ArrowRight size={18} className="shrink-0 text-muted-foreground" />
        </Link>
      ) : (
        <Link
          to="/practice"
          className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-theme"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
            <Target size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold">No weak topics yet</p>
            <p className="text-xs text-muted-foreground">Answer a few more questions to see where to focus.</p>
          </div>
          <ArrowRight size={18} className="shrink-0 text-muted-foreground" />
        </Link>
      )}
    </div>
  )
}
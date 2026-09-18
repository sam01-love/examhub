import { Link } from 'react-router-dom'
import { Target, ArrowRight, TrendingUp } from 'lucide-react'
import { weeklyActivity, subjectPerformance, weakTopics, subjectMeta } from '../data/mockData'

export default function Performance() {
  const maxActivity = Math.max(...weeklyActivity.map((d) => d.value))

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-primary">Your progress</p>
        <h1 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">Performance overview</h1>
        <p className="mt-2 text-muted-foreground">
          See how your practice is trending, and which topics deserve your next session.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-5">
        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-lg font-semibold">Weekly activity</h2>
            <span className="flex items-center gap-1 text-sm font-semibold text-tertiary">
              <TrendingUp size={16} />
              Trending up
            </span>
          </div>
          <div className="mt-7 flex h-40 items-end justify-between gap-3">
            {weeklyActivity.map((d, i) => (
              <div key={d.day} className="flex w-full flex-col items-center gap-2">
                <span className="text-xs font-semibold text-muted-foreground">{d.value}</span>
                <div
                  className={`w-full rounded-t-lg ${i >= 4 ? 'bg-primary' : 'bg-secondary'}`}
                  style={{ height: `${(d.value / maxActivity) * 100}%` }}
                />
              </div>
            ))}
          </div>
          <div className="mt-3 flex justify-between text-xs text-muted-foreground">
            {weeklyActivity.map((d) => (
              <span key={d.day}>{d.day}</span>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="font-heading text-lg font-semibold">Subject accuracy</h2>
          <div className="mt-5 space-y-4">
            {subjectPerformance.map((s) => (
              <div key={s.subject}>
                <div className="flex justify-between text-sm">
                  <span>{s.subject}</span>
                  <b>{s.accuracy}%</b>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full ${s.accuracy >= 85 ? 'bg-tertiary' : 'bg-primary'}`}
                    style={{ width: `${s.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="weak-topics" className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
            <Target size={18} />
          </span>
          <h2 className="font-heading text-lg font-semibold">Weak topics to focus on</h2>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {weakTopics.map((t) => (
            <div key={t.topic} className="rounded-xl bg-muted p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {subjectMeta[t.subject]?.name || t.subject}
              </p>
              <h3 className="mt-1 font-heading text-lg font-semibold">{t.topic}</h3>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t.questions} questions</span>
                <span className="font-bold text-destructive">{t.accuracy}% accuracy</span>
              </div>
              <Link
                to={`/practice/session?subject=${t.subject}&topic=${encodeURIComponent(t.topic)}`}
                className="mt-5 flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Practice now <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

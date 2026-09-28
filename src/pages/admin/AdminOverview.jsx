import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ListChecks, FilePlus, UploadCloud, TriangleAlert, BookOpen } from 'lucide-react'
import { fetchQuestionStats } from '../../lib/questionsApi'
import { subjects } from '../../data/mockData'

const subjectLabel = (id) => subjects.find((s) => s.id === id)?.name || id

export default function AdminOverview() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    fetchQuestionStats()
      .then((data) => {
        if (active) setStats(data)
      })
      .catch((err) => {
        if (active) setError(err.message || 'Could not load question stats.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  const subjectEntries = stats ? Object.entries(stats.subjectCounts).sort((a, b) => b[1] - a[1]) : []
  const maxCount = subjectEntries.length ? Math.max(...subjectEntries.map(([, c]) => c)) : 1

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm font-bold uppercase tracking-wider text-primary">Content management</p>
        <h1 className="mt-2 font-heading text-2xl font-bold sm:text-3xl">Admin dashboard</h1>
        <p className="mt-2 text-muted-foreground">Manage the question bank students practice from.</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          <TriangleAlert size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Couldn't load the question bank.</p>
            <p className="mt-1">
              {error} This usually means the <code className="rounded bg-destructive/10 px-1">questions</code>{' '}
              table hasn't been created in Supabase yet — see the README for the setup SQL.
            </p>
          </div>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-3">
        <Link
          to="/admin/questions"
          className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
            <ListChecks size={20} />
          </span>
          <p className="mt-5 text-sm text-muted-foreground">Total questions</p>
          <p className="mt-1 font-heading text-3xl font-bold">{loading ? '—' : stats?.total ?? 0}</p>
        </Link>

        <Link
          to="/admin/questions/new"
          className="rounded-xl bg-primary p-5 text-primary-foreground shadow-theme transition-transform hover:-translate-y-0.5"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/15">
            <FilePlus size={20} />
          </span>
          <p className="mt-5 font-heading text-lg font-semibold">Add a question</p>
          <p className="mt-1 text-sm text-primary-foreground/80">Create one question with answer options.</p>
        </Link>

        <Link
          to="/admin/import"
          className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-primary">
            <UploadCloud size={20} />
          </span>
          <p className="mt-5 font-heading text-lg font-semibold">Bulk import</p>
          <p className="mt-1 text-sm text-muted-foreground">Upload many questions at once from a CSV file.</p>
        </Link>
      </section>

      <section className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
            <BookOpen size={18} />
          </span>
          <h2 className="font-heading text-lg font-semibold">Questions by subject</h2>
        </div>

        {loading && <p className="mt-5 text-sm text-muted-foreground">Loading…</p>}

        {!loading && !error && subjectEntries.length === 0 && (
          <p className="mt-5 text-sm text-muted-foreground">
            No questions yet.{' '}
            <Link to="/admin/questions/new" className="font-semibold text-primary">
              Add your first question
            </Link>{' '}
            to get started.
          </p>
        )}

        {subjectEntries.length > 0 && (
          <div className="mt-5 space-y-4">
            {subjectEntries.map(([subject, count]) => (
              <div key={subject}>
                <div className="flex justify-between text-sm">
                  <span>{subjectLabel(subject)}</span>
                  <b>{count}</b>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${(count / maxCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

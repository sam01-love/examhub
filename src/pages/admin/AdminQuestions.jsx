import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Pencil, Trash2, Plus, TriangleAlert, FileQuestion } from 'lucide-react'
import { fetchQuestions, deleteQuestion } from '../../lib/questionsApi'
import { examTypes, subjects } from '../../data/mockData'

const subjectLabel = (id) => subjects.find((s) => s.id === id)?.name || id
const examLabel = (id) => examTypes.find((e) => e.id === id)?.name || id

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [examType, setExamType] = useState('')
  const [subject, setSubject] = useState('')
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const load = () => {
    setLoading(true)
    setError('')
    fetchQuestions({ examType: examType || undefined, subject: subject || undefined, search: search || undefined })
      .then(setQuestions)
      .catch((err) => setError(err.message || 'Could not load questions.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    const t = setTimeout(load, 250) // debounce search/filter changes
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examType, subject, search])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question? This cannot be undone.')) return
    setDeletingId(id)
    try {
      await deleteQuestion(id)
      setQuestions((prev) => prev.filter((q) => q.id !== id))
    } catch (err) {
      alert(err.message || 'Could not delete this question.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Question bank</p>
          <h1 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">All questions</h1>
        </div>
        <Link
          to="/admin/questions/new"
          className="flex min-h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md"
        >
          <Plus size={18} className="mr-2" />
          Add question
        </Link>
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search question text…"
            className="min-h-11 w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All exam types</option>
          {examTypes.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-5 text-sm text-destructive">
          <TriangleAlert size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Couldn't load questions.</p>
            <p className="mt-1">{error}</p>
          </div>
        </div>
      )}

      {loading && <p className="text-sm text-muted-foreground">Loading questions…</p>}

      {!loading && !error && questions.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-border bg-card px-6 py-16 text-center">
          <FileQuestion size={36} className="text-muted-foreground" />
          <p className="mt-4 font-semibold">No questions match your filters yet.</p>
          <Link to="/admin/questions/new" className="mt-4 flex min-h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground">
            Add your first question
          </Link>
        </div>
      )}

      {!loading && questions.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="max-h-[32rem] overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 border-b border-border bg-muted text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Question</th>
                  <th className="px-4 py-3">Subject</th>
                  <th className="px-4 py-3">Exam</th>
                  <th className="px-4 py-3">Answer</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {questions.map((q) => (
                  <tr key={q.id}>
                    <td className="max-w-sm px-4 py-3">
                      <p className="line-clamp-2 font-medium">{q.prompt}</p>
                      {q.topic && <p className="mt-0.5 text-xs text-muted-foreground">{q.topic}</p>}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{subjectLabel(q.subject)}</td>
                    <td className="px-4 py-3 text-muted-foreground">{examLabel(q.exam_type)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold text-primary">
                        {String.fromCharCode(65 + q.answer)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/questions/${q.id}/edit`}
                          aria-label="Edit question"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-primary"
                        >
                          <Pencil size={16} />
                        </Link>
                        <button
                          onClick={() => handleDelete(q.id)}
                          disabled={deletingId === q.id}
                          aria-label="Delete question"
                          className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { ArrowRight, BookOpen, Check, Loader2, Timer } from 'lucide-react'
import { examYears, fetchTopics, subjectMeta } from '../data/mockData'

// The step between picking a subject (or exam combination) and starting:
// choose the exam year, the topics (Study Mode) and confirm the mode.

function ModeChip({ mode }) {
  const isExam = mode === 'exam'
  const Icon = isExam ? Timer : BookOpen
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-xs font-bold text-primary">
      <Icon size={14} />
      {isExam ? 'Exam Mode' : 'Study Mode'}
    </span>
  )
}

function YearSelect({ value, onChange }) {
  return (
    <div>
      <label htmlFor="exam-year" className="text-sm font-semibold">
        Exam year
      </label>
      <select
        id="exam-year"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 min-h-11 w-full rounded-lg border border-border bg-card px-3 text-sm font-medium focus:border-primary focus:outline-none"
      >
        <option value="">All years</option>
        {examYears.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
    </div>
  )
}

function StartButton({ disabled, onClick, children }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-40 sm:w-auto"
    >
      {children}
      <ArrowRight size={18} className="ml-2" />
    </button>
  )
}

// Study Mode: one subject — pick the year and which topics to cover.
export function StudyOptions({ examType, subjectId, onStart }) {
  const [year, setYear] = useState('')
  const [topics, setTopics] = useState(null) // null = loading
  const [selected, setSelected] = useState(() => new Set())

  useEffect(() => {
    let active = true
    setTopics(null)
    fetchTopics(subjectId, examType, year ? Number(year) : null).then((list) => {
      if (!active) return
      setTopics(list)
      setSelected(new Set(list.map((t) => t.topic))) // everything ticked by default
    })
    return () => {
      active = false
    }
  }, [subjectId, examType, year])

  const toggle = (topic) =>
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(topic)) next.delete(topic)
      else next.add(topic)
      return next
    })

  const allSelected = topics && topics.length > 0 && selected.size === topics.length
  const available = topics ? topics.filter((t) => selected.has(t.topic)).reduce((sum, t) => sum + t.count, 0) : 0
  const canStart = Boolean(topics) && topics.length > 0 && selected.size > 0

  const start = () => onStart({ year: year ? Number(year) : null, topics: allSelected ? [] : [...selected] })

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-heading text-lg font-bold">{subjectMeta[subjectId]?.name || subjectId}</h2>
        <ModeChip mode="study" />
      </div>

      <YearSelect value={year} onChange={setYear} />

      <div>
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Topics</p>
          {topics && topics.length > 0 && (
            <button
              onClick={() => setSelected(allSelected ? new Set() : new Set(topics.map((t) => t.topic)))}
              className="text-xs font-semibold text-primary hover:underline"
            >
              {allSelected ? 'Clear all' : 'Select all'}
            </button>
          )}
        </div>

        {topics === null && (
          <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin text-primary" /> Loading topics…
          </div>
        )}

        {topics && topics.length === 0 && (
          <p className="mt-3 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
            {year
              ? `No ${year} questions have been added for this subject yet. Try another year or choose "All years".`
              : 'No questions have been added for this subject yet.'}
          </p>
        )}

        {topics && topics.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {topics.map(({ topic, count }) => {
              const active = selected.has(topic)
              return (
                <button
                  key={topic}
                  onClick={() => toggle(topic)}
                  aria-pressed={active}
                  className={`flex min-h-10 items-center gap-1.5 rounded-xl border px-3 text-sm font-medium transition-colors ${
                    active ? 'border-2 border-primary bg-secondary font-semibold' : 'border-border bg-card hover:border-primary'
                  }`}
                >
                  {active && <Check size={14} className="text-primary" />}
                  {topic}
                  <span className="text-xs text-muted-foreground">({count})</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col items-start gap-3 rounded-2xl bg-secondary p-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {canStart ? `${available} question${available === 1 ? '' : 's'} available in your selection` : 'Choose at least one topic to start'}
        </p>
        <StartButton disabled={!canStart} onClick={start}>
          Start Study
        </StartButton>
      </div>
    </section>
  )
}

// Exam Mode: a full paper across the chosen subjects — pick the year only
// (a real exam covers every topic, so there is no topic filter here).
export function ExamOptions({ subjectIds, onStart }) {
  const [year, setYear] = useState('')

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-heading text-lg font-bold">Your exam</h2>
        <ModeChip mode="exam" />
      </div>

      <div className="flex flex-wrap gap-2">
        {subjectIds.map((id) => (
          <span key={id} className="rounded-xl bg-muted px-3 py-2 text-sm font-semibold">
            {subjectMeta[id]?.short || id}
          </span>
        ))}
      </div>

      <YearSelect value={year} onChange={setYear} />
      <p className="text-xs text-muted-foreground">Exam Mode covers every topic, like the real paper.</p>

      <div className="flex justify-end">
        <StartButton onClick={() => onStart({ year: year ? Number(year) : null })}>Start Exam</StartButton>
      </div>
    </section>
  )
}

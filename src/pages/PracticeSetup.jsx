import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  FlaskConical,
  Landmark,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Search,
  CheckCircle2,
  ListChecks,
} from 'lucide-react'
import { streams, subjectMeta, questionBank, pastPapers } from '../data/mockData'

const streamIcons = { FlaskConical, Landmark, Briefcase }

export default function PracticeSetup() {
  const [params, setParams] = useSearchParams()
  const streamParam = params.get('stream')
  const [query, setQuery] = useState('')

  const activeStream = useMemo(
    () => streams.find((s) => s.id === streamParam) || null,
    [streamParam]
  )

  const selectStream = (id) => setParams({ stream: id })
  const clearStream = () => setParams({})

  const filteredPapers = pastPapers.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* ===== Header ===== */}
      <section className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
          <span className="h-2 w-2 rounded-full bg-tertiary" />
          Practice centre
        </div>
        <h1 className="text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          Practice questions, built to JAMB standard.
        </h1>
        <p className="mt-3 text-pretty text-sm leading-7 text-muted-foreground sm:text-base">
          Choose your JAMB stream, then practice original questions across its four standard
          subjects — Use of English plus three subject-specific papers.
        </p>
      </section>

      {!activeStream ? (
        <StreamPicker onSelect={selectStream} />
      ) : (
        <SubjectPicker stream={activeStream} onBack={clearStream} />
      )}

      {/* ===== Past question collections ===== */}
      <section id="past-papers" className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-heading text-lg font-semibold">Past question collections</h2>
            <p className="mt-1 text-sm text-muted-foreground">Practice with dated, exam-style question sets.</p>
          </div>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground sm:w-64"
              placeholder="Search a past paper"
            />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPapers.map((paper) => (
            <div key={paper.id} className="rounded-xl bg-muted p-4">
              <p className="text-sm font-semibold">{paper.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{paper.meta}</p>
              <Link
                to={`/practice/session?subject=${paper.subject}`}
                className="mt-4 inline-flex items-center text-sm font-semibold text-primary"
              >
                Practice now <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          ))}
          {filteredPapers.length === 0 && (
            <p className="text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">
              No past papers match "{query}".
            </p>
          )}
        </div>
      </section>
    </div>
  )
}

function StreamPicker({ onSelect }) {
  return (
    <section>
      <h2 className="font-heading text-lg font-bold">1. Choose your JAMB stream</h2>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {streams.map((stream) => {
          const Icon = streamIcons[stream.icon]
          return (
            <button
              key={stream.id}
              onClick={() => onSelect(stream.id)}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105">
                <Icon size={24} />
              </span>
              <h3 className="mt-5 font-heading text-lg font-semibold">{stream.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{stream.tagline}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{stream.description}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {stream.subjectIds.map((id) => (
                  <span
                    key={id}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground"
                  >
                    {subjectMeta[id].short}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex items-center text-sm font-semibold text-primary">
                Explore {stream.name}
                <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function SubjectPicker({ stream, onBack }) {
  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            aria-label="Choose a different stream"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-primary">{stream.name} stream</p>
            <h2 className="font-heading text-lg font-bold">2. Choose a subject</h2>
          </div>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary">
          <ListChecks size={14} />
          4 standard JAMB subjects
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stream.subjectIds.map((subjectId) => {
          const meta = subjectMeta[subjectId]
          const count = questionBank[subjectId]?.length ?? 0
          const isCompulsory = subjectId === 'english'
          return (
            <Link
              key={subjectId}
              to={`/practice/session?subject=${subjectId}&stream=${stream.id}`}
              className="group flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
            >
              <div className="flex items-start justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105">
                  <CheckCircle2 size={20} />
                </span>
                {isCompulsory && (
                  <span className="rounded-full bg-tertiary/10 px-2.5 py-1 text-[11px] font-bold text-tertiary">
                    Compulsory
                  </span>
                )}
              </div>
              <h3 className="mt-5 font-heading text-base font-bold">{meta.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{count} practice questions</p>
              <div className="mt-5 flex items-center text-sm font-semibold text-primary">
                Start practicing
                <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-5 rounded-xl bg-secondary p-5 text-sm leading-6 text-secondary-foreground">
        Every JAMB candidate sits <b>Use of English</b> plus three subjects from their chosen
        stream — the {stream.name.toLowerCase()} stream pairs English with{' '}
        {stream.subjectIds
          .filter((id) => id !== 'english')
          .map((id) => subjectMeta[id].name)
          .join(', ')}
        .
      </div>
    </section>
  )
}

import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  FlaskConical,
  Landmark,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  Search,
  Check,
  Lock,
  BookOpen,
  Timer,
  Calculator,
  Leaf,
  Atom,
  ScrollText,
  BookMarked,
  TrendingUp,
  Languages,
  Play,
} from 'lucide-react'
import { streams, subjectMeta, pastPapers } from '../data/mockData'

const streamIcons = { FlaskConical, Landmark, Briefcase }

// One icon per subject so tiles read at a glance — text stays short.
const subjectIcons = {
  english: Languages,
  mathematics: Calculator,
  biology: Leaf,
  physics: Atom,
  chemistry: FlaskConical,
  literature: BookOpen,
  government: Landmark,
  crs: BookMarked,
  history: ScrollText,
  economics: TrendingUp,
  commerce: Briefcase,
}

export default function PracticeSetup() {
  const [params, setParams] = useSearchParams()
  const streamParam = params.get('stream')
  const [query, setQuery] = useState('')

  const activeStream = useMemo(() => streams.find((s) => s.id === streamParam) || null, [streamParam])

  const selectStream = (id) => setParams({ stream: id })
  const clearStream = () => setParams({})

  const filteredPapers = pastPapers.filter((p) => p.title.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8">
      {/* ===== Header ===== */}
      <section className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
          <span className="h-2 w-2 rounded-full bg-tertiary" />
          Practice centre
        </div>
        <h1 className="text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">Build your combination</h1>
      </section>

      {!activeStream ? <StreamPicker onSelect={selectStream} /> : <ComboFlow key={activeStream.id} stream={activeStream} onBack={clearStream} />}

      {/* ===== Past question collections ===== */}
      <section id="past-papers" className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-lg font-semibold">Past questions</h2>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground sm:w-64"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPapers.map((paper) => (
            <div key={paper.id} className="rounded-xl bg-muted p-4">
              <p className="text-sm font-semibold">{paper.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{paper.meta}</p>
              <Link
                to={`/practice/session?mode=study&subject=${paper.subject}`}
                className="mt-4 inline-flex items-center text-sm font-semibold text-primary"
              >
                Practice now <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
          ))}
          {filteredPapers.length === 0 && (
            <p className="text-sm text-muted-foreground sm:col-span-2 lg:col-span-3">No matches for "{query}".</p>
          )}
        </div>
      </section>
    </div>
  )
}

function StreamPicker({ onSelect }) {
  return (
    <section>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {streams.map((stream) => {
          const Icon = streamIcons[stream.icon]
          return (
            <button
              key={stream.id}
              onClick={() => onSelect(stream.id)}
              className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105">
                <Icon size={26} />
              </span>
              <h3 className="font-heading text-lg font-semibold">{stream.name}</h3>
              <span className="flex items-center text-sm font-semibold text-primary">
                Choose
                <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

// Drives the 3 sub-steps for a chosen stream: pick 3 electives (English is
// locked-in as the 4th, compulsory subject) → pick Study or Exam mode →
// (study only) pick which one of the 4 subjects to study right now.
function ComboFlow({ stream, onBack }) {
  const [electives, setElectives] = useState([])
  const [studyMode, setStudyMode] = useState(false)
  const required = stream.electivesRequired

  const toggleElective = (id) =>
    setElectives((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : prev.length < required ? [...prev, id] : prev))

  const comboReady = electives.length === required

  if (!comboReady) {
    return <ElectivePicker stream={stream} electives={electives} required={required} onToggle={toggleElective} onBack={onBack} />
  }
  if (!studyMode) {
    return (
      <ModePicker
        stream={stream}
        electives={electives}
        onBack={() => setElectives([])}
        onSelectStudy={() => setStudyMode(true)}
      />
    )
  }
  return <StudySubjectPicker stream={stream} electives={electives} onBack={() => setStudyMode(false)} />
}

function ElectivePicker({ stream, electives, required, onToggle, onBack }) {
  const remaining = required - electives.length
  return (
    <section>
      <StepHeader stream={stream} step="1. Pick your subjects" onBack={onBack} />

      {/* English — locked, always included */}
      <div className="mt-5 flex items-center gap-3 rounded-2xl border-2 border-tertiary/40 bg-tertiary/10 p-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-tertiary/20 text-tertiary">
          <Languages size={20} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-base font-bold">{subjectMeta.english.name}</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-tertiary px-3 py-1 text-[11px] font-bold text-primary-foreground">
          <Lock size={11} />
          Compulsory
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-muted-foreground">
          Pick {required} more · {remaining > 0 ? `${remaining} left` : 'Done'}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stream.electivePool.map((subjectId) => {
          const meta = subjectMeta[subjectId]
          const Icon = subjectIcons[subjectId] || BookOpen
          const active = electives.includes(subjectId)
          const disabled = !active && electives.length >= required
          return (
            <button
              key={subjectId}
              onClick={() => onToggle(subjectId)}
              disabled={disabled}
              className={`group relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all ${active
                  ? 'border-2 border-primary bg-secondary'
                  : disabled
                    ? 'border-border bg-card opacity-40'
                    : 'border-border bg-card hover:-translate-y-0.5 hover:border-primary hover:shadow-theme'
                }`}
            >
              {active && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check size={12} />
                </span>
              )}
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-primary'}`}>
                <Icon size={20} />
              </span>
              <p className="text-sm font-bold">{meta.short}</p>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function ModePicker({ stream, electives, onBack, onSelectStudy }) {
  const navigate = useNavigate()
  const examUrl = `/practice/session?mode=exam&stream=${stream.id}&subjects=${electives.join(',')}`

  return (
    <section>
      <StepHeader stream={stream} step="2. Choose a mode" onBack={onBack} chips={['english', ...electives]} />

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <button
          onClick={onSelectStudy}
          className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary transition-transform group-hover:scale-105">
            <BookOpen size={26} />
          </span>
          <h3 className="font-heading text-lg font-bold">Study mode</h3>
          <p className="text-xs text-muted-foreground">One subject at a time · answers explained instantly</p>
        </button>

        <button
          onClick={() => navigate(examUrl)}
          className="group flex flex-col items-center gap-3 rounded-2xl border border-border bg-card p-6 text-center transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary transition-transform group-hover:scale-105">
            <Timer size={26} />
          </span>
          <h3 className="font-heading text-lg font-bold">Exam mode</h3>
          <p className="text-xs text-muted-foreground">All 4 subjects · 2 hrs · scored out of 400</p>
        </button>
      </div>
    </section>
  )
}

function StudySubjectPicker({ stream, electives, onBack }) {
  const subjectIds = ['english', ...electives]
  return (
    <section>
      <StepHeader stream={stream} step="3. Pick a subject to study" onBack={onBack} chips={subjectIds} />

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {subjectIds.map((subjectId) => {
          const meta = subjectMeta[subjectId]
          const Icon = subjectIcons[subjectId] || BookOpen
          return (
            <Link
              key={subjectId}
              to={`/practice/session?mode=study&subject=${subjectId}&stream=${stream.id}`}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-5 text-center transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105">
                <Icon size={22} />
              </span>
              <p className="text-sm font-bold">{meta.short}</p>
              <Play size={14} className="text-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          )
        })}
      </div>
    </section>
  )
}

function StepHeader({ stream, step, onBack, chips }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          aria-label="Back"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">{stream.name}</p>
          <h2 className="font-heading text-lg font-bold">{step}</h2>
        </div>
      </div>
      {chips && (
        <div className="flex flex-wrap gap-1.5">
          {chips.map((id) => (
            <span key={id} className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
              {subjectMeta[id].short}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

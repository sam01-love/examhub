import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  FlaskConical,
  Landmark,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Timer,
  Lock,
  Check,
} from 'lucide-react'
import { streams, subjectMeta, streamSubjectIds, subjectQuestionCount } from '../data/mockData'

const streamIcons = { FlaskConical, Landmark, Briefcase }

export default function PracticeSetup() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const mode = params.get('mode')
  const streamId = params.get('stream')
  const [electives, setElectives] = useState([])

  const activeStream = useMemo(() => streams.find((s) => s.id === streamId) || null, [streamId])

  const setMode = (m) => setParams({ mode: m })
  const selectStream = (id) => {
    setElectives([])
    setParams({ mode, stream: id })
  }
  const goBack = () => {
    if (streamId) return setParams({ mode })
    setParams({})
  }

  const toggleElective = (id) => {
    if (!activeStream) return
    setElectives((prev) => {
      if (prev.includes(id)) return prev.filter((e) => e !== id)
      if (prev.length >= activeStream.electiveCount) return prev
      return [...prev, id]
    })
  }

  const startExam = () => {
    const subjects = [...activeStream.compulsory, ...electives]
    navigate(`/practice/session?mode=exam&stream=${activeStream.id}&subjects=${subjects.join(',')}`)
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header className="flex items-center gap-3">
        {(mode) && (
          <button
            onClick={goBack}
            aria-label="Go back"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:border-primary hover:text-primary"
          >
            <ArrowLeft size={18} />
          </button>
        )}
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary">Practice centre</p>
          <h1 className="font-heading text-xl font-bold sm:text-2xl">Practice questions</h1>
        </div>
      </header>

      {!mode && <ModePicker onSelect={setMode} />}
      {mode && !streamId && <StreamPicker onSelect={selectStream} />}
      {mode === 'study' && activeStream && <StudySubjectPicker stream={activeStream} />}
      {mode === 'exam' && activeStream && (
        <ExamCombinationPicker
          stream={activeStream}
          electives={electives}
          onToggle={toggleElective}
          onStart={startExam}
        />
      )}
    </div>
  )
}

function ModePicker({ onSelect }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <button
        onClick={() => onSelect('study')}
        className="group flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary text-primary transition-transform group-hover:scale-105">
          <BookOpen size={28} />
        </span>
        <h2 className="mt-5 font-heading text-lg font-bold">Study Mode</h2>
        <p className="mt-1 text-sm text-muted-foreground">Untimed · one subject · instant explanations</p>
      </button>

      <button
        onClick={() => onSelect('exam')}
        className="group flex flex-col items-center rounded-2xl border border-border bg-card p-8 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
      >
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tertiary/15 text-tertiary transition-transform group-hover:scale-105">
          <Timer size={28} />
        </span>
        <h2 className="mt-5 font-heading text-lg font-bold">Exam Mode</h2>
        <p className="mt-1 text-sm text-muted-foreground">2 hours · 4 subjects · scored out of 400</p>
      </button>
    </section>
  )
}

function StreamPicker({ onSelect }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {streams.map((stream) => {
        const Icon = streamIcons[stream.icon]
        return (
          <button
            key={stream.id}
            onClick={() => onSelect(stream.id)}
            className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105">
              <Icon size={22} />
            </span>
            <h3 className="mt-4 font-heading text-base font-bold">{stream.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{stream.tagline}</p>
          </button>
        )
      })}
    </section>
  )
}

function StudySubjectPicker({ stream }) {
  const subjectIds = streamSubjectIds(stream)
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {subjectIds.map((id) => (
        <Link
          key={id}
          to={`/practice/session?mode=study&subject=${id}`}
          className="group flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105">
            <BookOpen size={20} />
          </span>
          <p className="mt-3 text-sm font-bold">{subjectMeta[id].short}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{subjectQuestionCount(id)} Qs</p>
        </Link>
      ))}
    </section>
  )
}

function ExamCombinationPicker({ stream, electives, onToggle, onStart }) {
  const ready = electives.length === stream.electiveCount
  const totalQuestions =
    stream.compulsory.reduce((sum, id) => sum + subjectQuestionCount(id), 0) +
    electives.reduce((sum, id) => sum + subjectQuestionCount(id), 0)

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-semibold">Compulsory</p>
        <div className="mt-3 flex flex-wrap gap-3">
          {stream.compulsory.map((id) => (
            <span
              key={id}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
            >
              <Lock size={14} />
              {subjectMeta[id].short}
            </span>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold">
          Choose {stream.electiveCount} of {stream.electivePool.length}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stream.electivePool.map((id) => {
            const active = electives.includes(id)
            const disabled = !active && electives.length >= stream.electiveCount
            return (
              <button
                key={id}
                disabled={disabled}
                onClick={() => onToggle(id)}
                className={`flex flex-col items-center rounded-2xl border p-5 text-center transition-all ${
                  active
                    ? 'border-2 border-primary bg-secondary'
                    : 'border-border bg-card hover:border-primary disabled:opacity-40 disabled:hover:border-border'
                }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {active ? <Check size={18} /> : <BookOpen size={18} />}
                </span>
                <p className="mt-3 text-sm font-bold">{subjectMeta[id].short}</p>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 rounded-2xl bg-secondary p-6 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Timer size={20} />
          </span>
          <div>
            <p className="font-heading text-sm font-bold">2 hours · {totalQuestions} questions</p>
            <p className="text-xs text-muted-foreground">Scored out of 400</p>
          </div>
        </div>
        <button
          disabled={!ready}
          onClick={onStart}
          className="flex min-h-11 items-center justify-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-40"
        >
          Start Exam
          <ArrowRight size={18} className="ml-2" />
        </button>
      </div>
    </section>
  )
}

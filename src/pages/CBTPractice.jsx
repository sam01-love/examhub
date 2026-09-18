import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  CircleX,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Trophy,
  Languages,
  Calculator,
  Leaf,
  Atom,
  FlaskConical,
  BookOpen,
  Landmark,
  BookMarked,
  ScrollText,
  TrendingUp,
  Briefcase,
} from 'lucide-react'
import { buildQuestionSet, subjectMeta, streams, MARKS_PER_SUBJECT, EXAM_DURATION_MINUTES } from '../data/mockData'

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

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  return h > 0
    ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function CBTPractice() {
  const [params] = useSearchParams()
  const mode = params.get('mode') === 'exam' ? 'exam' : 'study'

  return mode === 'exam' ? <ExamSession params={params} /> : <StudySession params={params} />
}

// ===========================================================================
// STUDY MODE — one subject, self-paced, explanation shown the moment an
// option is picked.
// ===========================================================================
function StudySession({ params }) {
  const subjectId = params.get('subject') || 'mathematics'
  const streamId = params.get('stream')
  const topic = params.get('topic')
  const backLink = streamId ? `/practice?stream=${streamId}` : '/practice'

  const questions = useMemo(() => buildQuestionSet(subjectId), [subjectId])
  const subjectName = subjectMeta[subjectId]?.name || 'Mathematics'
  const Icon = subjectIcons[subjectId] || BookOpen

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null))
  const [finished, setFinished] = useState(false)

  const question = questions[index]
  const selected = answers[index]
  const revealed = selected != null

  const selectOption = (optionIndex) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = optionIndex
      return next
    })
  }

  const score = answers.reduce((acc, ans, i) => acc + (ans === questions[i].answer ? 1 : 0), 0)

  const handleRestart = () => {
    setAnswers(Array(questions.length).fill(null))
    setIndex(0)
    setFinished(false)
  }

  if (!question) return null

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
            <Icon size={20} />
          </span>
          <h1 className="mt-3 font-heading text-2xl font-bold sm:text-3xl">
            {subjectName}
            {topic ? ` — ${topic}` : ''}
          </h1>
          <div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full bg-secondary">
            <span className="font-heading text-4xl font-bold text-primary">{percentage}%</span>
          </div>
          <p className="mt-4 text-muted-foreground">
            <b className="text-foreground">{score}</b> / <b className="text-foreground">{questions.length}</b> correct
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex min-h-11 items-center rounded-lg border border-border bg-card px-5 font-semibold text-foreground"
            >
              <RotateCcw size={18} className="mr-2" />
              Try again
            </button>
            <Link to={backLink} className="flex min-h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md">
              Back to practice
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          {questions.map((q, i) => {
            const correct = answers[i] === q.answer
            return (
              <div key={q.uid || q.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start gap-3">
                  {correct ? (
                    <CircleCheck size={20} className="mt-0.5 shrink-0 text-tertiary" />
                  ) : (
                    <CircleX size={20} className="mt-0.5 shrink-0 text-destructive" />
                  )}
                  <div>
                    <p className="font-semibold">{q.prompt}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Correct answer: <b className="text-foreground">{q.options[q.answer]}</b>
                      {answers[i] != null && answers[i] !== q.answer && (
                        <>
                          {' '}
                          · Your answer: <b className="text-destructive">{q.options[answers[i]]}</b>
                        </>
                      )}
                      {answers[i] == null && <> · Not answered</>}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">{q.explanation}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <Link to={backLink} className="flex items-center text-sm font-semibold text-muted-foreground transition hover:text-primary">
          <ArrowLeft size={16} className="mr-1" />
          Exit
        </Link>
        <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-bold text-primary">
          <Icon size={16} />
          {subjectMeta[subjectId]?.short}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <p className="font-heading text-lg font-bold">
          Question {index + 1} of {questions.length}
        </p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>

        <div className="mt-6 rounded-xl bg-secondary p-4 sm:p-5">
          <p className="text-sm font-medium text-muted-foreground">{question.instruction}</p>
          <h2 className="mt-3 text-pretty font-heading text-lg font-semibold sm:text-xl">{question.prompt}</h2>
          <div className="mt-5 grid gap-3">
            {question.options.map((option, i) => {
              const active = selected === i
              const isCorrectOption = i === question.answer
              let optionClasses = 'border-border bg-card hover:border-primary'
              if (revealed) {
                if (isCorrectOption) optionClasses = 'border-2 border-tertiary bg-tertiary/10 font-semibold'
                else if (active) optionClasses = 'border-2 border-destructive bg-destructive/10 font-semibold'
                else optionClasses = 'border-border bg-card opacity-60'
              } else if (active) {
                optionClasses = 'border-2 border-primary bg-card font-semibold'
              }
              return (
                <button
                  key={option}
                  onClick={() => selectOption(i)}
                  className={`flex min-h-12 items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium transition-colors ${optionClasses}`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${revealed && isCorrectOption
                        ? 'bg-tertiary text-primary-foreground'
                        : revealed && active
                          ? 'bg-destructive text-destructive-foreground'
                          : active
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {revealed && isCorrectOption ? <CircleCheck size={14} /> : revealed && active ? <CircleX size={14} /> : String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              )
            })}
          </div>

          {revealed && (
            <div className="mt-4 rounded-lg bg-card p-4 text-sm leading-6 text-muted-foreground">
              <b className="text-foreground">Explanation: </b>
              {question.explanation}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="flex min-h-11 items-center rounded-lg border border-border bg-card px-4 font-semibold text-foreground transition disabled:opacity-40 sm:px-5"
          >
            <ArrowLeft size={18} className="mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {index === questions.length - 1 ? (
            <button
              onClick={() => setFinished(true)}
              className="flex min-h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
              className="flex min-h-11 items-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 sm:px-5"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight size={18} className="ml-1.5 sm:ml-2" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {questions.map((q, i) => (
          <button
            key={q.uid || q.id}
            onClick={() => setIndex(i)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-colors ${i === index ? 'bg-primary text-primary-foreground' : answers[i] != null ? 'bg-secondary text-primary' : 'border border-border bg-card text-muted-foreground'
              }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

// ===========================================================================
// EXAM MODE — English + 3 electives, one shared 2 hr countdown, no
// explanations while sitting the exam. After the overall /400 result,
// explanations are available but hidden by default (optional).
// ===========================================================================
function ExamSession({ params }) {
  const streamId = params.get('stream')
  const stream = streams.find((s) => s.id === streamId)
  const electives = (params.get('subjects') || '').split(',').filter(Boolean)
  const subjectIds = useMemo(() => ['english', ...electives.filter((id) => id !== 'english')], [electives])
  const backLink = streamId ? `/practice?stream=${streamId}` : '/practice'

  const sections = useMemo(
    () =>
      subjectIds.map((id) => ({
        id,
        questions: buildQuestionSet(id),
      })),
    [subjectIds]
  )
  const questions = useMemo(() => sections.flatMap((s) => s.questions), [sections])
  const sectionStarts = useMemo(() => {
    const starts = {}
    let cursor = 0
    sections.forEach((s) => {
      starts[s.id] = cursor
      cursor += s.questions.length
    })
    return starts
  }, [sections])

  const totalSeconds = EXAM_DURATION_MINUTES * 60
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null))
  const [timeLeft, setTimeLeft] = useState(totalSeconds)
  const [finished, setFinished] = useState(false)
  const [showExplanations, setShowExplanations] = useState(false)

  useEffect(() => {
    if (finished) return
    if (timeLeft <= 0) {
      setFinished(true)
      return
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, finished])

  if (!questions.length) {
    return (
      <div className="mx-auto max-w-lg space-y-4 text-center">
        <p className="text-sm text-muted-foreground">This combination could not be loaded.</p>
        <Link to={backLink} className="text-sm font-semibold text-primary">
          Back to practice
        </Link>
      </div>
    )
  }

  const question = questions[index]
  const selected = answers[index]

  const selectOption = (optionIndex) => {
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = optionIndex
      return next
    })
  }

  const handleRestart = () => {
    setAnswers(Array(questions.length).fill(null))
    setTimeLeft(totalSeconds)
    setIndex(0)
    setFinished(false)
    setShowExplanations(false)
  }

  // Per-subject score, normalised to 100 marks each — 4 subjects sum to /400.
  const subjectResults = sections.map((s) => {
    const start = sectionStarts[s.id]
    const total = s.questions.length
    const correct = s.questions.reduce((acc, q, i) => acc + (answers[start + i] === q.answer ? 1 : 0), 0)
    const score100 = total ? Math.round((correct / total) * MARKS_PER_SUBJECT) : 0
    return { subjectId: s.id, correct, total, score100 }
  })
  const grandTotal = subjectResults.reduce((acc, r) => acc + r.score100, 0)
  const maxTotal = sections.length * MARKS_PER_SUBJECT

  if (finished) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
          <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
            <Trophy size={20} />
          </span>
          <p className="mt-3 text-sm font-bold uppercase tracking-wider text-primary">Exam complete</p>
          <h1 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">{stream?.name} combination result</h1>

          <div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full bg-secondary">
            <span className="font-heading text-3xl font-bold text-primary">
              {grandTotal}
              <span className="text-base text-muted-foreground">/{maxTotal}</span>
            </span>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {subjectResults.map((r) => {
              const Icon = subjectIcons[r.subjectId] || BookOpen
              return (
                <div key={r.subjectId} className="rounded-xl border border-border bg-card p-3">
                  <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-primary">
                    <Icon size={16} />
                  </span>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">{subjectMeta[r.subjectId]?.short}</p>
                  <p className="font-heading text-lg font-bold">{r.score100}/100</p>
                </div>
              )
            })}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleRestart}
              className="flex min-h-11 items-center rounded-lg border border-border bg-card px-5 font-semibold text-foreground"
            >
              <RotateCcw size={18} className="mr-2" />
              Retake
            </button>
            <Link to={backLink} className="flex min-h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md">
              Back to practice
            </Link>
          </div>
        </div>

        {/* Explanations are optional after an exam — collapsed by default */}
        <button
          onClick={() => setShowExplanations((v) => !v)}
          className="flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 text-left font-semibold"
        >
          Review answers &amp; explanations
          {showExplanations ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {showExplanations && (
          <div className="space-y-3">
            {questions.map((q, i) => {
              const correct = answers[i] === q.answer
              return (
                <div key={q.uid || q.id} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex items-start gap-3">
                    {correct ? (
                      <CircleCheck size={20} className="mt-0.5 shrink-0 text-tertiary" />
                    ) : (
                      <CircleX size={20} className="mt-0.5 shrink-0 text-destructive" />
                    )}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{subjectMeta[q.subjectId]?.short}</p>
                      <p className="mt-1 font-semibold">{q.prompt}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Correct answer: <b className="text-foreground">{q.options[q.answer]}</b>
                        {answers[i] != null && answers[i] !== q.answer && (
                          <>
                            {' '}
                            · Your answer: <b className="text-destructive">{q.options[answers[i]]}</b>
                          </>
                        )}
                        {answers[i] == null && <> · Not answered</>}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <Link to={backLink} className="flex items-center text-sm font-semibold text-muted-foreground transition hover:text-primary">
          <ArrowLeft size={16} className="mr-1" />
          Exit
        </Link>
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold tabular-nums ${timeLeft < 300 ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-primary'
            }`}
        >
          <Clock size={16} />
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Subject section tabs */}
      <div className="mb-4 grid grid-cols-4 gap-2">
        {sections.map((s) => {
          const Icon = subjectIcons[s.id] || BookOpen
          const start = sectionStarts[s.id]
          const answeredInSection = s.questions.reduce((acc, _, i) => acc + (answers[start + i] != null ? 1 : 0), 0)
          const activeSection = index >= start && index < start + s.questions.length
          return (
            <button
              key={s.id}
              onClick={() => setIndex(start)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-colors ${activeSection ? 'border-2 border-primary bg-secondary' : 'border-border bg-card'
                }`}
            >
              <Icon size={16} className={activeSection ? 'text-primary' : 'text-muted-foreground'} />
              <span className="text-[10px] font-bold">{subjectMeta[s.id]?.short}</span>
              <span className="text-[10px] text-muted-foreground">
                {answeredInSection}/{s.questions.length}
              </span>
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{subjectMeta[question.subjectId]?.name}</p>
        <p className="mt-1 font-heading text-lg font-bold">
          Question {index + 1} of {questions.length}
        </p>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
        </div>

        <div className="mt-6 rounded-xl bg-secondary p-4 sm:p-5">
          <p className="text-sm font-medium text-muted-foreground">{question.instruction}</p>
          <h2 className="mt-3 text-pretty font-heading text-lg font-semibold sm:text-xl">{question.prompt}</h2>
          <div className="mt-5 grid gap-3">
            {question.options.map((option, i) => {
              const active = selected === i
              return (
                <button
                  key={option}
                  onClick={() => selectOption(i)}
                  className={`flex min-h-12 items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium transition-colors ${active ? 'border-2 border-primary bg-card font-semibold' : 'border-border bg-card hover:border-primary'
                    }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {String.fromCharCode(65 + i)}
                  </span>
                  {option}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="flex min-h-11 items-center rounded-lg border border-border bg-card px-4 font-semibold text-foreground transition disabled:opacity-40 sm:px-5"
          >
            <ArrowLeft size={18} className="mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {index === questions.length - 1 ? (
            <button
              onClick={() => setFinished(true)}
              className="flex min-h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
            >
              Submit exam
            </button>
          ) : (
            <button
              onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
              className="flex min-h-11 items-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 sm:px-5"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight size={18} className="ml-1.5 sm:ml-2" />
            </button>
          )}
        </div>

        <button
          onClick={() => setFinished(true)}
          className="mt-3 flex min-h-9 w-full items-center justify-center text-xs font-semibold text-muted-foreground transition hover:text-destructive"
        >
          End exam now
        </button>
      </div>
    </div>
  )
}

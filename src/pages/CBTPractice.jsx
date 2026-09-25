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
} from 'lucide-react'
import { pickQuestions, subjectMeta, subjectQuestionCount } from '../data/mockData'

const EXAM_SECONDS = 2 * 60 * 60 // 2 hours, fixed regardless of subject count

function formatClock(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const mm = String(m).padStart(2, '0')
  const ss = String(s).padStart(2, '0')
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`
}

export default function CBTPractice() {
  const [params] = useSearchParams()
  const mode = params.get('mode') || 'study'

  if (mode === 'exam') {
    const subjectIds = (params.get('subjects') || '').split(',').filter(Boolean)
    return <ExamSession subjectIds={subjectIds} />
  }

  const subjectId = params.get('subject') || 'mathematics'
  return <StudySession subjectId={subjectId} />
}

// ---------------------------------------------------------------------------
// Study Mode — one subject, untimed, immediate explanation on answering
// ---------------------------------------------------------------------------

function StudySession({ subjectId }) {
  const questions = useMemo(() => pickQuestions(subjectId, subjectQuestionCount(subjectId)), [subjectId])
  const subjectName = subjectMeta[subjectId]?.name || subjectId

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [finished, setFinished] = useState(false)

  const question = questions[index]
  const selected = answers[index]
  const revealed = selected != null

  const selectOption = (i) => {
    if (revealed) return
    setAnswers((prev) => ({ ...prev, [index]: i }))
  }

  const restart = () => {
    setIndex(0)
    setAnswers({})
    setFinished(false)
  }

  if (finished) {
    const correct = questions.filter((q, i) => answers[i] === q.answer).length
    const pct = Math.round((correct / questions.length) * 100)
    return (
      <div className="mx-auto max-w-xl space-y-6 text-center">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">{subjectName} — Study Mode</p>
          <p className="mt-4 font-heading text-5xl font-extrabold">{pct}%</p>
          <p className="mt-2 text-muted-foreground">
            {correct} of {questions.length} correct
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={restart}
              className="flex min-h-11 items-center justify-center rounded-lg border border-border bg-card px-5 font-semibold transition hover:border-primary"
            >
              <RotateCcw size={18} className="mr-2" />
              Practice again
            </button>
            <Link
              to="/practice"
              className="flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
            >
              Back to practice
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!question) return null

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <Link to="/practice" className="flex items-center text-sm font-semibold text-muted-foreground transition hover:text-primary">
          <ArrowLeft size={16} className="mr-1" />
          Exit
        </Link>
        <span className="rounded-lg bg-secondary px-3 py-2 text-sm font-bold text-primary">Study Mode</span>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{subjectName}</p>
          <p className="font-heading text-sm font-bold">
            {index + 1} / {questions.length}
          </p>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>

        <div className="mt-6 rounded-xl bg-secondary p-4 sm:p-5">
          <p className="text-sm font-medium text-muted-foreground">{question.instruction}</p>
          <h2 className="mt-3 text-pretty font-heading text-lg font-semibold sm:text-xl">{question.prompt}</h2>

          <div className="mt-5 grid gap-3">
            {question.options.map((option, i) => {
              const isSelected = selected === i
              const isCorrect = i === question.answer
              let style = 'border-border bg-card hover:border-primary'
              if (revealed && isCorrect) style = 'border-2 border-tertiary bg-tertiary/10 font-semibold'
              else if (revealed && isSelected && !isCorrect) style = 'border-2 border-destructive bg-destructive/10 font-semibold'
              else if (isSelected) style = 'border-2 border-primary bg-card font-semibold'

              return (
                <button
                  key={option}
                  onClick={() => selectOption(i)}
                  className={`flex min-h-12 items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium transition-colors ${style}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {revealed && isCorrect && <CircleCheck size={18} className="shrink-0 text-tertiary" />}
                  {revealed && isSelected && !isCorrect && <CircleX size={18} className="shrink-0 text-destructive" />}
                </button>
              )
            })}
          </div>

          {revealed && (
            <div className="mt-4 rounded-lg bg-card p-4 text-sm leading-6 text-muted-foreground">
              <span className="font-semibold text-foreground">Explanation: </span>
              {question.explanation}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index === 0}
            className="flex min-h-11 items-center rounded-lg border border-border bg-card px-4 font-semibold transition disabled:opacity-40 sm:px-5"
          >
            <ArrowLeft size={18} className="mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {index === questions.length - 1 ? (
            <button
              onClick={() => setFinished(true)}
              disabled={!revealed}
              className="flex min-h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-40"
            >
              Finish
            </button>
          ) : (
            <button
              onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
              disabled={!revealed}
              className="flex min-h-11 items-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-40 sm:px-5"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight size={18} className="ml-1.5 sm:ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Exam Mode — full 4-subject combo, 2-hour timer, /400 grading, optional review
// ---------------------------------------------------------------------------

function ExamSession({ subjectIds }) {
  const subjects = useMemo(
    () =>
      subjectIds.map((id) => ({
        id,
        name: subjectMeta[id]?.name || id,
        questions: pickQuestions(id, subjectQuestionCount(id)),
      })),
    [subjectIds]
  )

  const [activeSubject, setActiveSubject] = useState(0)
  const [indexBySubject, setIndexBySubject] = useState(() => subjects.map(() => 0))
  const [answers, setAnswers] = useState(() => subjects.map((s) => Array(s.questions.length).fill(null)))
  const [timeLeft, setTimeLeft] = useState(EXAM_SECONDS)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (finished) return
    if (timeLeft <= 0) {
      setFinished(true)
      return
    }
    const t = setInterval(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearInterval(t)
  }, [timeLeft, finished])

  if (!subjects.length) return null

  const subject = subjects[activeSubject]
  const qIndex = indexBySubject[activeSubject]
  const question = subject.questions[qIndex]
  const selected = answers[activeSubject][qIndex]

  const selectOption = (i) => {
    setAnswers((prev) => {
      const next = prev.map((arr) => [...arr])
      next[activeSubject][qIndex] = i
      return next
    })
  }

  const goToQuestion = (subjIdx, qIdx) => {
    setActiveSubject(subjIdx)
    setIndexBySubject((prev) => {
      const next = [...prev]
      next[subjIdx] = qIdx
      return next
    })
  }

  const totalAnswered = answers.reduce((sum, arr) => sum + arr.filter((a) => a != null).length, 0)
  const totalQuestions = subjects.reduce((sum, s) => sum + s.questions.length, 0)

  if (finished) {
    return <ExamResult subjects={subjects} answers={answers} timeLeft={timeLeft} />
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 sm:mb-5">
        <Link to="/practice" className="flex items-center text-sm font-semibold text-muted-foreground transition hover:text-primary">
          <ArrowLeft size={16} className="mr-1" />
          Exit exam
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-muted-foreground">
            {totalAnswered}/{totalQuestions} answered
          </span>
          <span
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold tabular-nums ${
              timeLeft < 300 ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-primary'
            }`}
          >
            <Clock size={16} />
            {formatClock(timeLeft)}
          </span>
        </div>
      </div>

      {/* Subject tabs */}
      <div className="mb-4 flex gap-2 overflow-x-auto">
        {subjects.map((s, i) => {
          const answeredCount = answers[i].filter((a) => a != null).length
          return (
            <button
              key={s.id}
              onClick={() => setActiveSubject(i)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
                i === activeSubject ? 'bg-primary text-primary-foreground' : 'border border-border bg-card text-muted-foreground'
              }`}
            >
              {subjectMeta[s.id]?.short || s.name}
              <span className="text-xs opacity-80">
                {answeredCount}/{s.questions.length}
              </span>
            </button>
          )
        })}
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{subject.name}</p>
          <p className="font-heading text-sm font-bold">
            {qIndex + 1} / {subject.questions.length}
          </p>
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
                  className={`flex min-h-12 items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium transition-colors ${
                    active ? 'border-2 border-primary bg-card font-semibold' : 'border-border bg-card hover:border-primary'
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
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
            onClick={() => goToQuestion(activeSubject, Math.max(0, qIndex - 1))}
            disabled={qIndex === 0}
            className="flex min-h-11 items-center rounded-lg border border-border bg-card px-4 font-semibold transition disabled:opacity-40 sm:px-5"
          >
            <ArrowLeft size={18} className="mr-1.5 sm:mr-2" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {qIndex === subject.questions.length - 1 ? (
            <button
              onClick={() => setFinished(true)}
              className="flex min-h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
            >
              Submit Exam
            </button>
          ) : (
            <button
              onClick={() => goToQuestion(activeSubject, qIndex + 1)}
              className="flex min-h-11 items-center rounded-lg bg-primary px-4 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 sm:px-5"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight size={18} className="ml-1.5 sm:ml-2" />
            </button>
          )}
        </div>
      </div>

      {/* Question navigator for the active subject */}
      <div className="mt-5 flex flex-wrap gap-2">
        {subject.questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => goToQuestion(activeSubject, i)}
            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
              i === qIndex
                ? 'bg-primary text-primary-foreground'
                : answers[activeSubject][i] != null
                ? 'bg-secondary text-primary'
                : 'border border-border bg-card text-muted-foreground'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}

function ExamResult({ subjects, answers }) {
  const [expanded, setExpanded] = useState({})
  const [revealAll, setRevealAll] = useState(false)

  const breakdown = subjects.map((s, i) => {
    const correct = s.questions.filter((q, qi) => answers[i][qi] === q.answer).length
    const score100 = Math.round((correct / s.questions.length) * 100)
    return { ...s, correct, score100 }
  })
  const total400 = breakdown.reduce((sum, b) => sum + b.score100, 0)

  const toggle = (key) => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
        <p className="text-xs font-bold uppercase tracking-wider text-primary">Exam complete</p>
        <p className="mt-4 font-heading text-5xl font-extrabold">{total400}</p>
        <p className="mt-2 text-muted-foreground">out of 400</p>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {breakdown.map((b) => (
            <div key={b.id} className="rounded-xl bg-secondary p-3">
              <p className="text-xs font-semibold text-muted-foreground">{subjectMeta[b.id]?.short}</p>
              <p className="mt-1 font-heading text-lg font-bold text-primary">{b.score100}</p>
              <p className="text-[11px] text-muted-foreground">
                {b.correct}/{b.questions.length} correct
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/practice"
            className="flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
          >
            Back to practice
          </Link>
          <button
            onClick={() => setRevealAll((v) => !v)}
            className="flex min-h-11 items-center justify-center rounded-lg border border-border bg-card px-5 font-semibold transition hover:border-primary"
          >
            {revealAll ? 'Hide all explanations' : 'Show all explanations'}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {breakdown.map((b, si) => (
          <div key={b.id} className="rounded-2xl border border-border bg-card p-5">
            <p className="font-heading text-base font-bold">{b.name}</p>
            <div className="mt-3 space-y-2">
              {b.questions.map((q, qi) => {
                const key = `${si}-${qi}`
                const userAnswer = answers[si][qi]
                const isCorrect = userAnswer === q.answer
                const isOpen = revealAll || expanded[key]
                return (
                  <div key={q.id} className="rounded-xl bg-muted p-3">
                    <button
                      onClick={() => toggle(key)}
                      className="flex w-full items-center justify-between gap-3 text-left"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        {isCorrect ? (
                          <CircleCheck size={16} className="shrink-0 text-tertiary" />
                        ) : (
                          <CircleX size={16} className="shrink-0 text-destructive" />
                        )}
                        <p className="truncate text-sm font-medium">{q.prompt}</p>
                      </div>
                      {isOpen ? <ChevronUp size={16} className="shrink-0" /> : <ChevronDown size={16} className="shrink-0" />}
                    </button>
                    {isOpen && (
                      <div className="mt-3 space-y-1 text-sm leading-6 text-muted-foreground">
                        <p>
                          <span className="font-semibold text-foreground">Correct answer: </span>
                          {q.options[q.answer]}
                        </p>
                        {userAnswer != null && !isCorrect && (
                          <p>
                            <span className="font-semibold text-foreground">Your answer: </span>
                            {q.options[userAnswer]}
                          </p>
                        )}
                        <p>
                          <span className="font-semibold text-foreground">Explanation: </span>
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

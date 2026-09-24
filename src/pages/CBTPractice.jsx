import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Clock, ArrowLeft, ArrowRight, Flag, CircleCheck, CircleX, RotateCcw } from 'lucide-react'
import { questionBank, subjectMeta } from '../data/mockData'

const SECONDS_PER_QUESTION = 60

function formatTime(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function CBTPractice() {
  const [params] = useSearchParams()
  const subjectId = params.get('subject') || 'mathematics'
  const streamId = params.get('stream')
  const topic = params.get('topic')
  const backLink = streamId ? `/practice?stream=${streamId}` : '/practice'

  const questions = useMemo(() => questionBank[subjectId] || questionBank.mathematics, [subjectId])
  const subjectName = subjectMeta[subjectId]?.name || 'Mathematics'

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null))
  const [timeLeft, setTimeLeft] = useState(questions.length * SECONDS_PER_QUESTION)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (finished) return
    if (timeLeft <= 0) {
      setFinished(true)
      return
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, finished])

  const question = questions[index]
  const selected = answers[index]

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
    setTimeLeft(questions.length * SECONDS_PER_QUESTION)
    setIndex(0)
    setFinished(false)
  }

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100)
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-8">
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Session complete</p>
          <h1 className="mt-2 font-heading text-3xl font-bold">
            {subjectName}
            {topic ? ` — ${topic}` : ''}
          </h1>
          <div className="mx-auto mt-6 flex h-32 w-32 items-center justify-center rounded-full bg-secondary">
            <span className="font-heading text-4xl font-bold text-primary">{percentage}%</span>
          </div>
          <p className="mt-4 text-muted-foreground">
            You got <b className="text-foreground">{score}</b> out of <b className="text-foreground">{questions.length}</b> questions correct.
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
              <div key={q.id} className="rounded-xl border border-border bg-card p-5">
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
          Exit session
        </Link>
        <div
          className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold tabular-nums ${
            timeLeft < 30 ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-primary'
          }`}
        >
          <Clock size={16} />
          {formatTime(timeLeft)}
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {subjectName}
              {topic ? ` — ${topic}` : ''}
            </p>
            <p className="mt-1 font-heading text-lg font-bold">
              Question {index + 1} of {questions.length}
            </p>
          </div>
          <button className="flex items-center gap-1 text-sm font-semibold text-muted-foreground transition hover:text-destructive">
            <Flag size={16} />
            Flag
          </button>
        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-muted">
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
            key={q.id}
            onClick={() => setIndex(i)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
              i === index
                ? 'bg-primary text-primary-foreground'
                : answers[i] != null
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

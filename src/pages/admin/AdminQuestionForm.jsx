import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { Plus, X, ArrowLeft, TriangleAlert, Save } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { createQuestion, updateQuestion, fetchQuestionById } from '../../lib/questionsApi'
import { examTypes, subjects } from '../../data/mockData'

const difficulties = ['Beginner', 'Intermediate', 'Exam standard']
const emptyOptions = ['', '', '', '']

export default function AdminQuestionForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { user } = useAuth()

  const [examType, setExamType] = useState(examTypes[0]?.id || '')
  const [subject, setSubject] = useState(subjects[0]?.id || '')
  const [topic, setTopic] = useState('')
  const [difficulty, setDifficulty] = useState('Intermediate')
  const [prompt, setPrompt] = useState('')
  const [options, setOptions] = useState(emptyOptions)
  const [answer, setAnswer] = useState(0)
  const [explanation, setExplanation] = useState('')

  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isEdit) return
    let active = true
    fetchQuestionById(id)
      .then((q) => {
        if (!active) return
        setExamType(q.exam_type)
        setSubject(q.subject)
        setTopic(q.topic || '')
        setDifficulty(q.difficulty || 'Intermediate')
        setPrompt(q.prompt)
        setOptions(q.options?.length ? q.options : emptyOptions)
        setAnswer(q.answer ?? 0)
        setExplanation(q.explanation || '')
      })
      .catch((err) => active && setError(err.message || 'Could not load this question.'))
      .finally(() => active && setLoading(false))
    return () => {
      active = false
    }
  }, [id, isEdit])

  const updateOption = (index, value) => {
    setOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)))
  }

  const addOption = () => {
    if (options.length >= 6) return
    setOptions((prev) => [...prev, ''])
  }

  const removeOption = (index) => {
    if (options.length <= 2) return
    setOptions((prev) => prev.filter((_, i) => i !== index))
    setAnswer((prev) => (prev === index ? 0 : prev > index ? prev - 1 : prev))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const cleanedOptions = options.map((o) => o.trim())
    if (!prompt.trim()) return setError('Enter the question text.')
    if (cleanedOptions.some((o) => !o)) return setError('Fill in every answer option, or remove the empty one.')
    if (cleanedOptions.length < 2) return setError('Add at least two answer options.')
    if (answer < 0 || answer >= cleanedOptions.length) return setError('Select the correct answer.')

    setSaving(true)
    try {
      const payload = {
        examType,
        subject,
        topic: topic.trim(),
        difficulty,
        prompt: prompt.trim(),
        options: cleanedOptions,
        answer,
        explanation: explanation.trim(),
      }
      if (isEdit) {
        await updateQuestion(id, payload)
      } else {
        await createQuestion(payload, user?.id)
      }
      navigate('/admin/questions')
    } catch (err) {
      setError(err.message || 'Could not save this question.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading question…</p>
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/admin/questions" className="flex items-center text-sm font-semibold text-muted-foreground hover:text-primary">
        <ArrowLeft size={16} className="mr-1" />
        Back to all questions
      </Link>

      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">{isEdit ? 'Edit question' : 'Add a question'}</h1>
        <p className="mt-2 text-muted-foreground">
          {isEdit ? 'Update this question and its answer options.' : 'Create a new practice question with its answer options.'}
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          <TriangleAlert size={16} className="shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 rounded-xl border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="examType">
              Exam type
            </label>
            <select
              id="examType"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {examTypes.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="subject">
              Subject
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold" htmlFor="difficulty">
              Difficulty
            </label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="min-h-11 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="topic">
            Topic <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Algebra, Trigonometry"
            className="min-h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="prompt">
            Question
          </label>
          <textarea
            id="prompt"
            required
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type the question text…"
            className="w-full rounded-lg border border-input bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold">Answer options</label>
            <button
              type="button"
              onClick={addOption}
              disabled={options.length >= 6}
              className="flex items-center gap-1 text-sm font-semibold text-primary disabled:opacity-40"
            >
              <Plus size={16} />
              Add option
            </button>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">Select the radio button next to the correct answer.</p>
          <div className="space-y-3">
            {options.map((option, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="answer"
                  checked={answer === i}
                  onChange={() => setAnswer(i)}
                  aria-label={`Mark option ${String.fromCharCode(65 + i)} as correct`}
                  className="h-5 w-5 shrink-0 accent-primary"
                />
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                  {String.fromCharCode(65 + i)}
                </span>
                <input
                  value={option}
                  onChange={(e) => updateOption(i, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + i)}`}
                  className="min-h-11 w-full rounded-lg border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => removeOption(i)}
                  disabled={options.length <= 2}
                  aria-label="Remove option"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-30"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold" htmlFor="explanation">
            Explanation <span className="font-normal text-muted-foreground">(shown after a student answers)</span>
          </label>
          <textarea
            id="explanation"
            rows={3}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Why is this the correct answer?"
            className="w-full rounded-lg border border-input bg-background p-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="flex items-center gap-3 border-t border-border pt-6">
          <button
            type="submit"
            disabled={saving}
            className="flex min-h-11 items-center rounded-lg bg-primary px-6 font-semibold text-primary-foreground shadow-md disabled:opacity-60"
          >
            <Save size={18} className="mr-2" />
            {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add question'}
          </button>
          <Link to="/admin/questions" className="flex min-h-11 items-center rounded-lg border border-border px-6 font-semibold text-foreground">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
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
  GraduationCap,
} from 'lucide-react'
import {
  examTypes,
  fieldsOfStudyByExamType,
  oauCoursesFor,
  subjectMeta,
  streamSubjectIds,
  subjectQuestionCount,
} from '../data/mockData'
import useEntitlements from '../hooks/useEntitlements'
import UnlockCard from '../components/UnlockCard'
import { StudyOptions, ExamOptions } from '../components/SessionOptions'
import { FREE_TRIAL_QUESTIONS } from '../lib/paymentsApi'

// What a student will actually get: free users are capped at the trial size.
const sittingCount = (id, examType, paid) => {
  const full = subjectQuestionCount(id, examType)
  return paid ? full : Math.min(FREE_TRIAL_QUESTIONS, full)
}

const streamIcons = { FlaskConical, Landmark, Briefcase }

export default function PracticeSetup() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const examType = params.get('examType')
  const mode = params.get('mode')
  const streamId = params.get('stream')
  const subject = params.get('subject') // chosen subject / OAU course, awaiting options
  const optionsStep = params.get('options') === '1' // exam combination chosen, awaiting options
  const [electives, setElectives] = useState([])
  const { isPaid } = useEntitlements()

  const fields = examType ? fieldsOfStudyByExamType[examType] || [] : []
  const activeStream = useMemo(() => fields.find((s) => s.id === streamId) || null, [fields, streamId])
  const isOau = examType === 'oau'

  const selectExamType = (id) => setParams({ examType: id })
  const selectStream = (id) => {
    setElectives([])
    setParams({ examType, stream: id })
  }
  const setMode = (m) => setParams({ examType, stream: streamId, mode: m })

  const goBack = () => {
    if (subject) return setParams(mode ? { examType, stream: streamId, mode } : { examType, stream: streamId })
    if (optionsStep) return setParams({ examType, stream: streamId, mode })
    if (mode) return setParams({ examType, stream: streamId })
    if (streamId) return setParams({ examType })
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

  const selectSubject = (id) =>
    setParams(mode ? { examType, stream: streamId, mode, subject: id } : { examType, stream: streamId, subject: id })

  // Combination chosen -> go to the options step (year) before the exam starts.
  const goToExamOptions = () => setParams({ examType, stream: streamId, mode: 'exam', options: '1' })

  const startStudy = ({ year, topics }) => {
    const qs = new URLSearchParams({ examType, mode: 'study', subject })
    if (year) qs.set('year', year)
    topics.forEach((t) => qs.append('topic', t))
    navigate(`/practice/session?${qs}`)
  }

  const examSubjects = activeStream ? [...activeStream.compulsory, ...electives] : []
  const examOptionsReady = optionsStep && activeStream && electives.length === activeStream.electiveCount

  const startExam = ({ year }) => {
    const qs = new URLSearchParams({
      examType,
      mode: 'exam',
      stream: activeStream.id,
      subjects: examSubjects.join(','),
    })
    if (year) qs.set('year', year)
    navigate(`/practice/session?${qs}`)
  }

  const showBack = Boolean(examType)

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header className="flex items-center gap-3">
        {showBack && (
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

      {examType && !isPaid(examType) && <UnlockCard examType={examType} compact />}

      {!examType && <ExamTypePicker onSelect={selectExamType} />}

      {examType && !streamId && <FieldOfStudyPicker fields={fields} onSelect={selectStream} />}

      {/* OAU Courses: no Mode step — straight to the course list */}
      {isOau && activeStream && !subject && (
        <OauCoursePicker fieldOfStudyId={activeStream.id} onSelect={selectSubject} />
      )}
      {isOau && activeStream && subject && (
        <StudyOptions key={subject} examType={examType} subjectId={subject} onStart={startStudy} />
      )}

      {/* JAMB / Post UTME: same Mode -> Subject flow */}
      {!isOau && activeStream && !mode && <ModePicker onSelect={setMode} />}
      {!isOau && activeStream && mode === 'study' && !subject && (
        <StudySubjectPicker
          stream={activeStream}
          examType={examType}
          paid={isPaid(examType)}
          onSelect={selectSubject}
        />
      )}
      {!isOau && activeStream && mode === 'study' && subject && (
        <StudyOptions key={subject} examType={examType} subjectId={subject} onStart={startStudy} />
      )}
      {!isOau && activeStream && mode === 'exam' && !examOptionsReady && (
        <ExamCombinationPicker
          examType={examType}
          paid={isPaid(examType)}
          stream={activeStream}
          electives={electives}
          onToggle={toggleElective}
          onStart={goToExamOptions}
        />
      )}
      {!isOau && activeStream && mode === 'exam' && examOptionsReady && (
        <ExamOptions subjectIds={examSubjects} onStart={startExam} />
      )}
    </div>
  )
}

function ExamTypePicker({ onSelect }) {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {examTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => onSelect(type.id)}
          className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105">
            <GraduationCap size={22} />
          </span>
          <h3 className="mt-4 font-heading text-base font-bold">{type.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{type.blurb}</p>
        </button>
      ))}
    </section>
  )
}

function FieldOfStudyPicker({ fields, onSelect }) {
  return (
    <section className={`grid grid-cols-1 gap-4 ${fields.length > 1 ? 'sm:grid-cols-3' : 'sm:max-w-xs'}`}>
      {fields.map((field) => {
        const Icon = streamIcons[field.icon] || FlaskConical
        return (
          <button
            key={field.id}
            onClick={() => onSelect(field.id)}
            className="group flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105">
              <Icon size={22} />
            </span>
            <h3 className="mt-4 font-heading text-base font-bold">{field.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{field.tagline}</p>
          </button>
        )
      })}
    </section>
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

function StudySubjectPicker({ stream, examType, paid, onSelect }) {
  const subjectIds = streamSubjectIds(stream)
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {subjectIds.map((id) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className="group flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105">
            <BookOpen size={20} />
          </span>
          <p className="mt-3 text-sm font-bold">{subjectMeta[id].short}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{sittingCount(id, examType, paid)} Qs</p>
        </button>
      ))}
    </section>
  )
}

function OauCoursePicker({ fieldOfStudyId, onSelect }) {
  const courses = oauCoursesFor(fieldOfStudyId)
  return (
    <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {courses.map((course) => (
        <button
          key={course.id}
          onClick={() => onSelect(course.id)}
          className="group flex flex-col items-center rounded-2xl border border-border bg-card p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-theme"
        >
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-105">
            <BookOpen size={20} />
          </span>
          <p className="mt-3 text-sm font-bold">{course.code}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{course.title}</p>
        </button>
      ))}
      {courses.length === 0 && (
        <p className="col-span-full text-sm text-muted-foreground">No courses added for this field yet.</p>
      )}
    </section>
  )
}

function ExamCombinationPicker({ examType, paid, stream, electives, onToggle, onStart }) {
  const ready = electives.length === stream.electiveCount
  const totalQuestions =
    stream.compulsory.reduce((sum, id) => sum + sittingCount(id, examType, paid), 0) +
    electives.reduce((sum, id) => sum + sittingCount(id, examType, paid), 0)

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
                className={`flex flex-col items-center rounded-2xl border p-5 text-center transition-all ${active
                    ? 'border-2 border-primary bg-secondary'
                    : 'border-border bg-card hover:border-primary disabled:opacity-40 disabled:hover:border-border'
                  }`}
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
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
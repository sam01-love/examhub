import { Link } from 'react-router-dom'
import { Timer, ArrowRight, FlaskConical, Landmark, Briefcase } from 'lucide-react'
import { mockExams, streams, subjectMeta, subjectQuestionCount } from '../data/mockData'

const streamIcons = { FlaskConical, Landmark, Briefcase }

export default function MockExams() {
  return (
    <div className="space-y-6">
      <h1 className="font-heading text-xl font-bold sm:text-2xl">Mock exams</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {mockExams.map((exam) => {
          const stream = streams.find((s) => s.id === exam.streamId)
          const Icon = streamIcons[stream.icon]
          const totalQuestions = exam.subjects.reduce((sum, id) => sum + subjectQuestionCount(id), 0)

          return (
            <div key={exam.id} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Icon size={22} />
              </span>
              <h2 className="mt-4 font-heading text-lg font-bold">{exam.title}</h2>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {exam.subjects.map((id) => (
                  <span key={id} className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                    {subjectMeta[id].short}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Timer size={16} />
                2 hours · {totalQuestions} questions
              </div>

              <Link
                to={`/practice/session?mode=exam&stream=${exam.streamId}&subjects=${exam.subjects.join(',')}`}
                className="mt-6 flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
              >
                Start mock exam
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}

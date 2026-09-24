import { Link } from 'react-router-dom'
import { Clock, ClipboardList, ArrowRight, Timer } from 'lucide-react'
import { mockExams, streams } from '../data/mockData'

export default function MockExams() {
  return (
    <div className="space-y-8">
      <div className="max-w-2xl">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-primary">
          <span className="h-2 w-2 rounded-full bg-tertiary" />
          Timed practice
        </div>
        <h1 className="text-balance font-heading text-2xl font-bold tracking-tight sm:text-3xl">Mock exams</h1>
        <p className="mt-3 text-pretty text-sm leading-7 text-muted-foreground sm:text-base">
          Sit a full, timed mock across your JAMB stream's four subjects and get an instant score
          breakdown the moment you submit.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {mockExams.map((exam) => {
          const stream = streams.find((s) => s.id === exam.streamId)
          const sessionUrl = exam.subjectId
            ? `/practice/session?subject=${exam.subjectId}&stream=${exam.streamId}`
            : `/practice/session?subject=${stream?.subjectIds?.[0] || 'mathematics'}&stream=${exam.streamId}`

          return (
            <div key={exam.id} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <ClipboardList size={22} />
              </span>
              <span className="mt-5 w-fit rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                {stream?.name} stream
              </span>
              <h2 className="mt-3 font-heading text-lg font-semibold">{exam.title}</h2>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Timer size={16} />
                  {exam.duration} mins
                </span>
                <span className="flex items-center gap-1.5">
                  <ClipboardList size={16} />
                  {exam.questions} questions
                </span>
              </div>
              <span className="mt-2 text-xs font-semibold text-primary">{exam.difficulty}</span>
              <Link
                to={sessionUrl}
                className="mt-6 flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
              >
                Start mock exam
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          )
        })}
      </div>

      <div className="flex items-start gap-4 rounded-2xl bg-secondary p-6">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Clock size={20} />
        </span>
        <div>
          <h2 className="font-heading text-lg font-semibold">Treat every mock like exam day</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Sit somewhere quiet, keep the timer running and avoid pausing — mock exams are most
            useful when they mirror real conditions.
          </p>
        </div>
      </div>
    </div>
  )
}

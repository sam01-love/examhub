import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FlaskConical, Landmark, Briefcase, Search, ChevronDown, Zap, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import { streams, subjectMeta, targetScores } from '../data/mockData'

const streamIcons = { FlaskConical, Landmark, Briefcase }

export default function Onboarding() {
  const { saveStudyPlan } = useAuth()
  const navigate = useNavigate()

  const [streamId, setStreamId] = useState('science')
  const [targetScore, setTargetScore] = useState('300+')
  const [institution, setInstitution] = useState('')
  const [saving, setSaving] = useState(false)

  const activeStream = streams.find((s) => s.id === streamId) ?? streams[0]

  const handleFinish = async () => {
    setSaving(true)
    await saveStudyPlan({
      examType: 'jamb',
      stream: streamId,
      subjects: activeStream.subjectIds,
      targetScore,
      institution,
    })
    setSaving(false)
    navigate('/dashboard')
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <span className="text-sm font-semibold text-muted-foreground">Step 2 of 2</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10">
            <div className="mb-4 flex gap-2">
              <div className="h-2 flex-1 rounded-full bg-primary" />
              <div className="h-2 flex-1 rounded-full bg-primary" />
              <div className="h-2 flex-1 rounded-full bg-secondary" />
            </div>
            <p className="text-sm font-bold uppercase tracking-wider text-primary">Build your study plan</p>
            <h1 className="mt-3 text-balance font-heading text-2xl font-bold sm:text-3xl">
              Tell us what you are aiming for.
            </h1>
            <p className="mt-2 text-muted-foreground">We will tailor your practice recommendations from day one.</p>
          </div>

          <div className="space-y-8">
            <section>
              <div className="flex items-baseline justify-between">
                <h2 className="font-heading text-lg font-semibold">Choose your JAMB stream</h2>
                <span className="text-xs font-medium text-muted-foreground">Choose one</span>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {streams.map((stream) => {
                  const Icon = streamIcons[stream.icon]
                  const active = streamId === stream.id
                  return (
                    <button
                      key={stream.id}
                      type="button"
                      onClick={() => setStreamId(stream.id)}
                      className={`rounded-xl p-5 text-left transition-colors ${
                        active ? 'border-2 border-primary bg-secondary' : 'border border-border bg-card'
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon size={18} />
                      </span>
                      <span className="mt-4 block font-heading font-semibold">{stream.name}</span>
                      <span className="mt-1 block text-sm text-muted-foreground">{stream.tagline}</span>
                    </button>
                  )
                })}
              </div>
            </section>

            <section>
              <h2 className="font-heading text-lg font-semibold">Your subject combination</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Every JAMB candidate sits these four subjects for the {activeStream.name.toLowerCase()} stream.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {activeStream.subjectIds.map((id) => (
                  <span
                    key={id}
                    className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                  >
                    <Check size={14} />
                    {subjectMeta[id].name}
                  </span>
                ))}
              </div>
            </section>

            <section className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-heading text-lg font-semibold" htmlFor="target-score">
                  What is your target score?
                </label>
                <div className="relative">
                  <select
                    id="target-score"
                    value={targetScore}
                    onChange={(e) => setTargetScore(e.target.value)}
                    className="min-h-11 w-full appearance-none rounded-lg border-2 border-primary bg-card px-4 font-heading text-lg font-bold text-primary outline-none"
                  >
                    {targetScores.map((score) => (
                      <option key={score} value={score}>
                        {score}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={18} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              <div>
                <label className="mb-2 block font-heading text-lg font-semibold" htmlFor="institution">
                  Institution you are targeting
                </label>
                <div className="flex min-h-11 items-center gap-3 rounded-lg border border-input bg-card px-4">
                  <Search size={18} className="text-muted-foreground" />
                  <input
                    id="institution"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="Search universities or polytechnics"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </div>
            </section>

            <section className="rounded-xl bg-secondary p-6">
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Zap size={20} />
                </span>
                <div>
                  <h2 className="font-heading text-lg font-semibold">You are ready to start preparing!</h2>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    We will begin with JAMB {subjectMeta[activeStream.subjectIds[0]].name} and suggest
                    focused topics across your {activeStream.name.toLowerCase()} subjects based on your target score.
                  </p>
                </div>
              </div>
            </section>

            <button
              onClick={handleFinish}
              disabled={saving}
              className="flex min-h-11 w-full items-center justify-center rounded-lg bg-primary py-3 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-60"
            >
              {saving ? 'Saving your plan…' : 'Go to Dashboard'}
              {!saving && <ArrowRight size={18} className="ml-2" />}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

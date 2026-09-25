import { Link } from 'react-router-dom'
import {
  Check,
  GraduationCap,
  FlaskConical,
  Landmark,
  Briefcase,
  Layers,
  Clock,
  Zap,
  MessageCircle,
  ChartBar,
  Search,
  Play,
  Award,
  Mail,
  Phone,
} from 'lucide-react'
import Logo from '../components/Logo'
import { streams } from '../data/mockData'

const streamIcons = { FlaskConical, Landmark, Briefcase }

const navLinks = [
  { href: '#hero', label: 'Home' },
  { href: '#how', label: 'How it works' },
  { href: '#exams', label: 'Exams' },
  { href: '#features', label: 'Features' },
]

const studentAvatars = [
  { initials: 'AB', bg: 'bg-primary' },
  { initials: 'TJ', bg: 'bg-tertiary' },
  { initials: 'MO', bg: 'bg-orange-500' },
  { initials: 'CN', bg: 'bg-secondary-foreground' },
]

const steps = [
  {
    step: 1,
    title: 'Choose your stream',
    body: 'Pick Science, Arts or Commercial and get your 4 standard JAMB subjects instantly.',
    highlighted: true,
  },
  {
    step: 2,
    title: 'Practice questions',
    body: 'Build confidence with exam-standard questions by topic and year.',
  },
  {
    step: 3,
    title: 'Track your progress',
    body: 'Turn every result into a practical next step for improvement.',
  },
]

const features = [
  { icon: Layers, label: 'Thousands of questions' },
  { icon: Clock, label: 'Timed mock exams' },
  { icon: Zap, label: 'Instant results' },
  { icon: MessageCircle, label: 'Answer explanations' },
  { icon: ChartBar, label: 'Performance tracking' },
]

export default function Landing() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-background font-sans">
      {/* Slim utility bar - KEPT ORIGINAL */}
      <div className="hidden bg-foreground text-white sm:block">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-2 text-xs">
          <span className="font-medium text-white/80">
            Now covering JAMB UTME 2027 — Science, Arts &amp; Commercial
          </span>
          <div className="flex items-center gap-5 text-white/80">
            <span className="flex items-center gap-1.5">
              <Mail size={13} /> hello@examhub.ng
            </span>
            <span className="flex items-center gap-1.5">
              <Phone size={13} /> +234 800 000 0000
            </span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-semibold text-foreground lg:flex">
            {navLinks.map((link, i) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative pb-1 hover:text-primary ${i === 0 ? 'text-primary after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-primary' : ''
                  }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              aria-label="Search"
              className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-foreground sm:flex hover:bg-gray-200 transition"
            >
              <Search size={18} />
            </button>
            <Link to="/login" className="hidden min-h-11 items-center px-2 text-sm font-semibold text-foreground sm:flex hover:text-primary transition">
              Log in
            </Link>
            <Link
              to="/signup"
              className="flex min-h-11 items-center rounded-md bg-orange-500 px-5 text-sm font-bold text-white shadow-lg shadow-orange-500/30 transition-all hover:-translate-y-0.5 hover:bg-orange-600"
            >
              Start Practicing
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION - REDESIGNED TO MATCH IMAGE */}
        <section id="hero" className="relative overflow-hidden bg-[#F0F6FF]">
          {/* Decorative background shapes */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Large Blue Blob on Right */}
            <div className="absolute -right-32 top-0 h-[40rem] w-[40rem] rounded-full bg-blue-600/10" />
            <div className="absolute right-0 bottom-0 h-[30rem] w-[30rem] rounded-full bg-blue-400/10" />

            {/* Decorative Dots */}
            <div className="absolute right-24 top-24 grid grid-cols-4 gap-2 opacity-40">
              {Array.from({ length: 12 }).map((_, i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              ))}
            </div>
          </div>

          <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
            {/* Left Column: Text */}
            <div className="z-10">
              <div className="mb-5 flex items-center gap-2">
                <span className="h-0.5 w-8 bg-blue-600"></span>
                <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-blue-600">
                  Best Online Education
                </span>
              </div>

              <h1 className="text-balance font-heading text-5xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
                Build Your Future
                <br />
                With <span className="text-blue-700">EXAMHUB</span>
              </h1>

              <p className="mt-6 max-w-lg text-pretty text-lg leading-8 text-slate-600">
                Join thousands of learners preparing for JAMB UTME across the Science, Arts and
                Commercial streams — with original questions, timed mock exams and feedback that
                points to what's next.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/signup"
                  className="flex min-h-12 items-center rounded-md bg-[#1e3a8a] px-8 py-4 font-bold text-white shadow-xl shadow-blue-900/20 transition-all hover:-translate-y-0.5 hover:bg-blue-900"
                >
                  Explore Exams
                </Link>
                <a
                  href="#how"
                  className="flex min-h-12 items-center gap-3 rounded-md border border-slate-200 bg-white px-6 py-2.5 font-bold text-slate-800 transition-all hover:border-blue-600 group"
                >
                  Learn More
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white group-hover:bg-blue-700">
                    <Play size={12} fill="currentColor" />
                  </span>
                </a>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
                <span className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" /> Realistic CBT experience
                </span>
                <span className="flex items-center gap-2">
                  <Check size={18} className="text-green-500" /> Instant feedback
                </span>
              </div>
            </div>

            {/* Right Column: Image + Floating Cards */}
            <div className="relative mx-auto w-full max-w-md lg:max-w-none z-10">

              {/* Main Image Container */}
              <div className="relative flex justify-center">
                {/* The Image - Replace this src with your actual student image */}
                <img
                  src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Student smiling"
                  className="relative z-10 w-full max-w-md object-cover rounded-full border-[10px] border-white/40 shadow-2xl aspect-square"
                />
              </div>

              {/* Floating Card 1: Active Students (Left) */}
              <div className="absolute -left-4 top-1/4 z-20 w-48 rounded-2xl bg-white p-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:-left-10">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <GraduationCap size={20} />
                </span>
                <p className="mt-3 font-heading text-2xl font-extrabold text-slate-900">20K+</p>
                <p className="text-xs font-medium text-slate-500">Active Students</p>
                <div className="mt-3 flex -space-x-2">
                  {studentAvatars.map((a) => (
                    <span
                      key={a.initials}
                      className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${a.bg}`}
                    >
                      {a.initials}
                    </span>
                  ))}
                </div>
              </div>

              {/* Floating Card 2: Success Rate (Right) */}
              <div className="absolute -right-4 top-10 z-20 flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.1)] sm:-right-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-500">
                  <Award size={20} />
                </span>
                <div>
                  <p className="font-heading text-xl font-extrabold leading-none text-slate-900">95%</p>
                  <p className="text-xs font-medium text-slate-500">Success Rate</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* HOW IT WORKS - KEPT ORIGINAL */}
        <section id="how" className="border-y border-border bg-card">
          <div className="mx-auto w-full max-w-7xl px-6 py-16">
            <div className="max-w-lg">
              <p className="text-sm font-bold uppercase tracking-wider text-primary">A focused path to progress</p>
              <h2 className="mt-3 text-balance font-heading text-3xl font-bold text-foreground">
                From your first question to your next breakthrough.
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {steps.map(({ step, title, body, highlighted }) => (
                <div key={step} className={`rounded-xl p-6 ${highlighted ? 'bg-secondary' : 'border border-border'}`}>
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-lg font-bold ${highlighted ? 'bg-primary text-primary-foreground' : 'bg-accent text-primary'
                      }`}
                  >
                    {step}
                  </span>
                  <h3 className="mt-5 font-heading text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXAMS - JAMB streams */}
        <section id="exams" className="mx-auto w-full max-w-7xl px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-primary">Practice for what matters</p>
              <h2 className="mt-2 text-balance font-heading text-2xl font-bold text-foreground sm:text-3xl">
                Original JAMB-standard questions, by stream.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                Every stream pairs Use of English with three subject-specific papers, exactly as
                JAMB structures the UTME.
              </p>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {streams.map((stream, i) => {
              const Icon = streamIcons[stream.icon]
              const featured = i === 0
              return (
                <div
                  key={stream.id}
                  className={`rounded-xl p-6 ${featured ? 'bg-primary text-primary-foreground' : 'border border-border bg-card'}`}
                >
                  <Icon size={26} className={featured ? '' : 'text-primary'} />
                  <h3 className="mt-8 font-heading text-xl font-bold">{stream.name}</h3>
                  <p className={`mt-2 text-sm ${featured ? '' : 'text-muted-foreground'}`}>
                    {stream.tagline}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* FEATURES - KEPT ORIGINAL */}
        <section id="features" className="bg-secondary">
          <div className="mx-auto w-full max-w-7xl px-6 py-16">
            <h2 className="text-center font-heading text-3xl font-bold text-foreground">
              Everything you need to improve deliberately.
            </h2>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {features.map(({ icon: Icon, label }) => (
                <div key={label} className="rounded-xl bg-card p-5 text-center shadow-theme">
                  <Icon size={26} className="mx-auto text-primary" />
                  <p className="mt-3 text-sm font-semibold">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - KEPT ORIGINAL */}
        <section className="mx-auto w-full max-w-7xl px-6 py-16">
          <div className="rounded-xl bg-primary px-8 py-12 text-center text-primary-foreground shadow-theme">
            <p className="text-sm font-semibold">EXAMHUB is ready when you are</p>
            <h2 className="mx-auto mt-3 max-w-2xl text-balance font-heading text-3xl font-bold">
              Your next score starts with your next question.
            </h2>
            <Link
              to="/signup"
              className="mt-7 inline-flex min-h-11 items-center rounded-lg bg-card px-6 py-3 font-semibold text-primary transition hover:bg-gray-100"
            >
              Create your free account
            </Link>
          </div>
        </section>
      </main>

      {/* FOOTER - KEPT ORIGINAL */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} EXAMHUB. Practice Smart. Score Higher.</span>
          <span>Made for ambitious Nigerian students.</span>
        </div>
      </footer>
    </div>
  )
}
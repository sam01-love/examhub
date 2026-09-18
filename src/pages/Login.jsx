import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowLeft, GraduationCap, TriangleAlert, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Logo from '../components/Logo'
import GoogleButton from '../components/GoogleButton'

export default function Login() {
  const { signIn, resetPassword } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setNotice('')
    setLoading(true)
    try {
      await signIn({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.message || 'Could not log in. Check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    setError('')
    setNotice('')
    if (!email) {
      setError('Enter your email above first, then tap "Forgot password?"')
      return
    }
    try {
      await resetPassword(email)
      setNotice('Password reset link sent — check your inbox.')
    } catch (err) {
      setError(err.message || 'Could not send reset email.')
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-hidden bg-[#F0F6FF] font-sans">
      {/* Decorative background shapes (Matching Landing Page) */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-blue-600/10" />
        <div className="absolute -bottom-32 -left-32 h-[30rem] w-[30rem] rounded-full bg-blue-400/10" />

        {/* Decorative Dots */}
        <div className="absolute right-24 top-24 grid grid-cols-4 gap-2 opacity-30">
          {Array.from({ length: 12 }).map((_, i) => (
            <span key={i} className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          ))}
        </div>
      </div>

      <header className="relative z-10 border-b border-blue-100/50 bg-white/70 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <Link to="/" className="flex min-h-11 items-center text-sm font-semibold text-slate-600 transition hover:text-blue-700">
            <ArrowLeft size={18} className="mr-2" />
            Back to home
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12">
        <div className="mb-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-700">
            <GraduationCap size={16} />
            Student Login
          </div>
          <h1 className="text-balance font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Welcome back to your study plan.
          </h1>
          <p className="mt-3 text-pretty text-sm leading-6 text-slate-500">
            Log in to continue practicing for your JAMB stream.
          </p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            <TriangleAlert size={16} className="shrink-0" />
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-5 flex items-center gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            <Check size={16} className="shrink-0" />
            {notice}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700" htmlFor="login-email">
              Email address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="login-email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-13 w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-semibold text-slate-700" htmlFor="login-password">
                Password
              </label>
              <button type="button" onClick={handleForgotPassword} className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-13 w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-11 pr-12 text-sm text-slate-900 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="min-h-12 w-full rounded-xl bg-[#1e3a8a] font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 hover:bg-blue-900 disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        <div className="my-7 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium text-slate-400">or continue with</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <GoogleButton label="Google" />

        <div className="mt-8 text-center text-sm text-slate-500">
          New to EXAMHUB?{' '}
          <Link to="/signup" className="font-bold text-blue-700 hover:text-blue-900 transition">
            Create your free account
          </Link>
        </div>
      </main>
    </div>
  )
}
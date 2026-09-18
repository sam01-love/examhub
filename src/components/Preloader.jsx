import { useEffect, useState } from 'react'
import logo from '../assets/logo.jpeg'

/**
 * Full-screen preloader shown once when the app first boots.
 * Combines a spinning ring, a "popping in" logo, and a progress bar so the
 * brand mark is the focal point while the app finishes its initial checks
 * (Supabase session lookup, fonts, etc).
 */
export default function Preloader({ onFinish, minDuration = 1600 }) {
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), minDuration)
    const removeTimer = setTimeout(() => onFinish?.(), minDuration + 450)
    return () => {
      clearTimeout(leaveTimer)
      clearTimeout(removeTimer)
    }
  }, [minDuration, onFinish])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-450 ease-out ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
      role="status"
      aria-live="polite"
      aria-label="Loading EXAMHUB"
    >
      <div className="relative flex h-32 w-32 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-4 border-secondary" />
        <span className="absolute inset-0 animate-ring-spin rounded-full border-4 border-transparent border-t-primary border-r-primary" />
        <div className="animate-logo-pop flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl shadow-theme">
          <img src={logo} alt="EXAMHUB logo" className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="animate-fade-up mt-7 flex flex-col items-center" style={{ animationDelay: '0.25s' }}>
        <span className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
          EXAM<span className="text-primary">HUB</span>
        </span>
        <span className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Learn · Practice · Pass · Succeed
        </span>
      </div>

      <div className="mt-8 h-1.5 w-40 overflow-hidden rounded-full bg-secondary">
        <div className="h-full w-1/3 animate-[loading-bar_1.1s_ease-in-out_infinite] rounded-full bg-primary" />
      </div>

      <style>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(60%); }
          100% { transform: translateX(220%); }
        }
      `}</style>
    </div>
  )
}

import { useState } from 'react'
import { User, Mail, LogOut, ShieldCheck } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Settings() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [signingOut, setSigningOut] = useState(false)

  const fullName = user?.user_metadata?.full_name || 'Student'

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    navigate('/login')
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">Account settings</h1>
        <p className="mt-2 text-muted-foreground">Manage your EXAMHUB profile and session.</p>
      </div>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-heading text-lg font-semibold">Profile</h2>
        <div className="mt-5 space-y-4">
          <div className="flex items-center gap-3 rounded-lg border border-border p-4">
            <User size={18} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Full name</p>
              <p className="text-sm font-semibold">{fullName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-4">
            <Mail size={18} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-semibold">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border p-4">
            <ShieldCheck size={18} className="text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Account secured by</p>
              <p className="text-sm font-semibold">Supabase Auth</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-destructive/30 bg-card p-6">
        <h2 className="font-heading text-lg font-semibold text-destructive">Sign out</h2>
        <p className="mt-1 text-sm text-muted-foreground">You'll need to log in again to access your dashboard.</p>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          className="mt-5 flex min-h-11 items-center rounded-lg bg-destructive px-5 font-semibold text-destructive-foreground disabled:opacity-60"
        >
          <LogOut size={18} className="mr-2" />
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </section>
    </div>
  )
}

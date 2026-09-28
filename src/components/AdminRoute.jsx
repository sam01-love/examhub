import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Logo from './Logo'

export default function AdminRoute({ children }) {
  const { user, loading, isAdmin, adminChecked } = useAuth()
  const location = useLocation()

  if (loading || !adminChecked) {
    return (
      <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-background">
        <Logo showWordmark={false} size="lg" to={null} />
        <div className="h-1.5 w-32 overflow-hidden rounded-full bg-secondary">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-primary" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace state={{ notice: 'not-admin' }} />
  }

  return children
}

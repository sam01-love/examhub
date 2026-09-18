import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import Logo from '../components/Logo'

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-6 bg-background px-6 text-center">
      <Logo />
      <div>
        <p className="font-heading text-6xl font-bold text-primary">404</p>
        <h1 className="mt-3 font-heading text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist or has moved.</p>
      </div>
      <Link to="/" className="flex min-h-11 items-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md">
        <Home size={18} className="mr-2" />
        Back to home
      </Link>
    </div>
  )
}

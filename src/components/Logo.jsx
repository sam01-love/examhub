import { Link } from 'react-router-dom'
import logo from '../assets/logo.jpeg'

const sizes = {
  sm: { box: 'h-8 w-8', text: 'text-base' },
  md: { box: 'h-10 w-10', text: 'text-xl' },
  lg: { box: 'h-14 w-14', text: 'text-2xl' },
}

export default function Logo({ to = '/', size = 'md', showWordmark = true, className = '' }) {
  const { box, text } = sizes[size] ?? sizes.md

  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex ${box} shrink-0 items-center justify-center overflow-hidden rounded-xl shadow-sm`}>
        <img src={logo} alt="EXAMHUB logo" className="h-full w-full object-cover" />
      </div>
      {showWordmark && (
        <span className={`font-heading font-extrabold tracking-tight text-foreground ${text}`}>
          EXAM<span className="text-primary">HUB</span>
        </span>
      )}
    </div>
  )

  if (!to) return content

  return (
    <Link to={to} aria-label="EXAMHUB home">
      {content}
    </Link>
  )
}

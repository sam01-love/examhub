import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { fetchPaidExamTypes } from '../lib/paymentsApi'

// Which exam types has the signed-in student paid for?
// `loading` is true until the first answer arrives, so callers never flash the
// locked state at someone who has actually paid.
export default function useEntitlements() {
  const { user } = useAuth()
  const [paid, setPaid] = useState(() => new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    if (!user?.id) {
      setLoading(false)
      return
    }
    fetchPaidExamTypes(user.id).then((set) => {
      if (!active) return
      setPaid(set)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [user?.id])

  return { loading, isPaid: (examType) => paid.has(examType) }
}

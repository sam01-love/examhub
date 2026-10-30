import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CircleCheck, CircleX, Clock, Loader2 } from 'lucide-react'
import { EXAM_TYPE_LABELS, PRICE_NAIRA, formatNaira, verifyPayment } from '../lib/paymentsApi'

const POLL_TRIES = 6
const POLL_MS = 3000

// Where the student lands after the Paystack popup. It never trusts the popup:
// it asks the server to confirm the payment with Paystack, and only the
// server's "success" shows "Payment successful" and unlocks the full bank.
export default function PaymentStatus() {
  const [params] = useSearchParams()
  const reference = params.get('reference')
  const already = params.get('already') === '1'
  const examTypeParam = params.get('examType')

  const [state, setState] = useState(already ? { status: 'success' } : { status: 'verifying' })
  const alive = useRef(true)

  const check = useCallback(async () => {
    if (!reference) return
    setState({ status: 'verifying' })
    for (let attempt = 0; attempt < POLL_TRIES; attempt++) {
      try {
        const res = await verifyPayment(reference)
        if (!alive.current) return
        if (res.status !== 'pending') {
          setState(res)
          return
        }
      } catch (err) {
        if (alive.current) setState({ status: 'error', message: err.message })
        return
      }
      await new Promise((r) => setTimeout(r, POLL_MS))
      if (!alive.current) return
    }
    setState({ status: 'pending' })
  }, [reference])

  useEffect(() => {
    alive.current = true
    check()
    return () => {
      alive.current = false
    }
  }, [check])

  const examType = state.examType || examTypeParam
  const label = EXAM_TYPE_LABELS[examType] || 'your exam'
  const practiceLink = examType ? `/practice?examType=${examType}` : '/practice'

  return (
    <div className="mx-auto max-w-md py-10 text-center">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        {state.status === 'verifying' && (
          <>
            <Loader2 size={44} className="mx-auto animate-spin text-primary" />
            <h1 className="mt-5 font-heading text-xl font-bold">Confirming your payment…</h1>
            <p className="mt-2 text-sm text-muted-foreground">Please don't close this page.</p>
          </>
        )}

        {state.status === 'success' && (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-tertiary/15 text-tertiary">
              <CircleCheck size={40} />
            </span>
            <h1 className="mt-5 font-heading text-2xl font-extrabold">Payment successful</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              The full {label} question bank is now unlocked on your account.
            </p>
            {reference && (
              <dl className="mt-6 space-y-2 rounded-xl bg-muted p-4 text-left text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Amount</dt>
                  <dd className="font-semibold">{formatNaira((state.amount ?? PRICE_NAIRA * 100) / 100)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Unlocked</dt>
                  <dd className="font-semibold">{label}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Reference</dt>
                  <dd className="break-all text-right font-mono text-xs">{reference}</dd>
                </div>
              </dl>
            )}
            <Link
              to={practiceLink}
              className="mt-6 flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
            >
              Start practicing
            </Link>
          </>
        )}

        {state.status === 'pending' && (
          <>
            <Clock size={44} className="mx-auto text-primary" />
            <h1 className="mt-5 font-heading text-xl font-bold">Still waiting for confirmation</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your bank hasn't confirmed the payment yet. If you were debited, it will unlock automatically —
              you can also check again.
            </p>
            <button
              onClick={check}
              className="mt-6 flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
            >
              Check again
            </button>
            {reference && <p className="mt-4 break-all font-mono text-xs text-muted-foreground">Ref: {reference}</p>}
          </>
        )}

        {(state.status === 'failed' || state.status === 'mismatch' || state.status === 'not_found') && (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <CircleX size={40} />
            </span>
            <h1 className="mt-5 font-heading text-xl font-bold">Payment not completed</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {state.status === 'mismatch'
                ? "The amount received didn't match, so nothing was unlocked. Please contact support with your reference."
                : "We couldn't confirm this payment. You haven't been charged for anything that didn't go through."}
            </p>
            <Link
              to={practiceLink}
              className="mt-6 flex min-h-11 items-center justify-center rounded-lg border border-border bg-card px-5 font-semibold transition hover:border-primary"
            >
              Back to practice
            </Link>
            {reference && <p className="mt-4 break-all font-mono text-xs text-muted-foreground">Ref: {reference}</p>}
          </>
        )}

        {state.status === 'error' && (
          <>
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <CircleX size={40} />
            </span>
            <h1 className="mt-5 font-heading text-xl font-bold">Couldn't confirm right now</h1>
            <p className="mt-2 text-sm text-muted-foreground">{state.message}</p>
            <button
              onClick={check}
              className="mt-6 flex min-h-11 w-full items-center justify-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90"
            >
              Try again
            </button>
            {reference && <p className="mt-4 break-all font-mono text-xs text-muted-foreground">Ref: {reference}</p>}
          </>
        )}
      </div>
    </div>
  )
}

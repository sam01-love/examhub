import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Loader2, ShieldCheck } from 'lucide-react'
import {
  EXAM_TYPE_LABELS,
  FREE_TRIAL_QUESTIONS,
  PRICE_NAIRA,
  formatNaira,
  openPaystackPopup,
  startCheckout,
} from '../lib/paymentsApi'

// "Unlock the full question bank" call-to-action. Shown to students who have
// not paid for this exam type yet. `compact` is the slim banner version.
export default function UnlockCard({ examType, compact = false }) {
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const label = EXAM_TYPE_LABELS[examType] || 'this exam'

  const unlock = async () => {
    setBusy(true)
    setError('')
    try {
      const checkout = await startCheckout(examType)
      if (checkout.alreadyPaid) {
        navigate(`/payment/verify?examType=${examType}&already=1`)
        return
      }
      await openPaystackPopup(checkout.accessCode, {
        // The popup closing "successfully" is NOT proof of payment — the status
        // page asks the server to confirm it with Paystack before unlocking.
        onSuccess: () => navigate(`/payment/verify?reference=${encodeURIComponent(checkout.reference)}`),
        onCancel: () => setBusy(false),
        onError: (e) => {
          setError(e?.message || 'Payment could not be completed.')
          setBusy(false)
        },
      })
    } catch (err) {
      setError(err.message || 'Could not start payment.')
      setBusy(false)
    }
  }

  return (
    <section
      className={`rounded-2xl border border-primary/30 bg-secondary ${compact ? 'p-4' : 'p-6 text-center sm:p-8'}`}
    >
      <div className={`flex gap-4 ${compact ? 'items-center justify-between' : 'flex-col items-center'}`}>
        <div className={`flex gap-3 ${compact ? 'items-center' : 'flex-col items-center'}`}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Lock size={20} />
          </span>
          <div className={compact ? '' : 'max-w-md'}>
            <p className="font-heading text-sm font-bold sm:text-base">Free trial — {FREE_TRIAL_QUESTIONS} questions per subject</p>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              Unlock the full {label} question bank for {formatNaira(PRICE_NAIRA)}, one-time.
            </p>
          </div>
        </div>

        <button
          onClick={unlock}
          disabled={busy}
          className="flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-primary px-5 font-semibold text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-60"
        >
          {busy ? <Loader2 size={18} className="animate-spin" /> : `Unlock for ${formatNaira(PRICE_NAIRA)}`}
        </button>
      </div>

      {error && <p className="mt-3 text-sm font-medium text-destructive">{error}</p>}
      {!compact && (
        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <ShieldCheck size={14} /> Secure payment by Paystack — card, bank transfer or USSD.
        </p>
      )}
    </section>
  )
}

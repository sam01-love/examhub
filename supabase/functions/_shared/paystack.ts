import { createClient, type SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2'

// The price is fixed HERE, on the server — the browser can never change it.
export const AMOUNT_KOBO = 200000 // ₦2,000
export const EXAM_TYPES = ['jamb', 'post_utme', 'oau']

export function adminClient() {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
}

export type ConfirmResult = {
  status: 'success' | 'pending' | 'failed' | 'mismatch' | 'not_found'
  examType?: string
  amount?: number
  paidAt?: string | null
}

// Asks Paystack directly whether this reference was really paid, then updates
// our row. Used by both the verify endpoint and the webhook. Idempotent.
export async function confirmPayment(admin: SupabaseClient, reference: string): Promise<ConfirmResult> {
  const { data: payment } = await admin.from('payments').select('*').eq('reference', reference).maybeSingle()
  if (!payment) return { status: 'not_found' }

  const base = { examType: payment.exam_type, amount: payment.amount, paidAt: payment.paid_at }
  if (payment.status === 'success' || payment.status === 'duplicate') return { status: 'success', ...base }
  if (payment.status === 'failed') return { status: 'failed', ...base }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}` },
  })
  const body = await res.json().catch(() => null)
  const tx = body?.data
  if (!body?.status || !tx) return { status: 'pending', ...base }

  if (tx.status === 'success') {
    // Never trust a "success" for a different amount/currency than we asked for.
    if (tx.amount !== payment.amount || tx.currency !== 'NGN') return { status: 'mismatch', ...base }

    const paidAt = new Date().toISOString()
    const { error } = await admin
      .from('payments')
      .update({ status: 'success', paid_at: paidAt })
      .eq('reference', reference)
      .eq('status', 'pending')

    if (error) {
      // 23505 = the student already has a successful payment for this exam type
      // (they paid twice). Keep the record as 'duplicate' so you can refund it.
      if (error.code === '23505') {
        await admin.from('payments').update({ status: 'duplicate' }).eq('reference', reference)
        return { status: 'success', ...base }
      }
      throw error
    }
    return { status: 'success', ...base, paidAt }
  }

  if (tx.status === 'failed') {
    await admin.from('payments').update({ status: 'failed' }).eq('reference', reference).eq('status', 'pending')
    return { status: 'failed', ...base }
  }

  return { status: 'pending', ...base } // abandoned / ongoing — keep waiting
}

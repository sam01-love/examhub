import { supabase } from './supabaseClient'

// Display-only constants. The real price (₦2,000) is enforced on the server in
// supabase/functions/_shared/paystack.ts — changing this number alone will NOT
// change what a student is charged.
export const PRICE_NAIRA = 2000
export const FREE_TRIAL_QUESTIONS = 10
export const EXAM_TYPE_LABELS = { jamb: 'JAMB', post_utme: 'Post UTME', oau: 'OAU Courses' }

export const formatNaira = (n) => `₦${Number(n).toLocaleString('en-NG')}`

/** Exam types this student has paid for, e.g. Set { 'jamb' }. Empty on any failure (= free trial). */
export async function fetchPaidExamTypes(userId) {
  if (!userId) return new Set()
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('exam_type')
      .eq('user_id', userId)
      .eq('status', 'success')
    if (error) throw error
    return new Set((data ?? []).map((r) => r.exam_type))
  } catch (err) {
    console.warn('[EXAMHUB] Could not load payments:', err.message)
    return new Set()
  }
}

async function callFunction(name, body) {
  const { data, error } = await supabase.functions.invoke(name, { body })
  if (error) {
    let message = error.message
    try {
      const detail = await error.context?.json?.()
      if (detail?.error) message = detail.error
    } catch {
      // keep the generic message
    }
    throw new Error(message)
  }
  return data
}

/** Asks the server to create a Paystack transaction. Returns { accessCode, reference } or { alreadyPaid: true }. */
export const startCheckout = (examType) => callFunction('paystack-init', { examType })

/** Asks the server to confirm a payment with Paystack. Returns { status, examType, amount, paidAt }. */
export const verifyPayment = (reference) => callFunction('paystack-verify', { reference })

function loadPaystack() {
  if (window.PaystackPop) return Promise.resolve(window.PaystackPop)
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://js.paystack.co/v2/inline.js'
    script.onload = () => resolve(window.PaystackPop)
    script.onerror = () => reject(new Error('Could not load the payment window. Check your connection.'))
    document.body.appendChild(script)
  })
}

/** Opens the Paystack checkout popup for a transaction created by startCheckout. */
export async function openPaystackPopup(accessCode, { onSuccess, onCancel, onError }) {
  const PaystackPop = await loadPaystack()
  const popup = new PaystackPop()
  popup.resumeTransaction(accessCode, { onSuccess, onCancel, onError })
}

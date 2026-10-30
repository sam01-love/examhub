import { adminClient, confirmPayment } from '../_shared/paystack.ts'

// Paystack calls this itself when a payment succeeds — even if the student
// closed the tab or lost connection before the browser could verify. Deploy
// with --no-verify-jwt (Paystack has no Supabase login); the request is
// authenticated by Paystack's HMAC signature instead.

const encoder = new TextEncoder()

async function sign(secret: string, payload: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-512' }, false, ['sign'])
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return [...new Uint8Array(mac)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

Deno.serve(async (req) => {
  try {
    const raw = await req.text()
    const signature = req.headers.get('x-paystack-signature') ?? ''
    const expected = await sign(Deno.env.get('PAYSTACK_SECRET_KEY')!, raw)
    if (!safeEqual(signature, expected)) return new Response('Invalid signature', { status: 401 })

    const event = JSON.parse(raw)
    if (event.event === 'charge.success' && event.data?.reference) {
      await confirmPayment(adminClient(), event.data.reference)
    }
    return new Response('ok')
  } catch (err) {
    console.error('paystack-webhook failed', err)
    return new Response('error', { status: 500 })
  }
})

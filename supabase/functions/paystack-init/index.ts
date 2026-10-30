import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'
import { adminClient, AMOUNT_KOBO, EXAM_TYPES } from '../_shared/paystack.ts'

// Starts a ₦2,000 checkout for the signed-in student and one exam type.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    // Who is calling? Taken from their login token, never from the request body.
    const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    })
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return json({ error: 'Please sign in again.' }, 401)

    const { examType } = await req.json()
    if (!EXAM_TYPES.includes(examType)) return json({ error: 'Invalid exam type.' }, 400)

    const admin = adminClient()
    const { data: existing } = await admin
      .from('payments')
      .select('id')
      .eq('user_id', user.id)
      .eq('exam_type', examType)
      .eq('status', 'success')
      .maybeSingle()
    if (existing) return json({ alreadyPaid: true })

    const reference = `EXH-${crypto.randomUUID()}`
    const res = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        amount: AMOUNT_KOBO,
        currency: 'NGN',
        reference,
        metadata: { user_id: user.id, exam_type: examType },
      }),
    })
    const body = await res.json()
    if (!body?.status) return json({ error: body?.message ?? 'Could not start payment.' }, 502)

    const { error: insertError } = await admin.from('payments').insert({
      user_id: user.id,
      exam_type: examType,
      reference,
      amount: AMOUNT_KOBO,
      status: 'pending',
    })
    if (insertError) throw insertError

    return json({ accessCode: body.data.access_code, reference })
  } catch (err) {
    console.error('paystack-init failed', err)
    return json({ error: 'Something went wrong starting your payment.' }, 500)
  }
})

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders, json } from '../_shared/cors.ts'
import { adminClient, confirmPayment } from '../_shared/paystack.ts'

// Called by the browser right after the Paystack popup closes successfully.
// Re-checks the payment with Paystack itself; the browser's word is never trusted.
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    })
    const { data: { user }, error: authError } = await userClient.auth.getUser()
    if (authError || !user) return json({ error: 'Please sign in again.' }, 401)

    const { reference } = await req.json()
    if (typeof reference !== 'string' || !reference) return json({ error: 'Missing reference.' }, 400)

    const admin = adminClient()

    // A student can only check their own payments.
    const { data: owned } = await admin
      .from('payments')
      .select('id')
      .eq('reference', reference)
      .eq('user_id', user.id)
      .maybeSingle()
    if (!owned) return json({ status: 'not_found' }, 404)

    return json(await confirmPayment(admin, reference))
  } catch (err) {
    console.error('paystack-verify failed', err)
    return json({ error: 'Could not confirm your payment right now.' }, 500)
  }
})

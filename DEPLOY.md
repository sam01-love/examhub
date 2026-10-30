# Paystack paywall — setup order

1. Paystack: create a business account at paystack.com, add your bank account (settlements),
   then Settings > API Keys. Use the TEST keys first.
2. Supabase SQL editor: run payments.sql
3. Terminal (install the Supabase CLI once: npm i -g supabase), in your project root:
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   supabase secrets set PAYSTACK_SECRET_KEY=sk_test_xxxxxxxx
   supabase functions deploy paystack-init
   supabase functions deploy paystack-verify
   supabase functions deploy paystack-webhook --no-verify-jwt
4. Paystack > Settings > API Keys & Webhooks > Webhook URL:
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/paystack-webhook
5. Copy the src/ files into your project, then deploy the site.
6. Test with Paystack test card 4084 0840 8408 4081 (any future expiry, CVV 408), then switch the
   secret to your sk_live key and re-run: supabase secrets set PAYSTACK_SECRET_KEY=sk_live_...

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  // Doesn't throw — lets the app render (e.g. the landing page) even before
  // Supabase credentials are configured. Auth calls will fail with a clear
  // console warning until VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set.
  console.warn(
    '[EXAMHUB] Supabase env vars are missing. Copy .env.example to .env and add your project URL + anon key.'
  )
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'public-anon-key'
)

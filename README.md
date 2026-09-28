# EXAMHUB

A React web app for practicing JAMB, WAEC, NECO and Post-UTME exam questions —
structured practice, timed mock exams, and performance tracking.

## Stack

- **React 19** + **Vite** — app shell and dev server
- **React Router v7** — routing
- **Tailwind CSS v4** — styling (design tokens match the original mockups)
- **Supabase** — authentication (email/password + Google OAuth) and profile storage
- **lucide-react** — icon set used throughout the dashboard and pages

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your Supabase project URL + anon key
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview   # serve the production build locally
```

## Setting up Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **Settings → API** and copy your **Project URL** and **anon public key**
   into `.env` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Go to **Authentication → Providers** and make sure **Email** is enabled.
   If you want the "Continue with Google" button to work, enable the
   **Google** provider there too and add your OAuth client ID/secret.
4. Under **Authentication → URL Configuration**, add your dev and production
   URLs (e.g. `http://localhost:5173`, `https://yourdomain.com`) to the
   allowed redirect URLs — this is required for email confirmation links and
   Google OAuth to redirect back into the app correctly.
5. (Optional but recommended) Create a `profiles` table so the onboarding
   step (exam type, subjects, target score, institution) is saved. Run this
   in the Supabase SQL editor:

   ```sql
   create table public.profiles (
     id uuid references auth.users on delete cascade primary key,
     full_name text,
     exam_type text,
     subjects text[],
     target_score text,
     institution text,
     updated_at timestamptz default now()
   );

   alter table public.profiles enable row level security;

   create policy "Users can view their own profile"
     on public.profiles for select
     using (auth.uid() = id);

   create policy "Users can upsert their own profile"
     on public.profiles for insert
     with check (auth.uid() = id);

   create policy "Users can update their own profile"
     on public.profiles for update
     using (auth.uid() = id);
   ```

   If this table doesn't exist yet, onboarding still works and takes the
   student straight to the dashboard — it just logs a warning instead of
   saving their choices, so you can add this later without anything
   breaking.

## Project structure

```
src/
  assets/          Logo and static images
  components/       Reusable UI (Sidebar, TopBar, Preloader, ProtectedRoute, ...)
  context/          AuthContext — wraps all Supabase auth calls
  data/             Mock question bank, subjects, exam types (swap for real data later)
  layouts/          AppLayout — sidebar + topbar shell for authenticated pages
  lib/              Supabase client
  pages/            Landing, Signup, Login, Onboarding, Dashboard, Practice
                     Setup, CBT Practice (quiz engine), Mock Exams,
                     Performance, Settings, NotFound
```

## Swapping in real question content

Practice questions currently come from `src/data/mockData.js` (`questionBank`).
Once you have real content in Supabase (e.g. a `questions` table), replace the
`useMemo` lookup in `src/pages/CBTPractice.jsx` with a Supabase query for the
selected subject/topic.

## Notes

- The preloader (logo animation) shows once on first app load, in
  `src/main.jsx` / `src/components/Preloader.jsx`.
- Authenticated routes (`/dashboard`, `/practice`, `/mock-exams`,
  `/performance`, `/settings`, `/onboarding`) are wrapped in `ProtectedRoute`
  and redirect to `/login` if there's no active Supabase session.

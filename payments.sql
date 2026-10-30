-- Run once in the Supabase SQL editor.

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  exam_type text not null check (exam_type in ('jamb', 'post_utme', 'oau')),
  reference text not null unique,
  amount integer not null,                 -- in kobo (200000 = ₦2,000)
  status text not null default 'pending'
    check (status in ('pending', 'success', 'failed', 'duplicate')),
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

alter table public.payments enable row level security;

-- Students can only READ their own payments. There are deliberately NO
-- insert/update/delete policies: only the Edge Functions (service role) can
-- write, so a student can never mark themselves as paid from the browser.
create policy "Users can read their own payments"
  on public.payments for select
  to authenticated
  using (auth.uid() = user_id);

-- Admins can read every payment (for tracking).
create policy "Admins can read all payments"
  on public.payments for select
  to authenticated
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.is_admin));

-- A student can only ever have ONE successful payment per exam type.
create unique index payments_one_success_per_exam
  on public.payments (user_id, exam_type) where status = 'success';

create index payments_user_status_idx on public.payments (user_id, status);

-- Handy admin view: every payment with the student's email.
create or replace view public.payment_report as
  select p.created_at, p.paid_at, p.status, p.exam_type, p.amount / 100 as naira,
         p.reference, u.email
  from public.payments p
  join auth.users u on u.id = p.user_id
  order by p.created_at desc;
-- (Views run with the owner's rights; query it from the SQL editor, not from the app.)
revoke all on public.payment_report from anon, authenticated;

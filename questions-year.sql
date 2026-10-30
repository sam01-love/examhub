-- Run once in the Supabase SQL editor.
-- Lets each uploaded question carry the exam year it came from (2000-2026).
alter table public.questions
  add column if not exists year integer check (year between 2000 and 2026);

create index if not exists questions_filter_idx
  on public.questions (subject, exam_type, year);

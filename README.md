# TypeTeawThai (Next.js Frontend)

Minimal + responsive quiz website that recommends Thai travel provinces/attractions.

## Features
- Supabase Auth (email/password) login & register
- TH/EN toggle (site-wide)
- Region select (5 regions)
- 12-question quiz (Back/Next)
- Results: calculates preference scores (nature/cafe/adventure/culture/sea)
- Recommends top 3 provinces + 2–3 attractions per province
- History list + detail (stored in `public.quiz_results`)

## Setup

1) Install

```bash
npm install
```

2) Create env

```bash
cp .env.example .env.local
```

Fill:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

3) Run

```bash
npm run dev
```

Open http://localhost:3000

## Database tables used
- `regions`
- `provinces` (with province scores)
- `quiz_questions`
- `quiz_options` (with option scores)
- `province_attractions`
- `quiz_results` (history)

## Recommended RLS (important)

Enable RLS and allow users to read/insert their own quiz results:

```sql
alter table public.quiz_results enable row level security;

drop policy if exists "quiz_results_select_own" on public.quiz_results;
create policy "quiz_results_select_own"
on public.quiz_results
for select
using (auth.uid() = user_id);

drop policy if exists "quiz_results_insert_own" on public.quiz_results;
create policy "quiz_results_insert_own"
on public.quiz_results
for insert
with check (auth.uid() = user_id);
```

If you also want to protect `user_results` (if you keep it), apply similar policies.

---

If you want username (not email) UI, the app supports typing a username and it will be converted to `username@typeteawthai.local`.

---

Project goal: Codex-friendly structure (small files, clear flow).

---

Note: This repo is frontend only.

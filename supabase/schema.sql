create table if not exists public.case_studies (
  id uuid primary key,
  title text not null,
  slug text not null unique,
  summary text,
  year text,
  role text,
  tags text[],
  cover_url text,
  gallery_urls text[],
  content jsonb,  is_featured boolean default false,  created_at timestamptz default now()
);

alter table public.case_studies enable row level security;

create policy "Public read access" on public.case_studies
for select
using (true);

create policy "Public insert (tighten later)" on public.case_studies
for insert
with check (true);

create policy "Public delete (tighten later)" on public.case_studies
for delete
using (true);

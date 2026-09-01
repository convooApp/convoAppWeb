-- ------------------------------------------------------------------
-- /join — the singles recruitment drive
--
-- Run this once in the Supabase SQL editor for the project the marketing
-- site points at (VITE_SUPABASE_URL). Until it exists the page still works:
-- applying reports a friendly failure rather than breaking.
-- ------------------------------------------------------------------

create table if not exists public.group_signups (
  id          uuid primary key default gen_random_uuid(),
  -- Required by the form, but left nullable here on purpose: unlike the age
  -- floor this is data quality rather than a safety rule, and making it NOT
  -- NULL means any table that already has rows without one cannot be migrated.
  name        text,
  email       text        not null,
  -- The position applied for. Called `group_slug` for historical reasons; the
  -- copy calls it a position, and the two are allowed to differ.
  group_slug  text        not null,
  age         int         not null,
  -- Which region's room this application belongs to: 'in', 'us' or 'other'.
  -- Convoo runs IN and US as separate data regions, so this is routing
  -- information, not a demographic.
  region      text,
  -- Which side of the room this application belongs on: 'girl' or 'boy'.
  -- Kept separate from the position, because the position says which role
  -- somebody would play, not who they want to be matched with.
  seeking     text,
  -- Where to open the room. Asked for in both regions, because a room is
  -- opened in a city and 'US' or 'India' is not a place two people can meet.
  city        text,
  created_at  timestamptz not null default now(),

  -- Convoo is an adults-only introduction and the child-safety policy says so.
  -- The form checks this too; enforcing it here as well means a bad client, a
  -- replayed request or a future second form cannot get round it.
  constraint group_signups_adult check (age >= 18 and age <= 120),

  -- One application per position per person. This is what lets the form say
  -- "you've already applied for this one" instead of writing a duplicate.
  constraint group_signups_once unique (email, group_slug)
);

-- If you ran the earlier version of this file, this brings that table up to
-- date instead of creating it. Every step is guarded, so the whole file is
-- safe to run on a fresh project and safe to run twice.
alter table public.group_signups add column if not exists age int;
alter table public.group_signups add column if not exists name text;
alter table public.group_signups add column if not exists region text;
alter table public.group_signups add column if not exists seeking text;
alter table public.group_signups add column if not exists city text;

do $$
begin
  -- `city` only exists on tables made by an earlier version and is no longer
  -- collected. Left in place rather than dropped, so nothing already captured
  -- is thrown away.
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name   = 'group_signups'
      and column_name  = 'name'
  ) then
    alter table public.group_signups alter column name drop not null;
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'group_signups_adult'
  ) then
    alter table public.group_signups
      add constraint group_signups_adult check (age >= 18 and age <= 120);
  end if;
end $$;

alter table public.group_signups enable row level security;

-- The site holds only the anon key, so the public may add a row and nothing
-- else. Notably it may NOT read this table: it carries the ages and email
-- addresses of people looking to be introduced to strangers, and that is not
-- something a page should be able to enumerate.
drop policy if exists "anyone may apply" on public.group_signups;
drop policy if exists "anyone may join a group" on public.group_signups;
create policy "anyone may apply"
  on public.group_signups
  for insert
  to anon, authenticated
  with check (true);

-- Counts, and only counts. The page no longer displays these — it is here so
-- you can read the numbers without granting anything access to the rows.
create or replace view public.group_counts as
  select group_slug, count(*)::int as members
  from public.group_signups
  group by group_slug;

grant select on public.group_counts to anon, authenticated;

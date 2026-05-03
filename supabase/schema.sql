-- ============================================
-- ForPrincess — DB schema
-- Run this once in the Supabase SQL editor.
-- Idempotent: safe to re-run.
-- ============================================

-- Enums --------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type user_role as enum ('PRINCESS', 'KNIGHT');
  end if;
  if not exists (select 1 from pg_type where typname = 'wish_priority') then
    create type wish_priority as enum ('WANT', 'REALLY_WANT', 'MUST_HAVE');
  end if;
end$$;

-- profiles ----------------------------------------------
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text,
  role          user_role not null,
  created_at    timestamptz default now()
);

-- Idempotent: add special_dates jsonb if missing.
-- Format: [{ "label": "Sinh nhật em", "date": "2026-08-05" }, ...]
alter table profiles
  add column if not exists special_dates jsonb not null default '[]'::jsonb;

-- Knight-curated daily love notes. Format: ["Hôm nay anh nhớ em", ...]
-- When empty, the app falls back to the seed in public/love-notes.json.
alter table profiles
  add column if not exists love_notes jsonb not null default '[]'::jsonb;

-- wish_items --------------------------------------------
create table if not exists wish_items (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  url         text,
  image_url   text,
  price       numeric(12, 2),
  currency    text default 'VND',
  priority    wish_priority not null default 'WANT',
  note        text,

  is_secretly_buying boolean not null default false,
  is_gifted          boolean not null default false,
  gifted_at          timestamptz,
  gift_message       text,

  created_by  uuid references profiles(id),
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create index if not exists idx_wish_items_status
  on wish_items(is_gifted, priority);

create index if not exists idx_wish_items_gifted_at
  on wish_items(gifted_at desc) where is_gifted = true;

-- updated_at trigger ------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_wish_items_updated_at on wish_items;
create trigger trg_wish_items_updated_at
  before update on wish_items
  for each row execute function set_updated_at();

-- Row Level Security ------------------------------------
alter table profiles    enable row level security;
alter table wish_items  enable row level security;

-- Any authenticated user can read profiles (only 2 rows total — Knight & Princess).
-- Princess needs to read Knight's special_dates to render the countdown widget.
drop policy if exists "profiles_self_select" on profiles;
drop policy if exists "profiles_authed_select" on profiles;
create policy "profiles_authed_select" on profiles
  for select using (auth.uid() is not null);

-- Each user updates only their own profile (display_name, special_dates).
drop policy if exists "profiles_self_update" on profiles;
create policy "profiles_self_update" on profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- Princess: only sees rows that are NOT secretly being bought.
drop policy if exists "princess_sees_non_secret" on wish_items;
create policy "princess_sees_non_secret" on wish_items
  for select using (
    (select role from profiles where id = auth.uid()) = 'PRINCESS'
    and is_secretly_buying = false
  );

-- Knight: sees everything.
drop policy if exists "knight_sees_all" on wish_items;
create policy "knight_sees_all" on wish_items
  for select using (
    (select role from profiles where id = auth.uid()) = 'KNIGHT'
  );

-- Princess can insert wishes (cannot pre-mark them as secret/gifted).
drop policy if exists "princess_inserts" on wish_items;
create policy "princess_inserts" on wish_items
  for insert with check (
    (select role from profiles where id = auth.uid()) = 'PRINCESS'
    and is_secretly_buying = false
    and is_gifted = false
  );

-- Knight can also insert (e.g. surprise additions).
drop policy if exists "knight_inserts" on wish_items;
create policy "knight_inserts" on wish_items
  for insert with check (
    (select role from profiles where id = auth.uid()) = 'KNIGHT'
  );

-- Knight can update everything (mark secret, mark gifted, etc.).
drop policy if exists "knight_updates" on wish_items;
create policy "knight_updates" on wish_items
  for update using (
    (select role from profiles where id = auth.uid()) = 'KNIGHT'
  );

-- Princess can update wishes she created. She CAN edit content of already-gifted
-- items (title/note/etc), but the WITH CHECK clause stops her from flipping the
-- secret/gifted flags herself — those remain Knight-controlled.
drop policy if exists "princess_updates_own_safe_fields" on wish_items;
create policy "princess_updates_own_safe_fields" on wish_items
  for update using (
    (select role from profiles where id = auth.uid()) = 'PRINCESS'
    and created_by = auth.uid()
    and is_secretly_buying = false
  ) with check (
    is_secretly_buying = false
  );

-- Knight can delete (cleanups, mistakes).
drop policy if exists "knight_deletes" on wish_items;
create policy "knight_deletes" on wish_items
  for delete using (
    (select role from profiles where id = auth.uid()) = 'KNIGHT'
  );

-- Princess can delete wishes she created (so she can clean up her own list).
drop policy if exists "princess_deletes_own" on wish_items;
create policy "princess_deletes_own" on wish_items
  for delete using (
    (select role from profiles where id = auth.uid()) = 'PRINCESS'
    and created_by = auth.uid()
  );

-- pings ------------------------------------------------
-- Tiny ephemeral table — Knight presses "anh nhớ em" → row inserted →
-- Princess's Realtime subscription rains hearts for a few seconds.
create table if not exists pings (
  id          uuid primary key default gen_random_uuid(),
  from_user   uuid not null references profiles(id) on delete cascade,
  type        text not null default 'heart',
  created_at  timestamptz not null default now()
);

create index if not exists idx_pings_recent on pings(created_at desc);

alter table pings enable row level security;

-- Knight inserts only as themself.
drop policy if exists "knight_inserts_pings" on pings;
create policy "knight_inserts_pings" on pings
  for insert with check (
    (select role from profiles where id = auth.uid()) = 'KNIGHT'
    and from_user = auth.uid()
  );

-- Either user can read recent pings (so Princess's Realtime sub fires).
drop policy if exists "pings_authed_select" on pings;
create policy "pings_authed_select" on pings
  for select using (auth.uid() is not null);

-- Make sure Realtime publishes ping inserts (idempotent).
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    if not exists (
      select 1
      from pg_publication_tables
      where pubname = 'supabase_realtime'
        and schemaname = 'public'
        and tablename = 'pings'
    ) then
      execute 'alter publication supabase_realtime add table pings';
    end if;
  end if;
end$$;

create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'debt_type'
  ) then
    create type public.debt_type as enum ('debt_to_me', 'i_owe');
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.debts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type public.debt_type not null,
  counterpart_name text not null,
  amount bigint not null check (amount > 0),
  note text null check (note is null or char_length(note) <= 200),
  due_date date null,
  settled_at timestamptz null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint debts_counterpart_name_not_blank
    check (char_length(trim(counterpart_name)) > 0)
);

create index if not exists debts_user_id_created_at_idx
  on public.debts (user_id, created_at desc);

create index if not exists debts_user_id_type_idx
  on public.debts (user_id, type);

create index if not exists debts_user_id_settled_at_idx
  on public.debts (user_id, settled_at);

drop trigger if exists set_debts_updated_at on public.debts;

create trigger set_debts_updated_at
before update on public.debts
for each row
execute function public.set_updated_at();

alter table public.debts enable row level security;

drop policy if exists "Users can view own debts" on public.debts;
create policy "Users can view own debts"
on public.debts
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own debts" on public.debts;
create policy "Users can insert own debts"
on public.debts
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own debts" on public.debts;
create policy "Users can update own debts"
on public.debts
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own debts" on public.debts;
create policy "Users can delete own debts"
on public.debts
for delete
using (auth.uid() = user_id);

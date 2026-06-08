-- ============================================================
-- EcoRota — Setup completo do banco (rode tudo de uma vez)
-- Supabase → SQL Editor → cole e clique em Run
-- ============================================================

-- 1. Tabela de perfis
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  phone      text,
  cep        text,
  bairro     text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Row Level Security
alter table public.profiles enable row level security;

drop policy if exists "Usuário lê próprio perfil"     on public.profiles;
drop policy if exists "Usuário insere próprio perfil" on public.profiles;
drop policy if exists "Usuário atualiza próprio perfil" on public.profiles;

create policy "Usuário lê próprio perfil"
  on public.profiles for select using (auth.uid() = id);

create policy "Usuário insere próprio perfil"
  on public.profiles for insert with check (auth.uid() = id);

create policy "Usuário atualiza próprio perfil"
  on public.profiles for update using (auth.uid() = id);

-- 3. Trigger: cria perfil automaticamente ao cadastrar
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, cep, bairro)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    nullif(trim(coalesce(new.raw_user_meta_data->>'cep',    '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data->>'bairro', '')), '')
  )
  on conflict (id) do update set
    full_name  = excluded.full_name,
    cep        = excluded.cep,
    bairro     = excluded.bairro,
    updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

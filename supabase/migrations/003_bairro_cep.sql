-- Execute no SQL Editor do Supabase
alter table public.profiles
  add column if not exists cep text,
  add column if not exists bairro text;

-- Atualiza trigger para salvar cep e bairro
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
    nullif(trim(coalesce(new.raw_user_meta_data->>'cep', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data->>'bairro', '')), '')
  )
  on conflict (id) do update set
    cep    = excluded.cep,
    bairro = excluded.bairro;
  return new;
end;
$$;

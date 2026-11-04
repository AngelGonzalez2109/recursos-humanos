-- =====================================================================
-- 01_profiles.sql — Perfiles de usuario y roles (publicador / postulante)
-- Ejecutar en Supabase: SQL Editor > New query > Run
-- =====================================================================

-- 1. Tipo enumerado para los roles
create type public.user_role as enum ('publicador', 'postulante');

-- 2. Tabla de perfiles (1:1 con auth.users)
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  role         public.user_role not null,
  full_name    text not null check (char_length(full_name) between 2 and 120),
  company_name text check (company_name is null or char_length(company_name) <= 120),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

comment on table public.profiles is 'Datos públicos y rol de cada usuario autenticado.';
comment on column public.profiles.company_name is 'Solo aplica a publicadores (empresa reclutadora).';

-- 3. Mantener updated_at al día
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- 4. Crear el perfil automáticamente al registrarse.
--    El frontend envía rol y nombre en supabase.auth.signUp({ options: { data: { role, full_name, company_name } } })
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  meta jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (id, role, full_name, company_name)
  values (
    new.id,
    case
      when meta ->> 'role' in ('publicador', 'postulante')
        then (meta ->> 'role')::public.user_role
      else 'postulante'::public.user_role
    end,
    coalesce(nullif(trim(meta ->> 'full_name'), ''), split_part(new.email, '@', 1)),
    nullif(trim(meta ->> 'company_name'), '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 5. Row Level Security
alter table public.profiles enable row level security;

-- Cada usuario puede leer su propio perfil
create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

-- Cada usuario puede actualizar su propio perfil
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- No hay políticas de INSERT/DELETE: el alta la hace el trigger
-- (security definer) y la baja ocurre en cascada al borrar auth.users.

-- 6. Impedir que un usuario cambie su propio rol (escalada de privilegios):
--    solo se permite actualizar las columnas editables.
revoke update on public.profiles from authenticated, anon;
grant update (full_name, company_name) on public.profiles to authenticated;

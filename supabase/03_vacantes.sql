-- =====================================================================
-- 03_vacantes.sql — Ofertas de trabajo publicadas por los reclutadores
-- Requiere 01_profiles.sql y 02_profiles_grants.sql.
-- Ejecutar en Supabase: SQL Editor > New query > Run
-- =====================================================================

-- 1. Catálogos
create type public.modalidad_trabajo as enum ('presencial', 'remoto', 'hibrido');
create type public.tipo_contrato as enum ('tiempo_completo', 'medio_tiempo', 'temporal', 'practicas');
create type public.estado_vacante as enum ('abierta', 'cerrada');

-- 2. Rol del usuario actual (security definer: profiles solo es legible por su dueño)
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select role from public.profiles where id = (select auth.uid())
$$;

revoke execute on function public.current_user_role() from public, anon;
grant execute on function public.current_user_role() to authenticated;

-- 3. Tabla
create table public.vacantes (
  id             uuid primary key default gen_random_uuid(),
  publicador_id  uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  titulo         text not null check (char_length(titulo) between 3 and 120),
  empresa        text not null check (char_length(empresa) between 2 and 120),
  ubicacion      text not null check (char_length(ubicacion) between 2 and 120),
  modalidad      public.modalidad_trabajo not null,
  tipo_contrato  public.tipo_contrato not null,
  descripcion    text not null check (char_length(descripcion) between 20 and 5000),
  requisitos     text not null check (char_length(requisitos) between 10 and 5000),
  salario_min    numeric(12, 2) check (salario_min is null or salario_min >= 0),
  salario_max    numeric(12, 2) check (salario_max is null or salario_max >= 0),
  moneda         char(3) not null default 'MXN' check (moneda in ('MXN', 'USD', 'EUR')),
  estado         public.estado_vacante not null default 'abierta',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint vacantes_salario_rango check (
    salario_min is null or salario_max is null or salario_max >= salario_min
  )
);

comment on table public.vacantes is 'Ofertas de trabajo. Salario expresado como monto mensual.';

create index vacantes_publicador_idx on public.vacantes (publicador_id, created_at desc);
create index vacantes_abiertas_idx on public.vacantes (created_at desc) where estado = 'abierta';

create trigger vacantes_set_updated_at
  before update on public.vacantes
  for each row execute function public.set_updated_at();

-- 4. Row Level Security
alter table public.vacantes enable row level security;

-- Cualquier usuario autenticado ve las vacantes abiertas; el dueño ve también las cerradas
create policy "vacantes_select"
  on public.vacantes for select
  to authenticated
  using (estado = 'abierta' or publicador_id = (select auth.uid()));

-- Solo publicadores, y siempre a su nombre
create policy "vacantes_insert_publicador"
  on public.vacantes for insert
  to authenticated
  with check (
    publicador_id = (select auth.uid())
    and (select public.current_user_role()) = 'publicador'
  );

-- Solo el dueño puede editar, sin poder transferir la vacante a otro usuario
create policy "vacantes_update_owner"
  on public.vacantes for update
  to authenticated
  using (publicador_id = (select auth.uid()))
  with check (publicador_id = (select auth.uid()));

create policy "vacantes_delete_owner"
  on public.vacantes for delete
  to authenticated
  using (publicador_id = (select auth.uid()));

-- 5. Privilegios (el proyecto no los concede por defecto)
grant select, insert, update, delete on public.vacantes to authenticated;

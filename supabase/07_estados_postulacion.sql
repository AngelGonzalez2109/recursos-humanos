-- =====================================================================
-- 07_estados_postulacion.sql — Seguimiento de postulaciones
-- Requiere 01 a 06. Ejecutar en Supabase: SQL Editor > New query > Run
--  * Estado de cada postulación ("recibida" se asigna sola al postularse).
--  * Solo el publicador de la vacante puede cambiar el estado, y nada más.
--  * El candidato puede leer las vacantes a las que se postuló aunque
--    después se cierren (para "Mis postulaciones").
-- =====================================================================

-- 1. Estado de la postulación
create type public.estado_postulacion as enum (
  'recibida', 'en_revision', 'rechazada', 'pruebas_psicometricas'
);

alter table public.postulaciones
  add column estado     public.estado_postulacion not null default 'recibida',
  add column updated_at timestamptz not null default now();

create trigger postulaciones_set_updated_at
  before update on public.postulaciones
  for each row execute function public.set_updated_at();

create index postulaciones_estado_idx on public.postulaciones (vacante_id, estado);

-- 2. Insertar: el candidato no puede elegir un estado distinto de "recibida"
drop policy "postulaciones_insert_postulante" on public.postulaciones;

create policy "postulaciones_insert_postulante"
  on public.postulaciones for insert
  to authenticated
  with check (
    postulante_id = (select auth.uid())
    and estado = 'recibida'
    and (select public.current_user_role()) = 'postulante'
    and exists (
      select 1 from public.vacantes v
      where v.id = vacante_id and v.estado = 'abierta'
    )
    and cv_path like (select auth.uid())::text || '/%'
  );

-- 3. Actualizar: solo el publicador de la vacante y solo la columna "estado"
create policy "postulaciones_update_estado_publicador"
  on public.postulaciones for update
  to authenticated
  using (
    exists (
      select 1 from public.vacantes v
      where v.id = vacante_id and v.publicador_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.vacantes v
      where v.id = vacante_id and v.publicador_id = (select auth.uid())
    )
  );

grant update (estado) on public.postulaciones to authenticated;

-- 4. Visibilidad de vacantes para quien se postuló.
--    Función security definer: evita la recursión infinita de RLS
--    (postulaciones_select ya consulta vacantes).
create or replace function public.ha_postulado(p_vacante_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.postulaciones
    where vacante_id = p_vacante_id and postulante_id = (select auth.uid())
  )
$$;

revoke execute on function public.ha_postulado(uuid) from public, anon;
grant execute on function public.ha_postulado(uuid) to authenticated;

drop policy "vacantes_select" on public.vacantes;

create policy "vacantes_select"
  on public.vacantes for select
  to authenticated
  using (
    estado = 'abierta'
    or publicador_id = (select auth.uid())
    or (select public.ha_postulado(id))
  );

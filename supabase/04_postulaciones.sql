-- =====================================================================
-- 04_postulaciones.sql — Postulaciones con CV (PDF) + bucket de Storage
-- Requiere 01, 02 y 03. Ejecutar en Supabase: SQL Editor > New query > Run
-- =====================================================================

-- 1. Tabla
create table public.postulaciones (
  id                uuid primary key default gen_random_uuid(),
  vacante_id        uuid not null references public.vacantes (id) on delete cascade,
  postulante_id     uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  postulante_nombre text not null default '',
  cv_path           text not null check (char_length(cv_path) between 5 and 300),
  mensaje           text check (mensaje is null or char_length(mensaje) <= 1000),
  created_at        timestamptz not null default now(),
  constraint postulaciones_unica unique (vacante_id, postulante_id)
);

comment on table public.postulaciones is 'Postulaciones de candidatos a vacantes. cv_path apunta al bucket privado "cvs".';

create index postulaciones_vacante_idx on public.postulaciones (vacante_id, created_at desc);
create index postulaciones_postulante_idx on public.postulaciones (postulante_id);

-- 2. Copia del nombre del candidato (profiles solo es legible por su dueño,
--    así el reclutador puede ver quién se postuló). No depende del frontend.
create or replace function public.postulaciones_set_nombre()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  select full_name into new.postulante_nombre
  from public.profiles where id = new.postulante_id;
  return new;
end;
$$;

create trigger postulaciones_set_nombre
  before insert on public.postulaciones
  for each row execute function public.postulaciones_set_nombre();

-- 3. Row Level Security
alter table public.postulaciones enable row level security;

-- El candidato ve las suyas; el publicador ve las de sus vacantes
create policy "postulaciones_select"
  on public.postulaciones for select
  to authenticated
  using (
    postulante_id = (select auth.uid())
    or exists (
      select 1 from public.vacantes v
      where v.id = vacante_id and v.publicador_id = (select auth.uid())
    )
  )
;

-- Solo postulantes, a su nombre, a vacantes abiertas y con CV en su carpeta
create policy "postulaciones_insert_postulante"
  on public.postulaciones for insert
  to authenticated
  with check (
    postulante_id = (select auth.uid())
    and (select public.current_user_role()) = 'postulante'
    and exists (
      select 1 from public.vacantes v
      where v.id = vacante_id and v.estado = 'abierta'
    )
    and cv_path like (select auth.uid())::text || '/%'
  );

-- Sin UPDATE/DELETE: una postulación no se modifica una vez enviada.
grant select, insert on public.postulaciones to authenticated;

-- 4. Storage: bucket privado, solo PDF, máx. 5 MB
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('cvs', 'cvs', false, 5242880, array['application/pdf'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- Subir: solo postulantes, dentro de su carpeta <uid>/...
create policy "cvs_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'cvs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
    and (select public.current_user_role()) = 'postulante'
  );

-- Leer: el dueño del archivo, o el publicador de la vacante a la que se postuló
create policy "cvs_select_owner_or_publicador"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'cvs'
    and (
      (storage.foldername(name))[1] = (select auth.uid())::text
      or exists (
        select 1
        from public.postulaciones p
        join public.vacantes v on v.id = p.vacante_id
        where p.cv_path = name and v.publicador_id = (select auth.uid())
      )
    )
  );

-- Borrar: solo el dueño (para limpiar si la postulación falla tras subir el CV)
create policy "cvs_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'cvs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

-- =====================================================================
-- 05_match.sql — Datos estructurados para el "Match automático"
-- Requiere 01 a 04. Ejecutar en Supabase: SQL Editor > New query > Run
-- Agrega requisitos estructurados a `vacantes` y el perfil del candidato
-- (snapshot al postularse) a `postulaciones`. Las políticas RLS y los
-- privilegios de ambas tablas no cambian: aplican a las columnas nuevas.
-- =====================================================================

-- 1. Catálogos
create type public.nivel_estudios as enum ('secundaria', 'preparatoria', 'universidad', 'posgrado');
create type public.grado_academico as enum ('tecnico', 'licenciado', 'ingeniero', 'maestro', 'doctor');

-- 2. Validación de etiquetas (habilidades / idiomas): máx. 20, cada una de 2 a 40 caracteres
create or replace function public.etiquetas_validas(tags text[])
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(cardinality(tags), 0) <= 20
     and coalesce((select bool_and(char_length(t) between 2 and 40) from unnest(tags) as t), true)
$$;

-- 3. Requisitos estructurados de la vacante (todos opcionales, excepto habilidades que puede ser vacío)
alter table public.vacantes
  add column edad_min         smallint check (edad_min is null or edad_min between 16 and 99),
  add column edad_max         smallint check (edad_max is null or edad_max between 16 and 99),
  add column nivel_estudios   public.nivel_estudios,
  add column grado_academico  public.grado_academico,
  add column experiencia_anios smallint check (experiencia_anios is null or experiencia_anios between 0 and 60),
  add column habilidades      text[] not null default '{}' check (public.etiquetas_validas(habilidades)),
  add constraint vacantes_edad_rango check (edad_min is null or edad_max is null or edad_max >= edad_min);

-- 4. Perfil del candidato al momento de postularse.
--    Nullable para no romper postulaciones previas a esta migración (obtienen 0 % en los criterios que se exijan).
alter table public.postulaciones
  add column edad              smallint check (edad is null or edad between 16 and 99),
  add column nivel_estudios    public.nivel_estudios,
  add column grado_academico   public.grado_academico,
  add column experiencia_anios smallint check (experiencia_anios is null or experiencia_anios between 0 and 60),
  add column habilidades       text[] not null default '{}' check (public.etiquetas_validas(habilidades));

comment on column public.vacantes.habilidades is 'Habilidades clave e idiomas requeridos (etiquetas).';
comment on column public.postulaciones.edad is 'Edad declarada por el candidato al postularse (snapshot).';

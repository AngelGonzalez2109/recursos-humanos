-- =====================================================================
-- 06_etiquetas.sql — Amplía los límites de las etiquetas de habilidades
-- Requiere 05_match.sql. El catálogo etiquetas_habilidades.json incluye
-- etiquetas de 1 carácter ("C") y de hasta 41 ("Optimización de motores de
-- búsqueda (SEO)"), que el límite original de 2–40 rechazaba.
-- Ejecutar en Supabase: SQL Editor > New query > Run
-- =====================================================================

create or replace function public.etiquetas_validas(tags text[])
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(cardinality(tags), 0) <= 20
     and coalesce((select bool_and(char_length(t) between 1 and 60) from unnest(tags) as t), true)
$$;

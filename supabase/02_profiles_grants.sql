-- =====================================================================
-- 02_profiles_grants.sql — Privilegios de tabla para los roles de la API
-- Este proyecto no otorga privilegios por defecto a anon/authenticated,
-- así que se conceden explícitamente. RLS sigue limitando las filas:
-- cada usuario solo verá y editará SU propio perfil.
-- =====================================================================

grant usage on schema public to authenticated;
grant select on public.profiles to authenticated;
grant update (full_name, company_name) on public.profiles to authenticated;

-- anon (visitantes sin sesión) no recibe ningún privilegio sobre profiles.

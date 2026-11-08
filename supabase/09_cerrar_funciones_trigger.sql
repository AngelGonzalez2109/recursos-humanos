-- =====================================================================
-- 09_cerrar_funciones_trigger.sql — Cierra funciones trigger expuestas por RPC
-- Requiere 01 a 08. Corrige los avisos del linter de Supabase
-- (anon/authenticated_security_definer_function_executable).
--
-- Estas tres funciones solo las invocan triggers; nadie debe llamarlas
-- por /rest/v1/rpc. Postgres no comprueba EXECUTE al disparar un trigger
-- (solo al crearlo), así que revocarlo no afecta al registro de usuarios,
-- a la copia del nombre en postulaciones ni a la activación de RLS.
-- Ejecutar en Supabase: SQL Editor > New query > Run
-- =====================================================================

revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.postulaciones_set_nombre() from public, anon, authenticated;
revoke execute on function public.rls_auto_enable() from public, anon, authenticated;

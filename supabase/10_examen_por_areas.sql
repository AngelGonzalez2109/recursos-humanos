-- =====================================================================
-- 10_examen_por_areas.sql — Examen psicométrico por áreas (versión 2)
-- Requiere 01 a 09. Reemplaza el examen global de 30 preguntas (versión 1).
--
-- * El reclutador elige las "áreas a evaluar" de cada vacante
--   (vacantes.areas_evaluacion).
-- * Al comenzar, la base de datos elige 10 preguntas al azar por área y las
--   guarda (examen_intentos): así el candidato no puede escoger preguntas y
--   recargar no cambia el examen. Tiempo: 5 minutos por área.
-- * Las claves de respuesta viven SOLO aquí (examen_claves, sin acceso para
--   anon/authenticated); el JSON del front no las contiene.
-- * Un único intento por postulación y solo en el estado
--   "pruebas_psicometricas". El candidato nunca ve su puntaje.
-- * Los resultados de la versión 1 se conservan (no se borra nada).
-- Si cambias preguntas o claves, sube la versión (v_version) y el JSON.
-- =====================================================================

-- 1. Áreas por vacante
create or replace function public.areas_evaluacion_validas(p_areas text[])
returns boolean
language sql
immutable
set search_path = ''
as $$
  select p_areas is not null
    and p_areas <@ array['logico','numerico','verbal','espacial','atencion','personalidad',
                         'situacional','liderazgo','presion','integridad','empatia']::text[]
    and cardinality(p_areas) = (select count(distinct a) from unnest(p_areas) a)
$$;

alter table public.vacantes
  add column areas_evaluacion text[] not null default '{}'
  constraint vacantes_areas_evaluacion_check check (public.areas_evaluacion_validas(areas_evaluacion));

comment on column public.vacantes.areas_evaluacion is
  'Áreas del banco psicométrico que se evalúan a los candidatos de esta vacante (10 preguntas al azar por área).';

-- 2. Claves de respuesta (sin ningún privilegio para anon/authenticated)
create table public.examen_claves (
  id        text primary key,
  area      text not null,
  clave     text check (clave ~ '^[a-d]$'),
  opciones  smallint check (opciones in (3, 4)),
  invertido boolean not null default false,
  constraint examen_claves_area_check check (public.areas_evaluacion_validas(array[area])),
  constraint examen_claves_tipo_check check (
    (area = 'personalidad' and clave is null and opciones is null)
    or (area <> 'personalidad' and clave is not null and opciones is not null)
  )
);

alter table public.examen_claves enable row level security;
revoke all on public.examen_claves from anon, authenticated;

comment on table public.examen_claves is
  'Clave de respuestas del banco (versión 2). Solo la leen las funciones security definer.';

insert into public.examen_claves (id, area, clave, opciones, invertido) values
  ('LOG-01', 'logico', 'c', 4, false),
  ('LOG-02', 'logico', 'b', 4, false),
  ('LOG-03', 'logico', 'd', 4, false),
  ('LOG-04', 'logico', 'c', 4, false),
  ('LOG-05', 'logico', 'c', 4, false),
  ('LOG-06', 'logico', 'b', 4, false),
  ('LOG-07', 'logico', 'c', 4, false),
  ('LOG-08', 'logico', 'a', 4, false),
  ('LOG-09', 'logico', 'd', 4, false),
  ('LOG-10', 'logico', 'b', 4, false),
  ('LOG-11', 'logico', 'c', 4, false),
  ('LOG-12', 'logico', 'b', 4, false),
  ('LOG-13', 'logico', 'c', 4, false),
  ('LOG-14', 'logico', 'a', 4, false),
  ('LOG-15', 'logico', 'a', 4, false),
  ('NUM-01', 'numerico', 'c', 4, false),
  ('NUM-02', 'numerico', 'b', 4, false),
  ('NUM-03', 'numerico', 'b', 4, false),
  ('NUM-04', 'numerico', 'c', 4, false),
  ('NUM-05', 'numerico', 'c', 4, false),
  ('NUM-06', 'numerico', 'b', 4, false),
  ('NUM-07', 'numerico', 'd', 4, false),
  ('NUM-08', 'numerico', 'b', 4, false),
  ('NUM-09', 'numerico', 'c', 4, false),
  ('NUM-10', 'numerico', 'c', 4, false),
  ('NUM-11', 'numerico', 'd', 4, false),
  ('NUM-12', 'numerico', 'b', 4, false),
  ('NUM-13', 'numerico', 'c', 4, false),
  ('NUM-14', 'numerico', 'c', 4, false),
  ('NUM-15', 'numerico', 'c', 4, false),
  ('VER-01', 'verbal', 'a', 3, false),
  ('VER-02', 'verbal', 'b', 3, false),
  ('VER-03', 'verbal', 'b', 3, false),
  ('VER-04', 'verbal', 'a', 3, false),
  ('VER-05', 'verbal', 'b', 3, false),
  ('VER-06', 'verbal', 'b', 3, false),
  ('VER-07', 'verbal', 'a', 3, false),
  ('VER-08', 'verbal', 'b', 3, false),
  ('VER-09', 'verbal', 'b', 3, false),
  ('VER-10', 'verbal', 'b', 3, false),
  ('VER-11', 'verbal', 'a', 3, false),
  ('VER-12', 'verbal', 'c', 3, false),
  ('VER-13', 'verbal', 'b', 3, false),
  ('VER-14', 'verbal', 'b', 3, false),
  ('VER-15', 'verbal', 'a', 3, false),
  ('ESP-01', 'espacial', 'b', 4, false),
  ('ESP-02', 'espacial', 'b', 4, false),
  ('ESP-03', 'espacial', 'd', 4, false),
  ('ESP-04', 'espacial', 'a', 4, false),
  ('ESP-05', 'espacial', 'b', 4, false),
  ('ESP-06', 'espacial', 'b', 4, false),
  ('ESP-07', 'espacial', 'b', 4, false),
  ('ESP-08', 'espacial', 'a', 4, false),
  ('ESP-09', 'espacial', 'a', 4, false),
  ('ESP-10', 'espacial', 'b', 4, false),
  ('ESP-11', 'espacial', 'b', 4, false),
  ('ESP-12', 'espacial', 'a', 4, false),
  ('ESP-13', 'espacial', 'c', 4, false),
  ('ESP-14', 'espacial', 'b', 4, false),
  ('ESP-15', 'espacial', 'a', 4, false),
  ('ATE-01', 'atencion', 'c', 4, false),
  ('ATE-02', 'atencion', 'c', 4, false),
  ('ATE-03', 'atencion', 'c', 4, false),
  ('ATE-04', 'atencion', 'c', 4, false),
  ('ATE-05', 'atencion', 'c', 4, false),
  ('ATE-06', 'atencion', 'd', 4, false),
  ('ATE-07', 'atencion', 'b', 4, false),
  ('ATE-08', 'atencion', 'b', 4, false),
  ('ATE-09', 'atencion', 'c', 4, false),
  ('ATE-10', 'atencion', 'c', 4, false),
  ('ATE-11', 'atencion', 'c', 4, false),
  ('ATE-12', 'atencion', 'b', 4, false),
  ('ATE-13', 'atencion', 'a', 4, false),
  ('ATE-14', 'atencion', 'd', 4, false),
  ('ATE-15', 'atencion', 'c', 4, false),
  ('B5-01', 'personalidad', null, null, false),
  ('B5-02', 'personalidad', null, null, false),
  ('B5-03', 'personalidad', null, null, true),
  ('B5-04', 'personalidad', null, null, false),
  ('B5-05', 'personalidad', null, null, false),
  ('B5-06', 'personalidad', null, null, true),
  ('B5-07', 'personalidad', null, null, false),
  ('B5-08', 'personalidad', null, null, false),
  ('B5-09', 'personalidad', null, null, true),
  ('B5-10', 'personalidad', null, null, false),
  ('B5-11', 'personalidad', null, null, false),
  ('B5-12', 'personalidad', null, null, true),
  ('B5-13', 'personalidad', null, null, false),
  ('B5-14', 'personalidad', null, null, false),
  ('B5-15', 'personalidad', null, null, true),
  ('SJT-01', 'situacional', 'b', 3, false),
  ('SJT-02', 'situacional', 'a', 3, false),
  ('SJT-03', 'situacional', 'c', 3, false),
  ('SJT-04', 'situacional', 'b', 3, false),
  ('SJT-05', 'situacional', 'a', 3, false),
  ('SJT-06', 'situacional', 'c', 3, false),
  ('SJT-07', 'situacional', 'b', 3, false),
  ('SJT-08', 'situacional', 'a', 3, false),
  ('SJT-09', 'situacional', 'c', 3, false),
  ('SJT-10', 'situacional', 'b', 3, false),
  ('SJT-11', 'situacional', 'a', 3, false),
  ('SJT-12', 'situacional', 'c', 3, false),
  ('SJT-13', 'situacional', 'b', 3, false),
  ('SJT-14', 'situacional', 'a', 3, false),
  ('SJT-15', 'situacional', 'c', 3, false),
  ('LID-01', 'liderazgo', 'b', 3, false),
  ('LID-02', 'liderazgo', 'a', 3, false),
  ('LID-03', 'liderazgo', 'c', 3, false),
  ('LID-04', 'liderazgo', 'b', 3, false),
  ('LID-05', 'liderazgo', 'a', 3, false),
  ('LID-06', 'liderazgo', 'c', 3, false),
  ('LID-07', 'liderazgo', 'b', 3, false),
  ('LID-08', 'liderazgo', 'a', 3, false),
  ('LID-09', 'liderazgo', 'c', 3, false),
  ('LID-10', 'liderazgo', 'b', 3, false),
  ('LID-11', 'liderazgo', 'a', 3, false),
  ('LID-12', 'liderazgo', 'c', 3, false),
  ('LID-13', 'liderazgo', 'b', 3, false),
  ('LID-14', 'liderazgo', 'a', 3, false),
  ('LID-15', 'liderazgo', 'c', 3, false),
  ('PRE-01', 'presion', 'a', 3, false),
  ('PRE-02', 'presion', 'b', 3, false),
  ('PRE-03', 'presion', 'c', 3, false),
  ('PRE-04', 'presion', 'a', 3, false),
  ('PRE-05', 'presion', 'b', 3, false),
  ('PRE-06', 'presion', 'c', 3, false),
  ('PRE-07', 'presion', 'a', 3, false),
  ('PRE-08', 'presion', 'b', 3, false),
  ('PRE-09', 'presion', 'c', 3, false),
  ('PRE-10', 'presion', 'a', 3, false),
  ('PRE-11', 'presion', 'b', 3, false),
  ('PRE-12', 'presion', 'c', 3, false),
  ('PRE-13', 'presion', 'a', 3, false),
  ('PRE-14', 'presion', 'b', 3, false),
  ('PRE-15', 'presion', 'c', 3, false),
  ('INT-01', 'integridad', 'b', 3, false),
  ('INT-02', 'integridad', 'a', 3, false),
  ('INT-03', 'integridad', 'c', 3, false),
  ('INT-04', 'integridad', 'b', 3, false),
  ('INT-05', 'integridad', 'a', 3, false),
  ('INT-06', 'integridad', 'c', 3, false),
  ('INT-07', 'integridad', 'b', 3, false),
  ('INT-08', 'integridad', 'a', 3, false),
  ('INT-09', 'integridad', 'c', 3, false),
  ('INT-10', 'integridad', 'b', 3, false),
  ('INT-11', 'integridad', 'a', 3, false),
  ('INT-12', 'integridad', 'c', 3, false),
  ('INT-13', 'integridad', 'b', 3, false),
  ('INT-14', 'integridad', 'a', 3, false),
  ('INT-15', 'integridad', 'c', 3, false),
  ('EMO-01', 'empatia', 'a', 3, false),
  ('EMO-02', 'empatia', 'b', 3, false),
  ('EMO-03', 'empatia', 'c', 3, false),
  ('EMO-04', 'empatia', 'a', 3, false),
  ('EMO-05', 'empatia', 'b', 3, false),
  ('EMO-06', 'empatia', 'c', 3, false),
  ('EMO-07', 'empatia', 'a', 3, false),
  ('EMO-08', 'empatia', 'b', 3, false),
  ('EMO-09', 'empatia', 'c', 3, false),
  ('EMO-10', 'empatia', 'a', 3, false),
  ('EMO-11', 'empatia', 'b', 3, false),
  ('EMO-12', 'empatia', 'c', 3, false),
  ('EMO-13', 'empatia', 'a', 3, false),
  ('EMO-14', 'empatia', 'b', 3, false),
  ('EMO-15', 'empatia', 'c', 3, false);

-- 3. Examen asignado a cada postulación (preguntas elegidas al azar al comenzar)
create table public.examen_intentos (
  postulacion_id uuid primary key references public.postulaciones (id) on delete cascade,
  areas          text[] not null,
  preguntas      text[] not null,
  iniciado_en    timestamptz not null default now(),
  duracion_seg   integer not null check (duracion_seg > 0)
);

alter table public.examen_intentos enable row level security;
revoke all on public.examen_intentos from anon, authenticated;

-- 4. Resultados: columnas nuevas (las filas de la versión 1 quedan intactas)
alter table public.resultados_psicometricos
  drop constraint if exists resultados_psicometricos_respondidas_check;
alter table public.resultados_psicometricos
  add constraint resultados_psicometricos_respondidas_check check (respondidas >= 0),
  add column areas text[],
  add column total_preguntas smallint,
  add column dispositivo text check (dispositivo in ('movil', 'tablet', 'escritorio'));

comment on column public.resultados_psicometricos.puntajes is
  'Versión 1: porcentaje por dimensión. Versión 2: porcentaje 0-100 por área (null si no hubo respuestas).';

-- 5. Inicio / consulta de la sesión de examen
create or replace function public.examen_psicometrico_sesion(
  p_postulacion_id uuid,
  p_iniciar boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  c_por_area  constant int := 10;
  c_seg_area  constant int := 300;
  c_orden     constant text[] := array['logico','numerico','verbal','espacial','atencion','personalidad',
                                       'situacional','liderazgo','presion','integridad','empatia'];
  v_uid       uuid := (select auth.uid());
  v_estado    public.estado_postulacion;
  v_areas     text[];
  v_preguntas text[];
  v_intento   public.examen_intentos;
begin
  select p.estado, v.areas_evaluacion into v_estado, v_areas
  from public.postulaciones p
  join public.vacantes v on v.id = p.vacante_id
  where p.id = p_postulacion_id and p.postulante_id = v_uid;

  if not found then
    raise exception 'Postulación no encontrada' using errcode = '42501';
  end if;
  if v_estado <> 'pruebas_psicometricas' then
    raise exception 'La evaluación no está habilitada para esta postulación' using errcode = '42501';
  end if;
  if exists (select 1 from public.resultados_psicometricos where postulacion_id = p_postulacion_id) then
    raise exception 'La evaluación ya fue enviada' using errcode = '23505';
  end if;

  select * into v_intento from public.examen_intentos where postulacion_id = p_postulacion_id;

  if not found then
    if not p_iniciar then
      return null;
    end if;
    if coalesce(cardinality(v_areas), 0) = 0 then
      raise exception 'El reclutador aún no definió las áreas de evaluación' using errcode = '22023';
    end if;

    select array_agg(a order by array_position(c_orden, a)) into v_areas from unnest(v_areas) a;

    select array_agg(s.id order by array_position(v_areas, s.area), s.rn) into v_preguntas
    from (
      select c.id, c.area, row_number() over (partition by c.area order by random()) as rn
      from public.examen_claves c
      where c.area = any (v_areas)
    ) s
    where s.rn <= c_por_area;

    insert into public.examen_intentos (postulacion_id, areas, preguntas, duracion_seg)
    values (p_postulacion_id, v_areas, v_preguntas, cardinality(v_areas) * c_seg_area)
    on conflict (postulacion_id) do nothing;

    select * into v_intento from public.examen_intentos where postulacion_id = p_postulacion_id;
  end if;

  return jsonb_build_object(
    'areas', v_intento.areas,
    'preguntas', v_intento.preguntas,
    'iniciado_en', v_intento.iniciado_en,
    'duracion_seg', v_intento.duracion_seg,
    'ahora', now()
  );
end;
$$;

revoke execute on function public.examen_psicometrico_sesion(uuid, boolean) from public, anon;
grant execute on function public.examen_psicometrico_sesion(uuid, boolean) to authenticated;

-- 6. Envío y puntuación (reemplaza la función de la versión 1)
drop function if exists public.enviar_examen_psicometrico(uuid, jsonb, boolean);

create or replace function public.enviar_examen_psicometrico(
  p_postulacion_id uuid,
  p_respuestas jsonb,
  p_por_tiempo boolean default false,
  p_dispositivo text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_version   constant smallint := 2;
  v_uid       uuid := (select auth.uid());
  v_estado    public.estado_postulacion;
  v_intento   public.examen_intentos;
  v_resp      record;
  v_c         public.examen_claves;
  v_area      text;
  v_aciertos  int;
  v_total     int;
  v_n         int;
  v_suma      int;
  v_puntajes  jsonb := '{}'::jsonb;
begin
  select p.estado into v_estado
  from public.postulaciones p
  where p.id = p_postulacion_id and p.postulante_id = v_uid;

  if not found then
    raise exception 'Postulación no encontrada' using errcode = '42501';
  end if;
  if v_estado <> 'pruebas_psicometricas' then
    raise exception 'La evaluación no está habilitada para esta postulación' using errcode = '42501';
  end if;

  select * into v_intento from public.examen_intentos where postulacion_id = p_postulacion_id;
  if not found then
    raise exception 'La evaluación no se ha iniciado' using errcode = '42501';
  end if;

  if p_respuestas is null or jsonb_typeof(p_respuestas) <> 'object' then
    raise exception 'Formato de respuestas inválido' using errcode = '22023';
  end if;

  -- Solo preguntas asignadas a este examen, con una respuesta válida para su tipo
  for v_resp in select key, value from jsonb_each_text(p_respuestas) loop
    select * into v_c from public.examen_claves where id = v_resp.key;
    if not found or not (v_resp.key = any (v_intento.preguntas)) then
      raise exception 'Pregunta no incluida en tu evaluación: %', v_resp.key using errcode = '22023';
    end if;
    if v_c.opciones is null then
      if v_resp.value !~ '^[1-5]$' then
        raise exception 'Respuesta inválida: %', v_resp.key using errcode = '22023';
      end if;
    elsif v_resp.value !~ ('^[a-' || chr(96 + v_c.opciones) || ']$') then
      raise exception 'Respuesta inválida: %', v_resp.key using errcode = '22023';
    end if;
  end loop;

  foreach v_area in array v_intento.areas loop
    if v_area = 'personalidad' then
      -- Escala de acuerdo: (suma - n) / (4n) * 100 sobre los ítems respondidos; los inversos puntúan 6 - valor
      select count(*),
             coalesce(sum(case when c.invertido then 6 - r.value::int else r.value::int end), 0)
      into v_n, v_suma
      from jsonb_each_text(p_respuestas) r
      join public.examen_claves c on c.id = r.key
      where c.area = v_area;

      v_puntajes := v_puntajes || jsonb_build_object(
        v_area,
        case when v_n = 0 then null else round((v_suma - v_n) * 100.0 / (4 * v_n)) end
      );
    else
      -- Aciertos sobre las preguntas asignadas del área (las omitidas cuentan como incorrectas)
      select count(*) into v_aciertos
      from jsonb_each_text(p_respuestas) r
      join public.examen_claves c on c.id = r.key
      where c.area = v_area and c.clave = r.value;

      select count(*) into v_total
      from public.examen_claves c
      where c.area = v_area and c.id = any (v_intento.preguntas);

      v_puntajes := v_puntajes || jsonb_build_object(v_area, round(v_aciertos * 100.0 / v_total));
    end if;
  end loop;

  -- unique(postulacion_id) garantiza un único intento (error 23505 si se repite)
  insert into public.resultados_psicometricos
    (postulacion_id, version, respuestas, puntajes, respondidas, por_tiempo, areas, total_preguntas, dispositivo)
  values
    (p_postulacion_id, v_version, p_respuestas, v_puntajes,
     (select count(*) from jsonb_object_keys(p_respuestas)), coalesce(p_por_tiempo, false),
     v_intento.areas, cardinality(v_intento.preguntas),
     case when p_dispositivo in ('movil', 'tablet', 'escritorio') then p_dispositivo end);
end;
$$;

revoke execute on function public.enviar_examen_psicometrico(uuid, jsonb, boolean, text) from public, anon;
grant execute on function public.enviar_examen_psicometrico(uuid, jsonb, boolean, text) to authenticated;

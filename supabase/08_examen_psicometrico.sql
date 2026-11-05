-- =====================================================================
-- 08_examen_psicometrico.sql — Evaluación de Perfil Profesional
-- Requiere 01 a 07. Ejecutar en Supabase: SQL Editor > New query > Run
--
-- * Las preguntas viven en examen_psicometrico.json (sin respuestas).
--   La clave de puntuación vive SOLO aquí, en la función de Postgres, para
--   que el candidato no pueda verla ni manipular su puntaje.
-- * Un único intento por postulación (unique) y solo si la postulación está
--   en el estado "pruebas_psicometricas".
-- * El candidato no puede leer ni escribir la tabla: envía sus respuestas
--   con enviar_examen_psicometrico() y nunca ve el puntaje.
-- * El reclutador de la vacante lee el resultado.
-- Si cambias preguntas o clave, sube la versión (v_version) y el JSON.
-- =====================================================================

-- 1. Tabla de resultados
create table public.resultados_psicometricos (
  id             uuid primary key default gen_random_uuid(),
  postulacion_id uuid not null unique references public.postulaciones (id) on delete cascade,
  version        smallint not null,
  respuestas     jsonb not null,
  puntajes       jsonb not null,
  respondidas    smallint not null check (respondidas between 0 and 30),
  por_tiempo     boolean not null default false,
  created_at     timestamptz not null default now()
);

comment on table public.resultados_psicometricos is
  'Resultado de la Evaluación de Perfil Profesional. puntajes: porcentaje 0-100 por dimensión (null si no hubo respuestas).';

-- 2. RLS: solo lectura para el publicador de la vacante. Sin políticas ni privilegios de escritura:
--    el único camino de escritura es la función security definer de abajo.
alter table public.resultados_psicometricos enable row level security;

create policy "resultados_select_publicador"
  on public.resultados_psicometricos for select
  to authenticated
  using (
    exists (
      select 1
      from public.postulaciones p
      join public.vacantes v on v.id = p.vacante_id
      where p.id = postulacion_id and v.publicador_id = (select auth.uid())
    )
  );

grant select on public.resultados_psicometricos to authenticated;

-- 3. Envío y puntuación
create or replace function public.enviar_examen_psicometrico(
  p_postulacion_id uuid,
  p_respuestas jsonb,
  p_por_tiempo boolean default false
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_version   constant smallint := 1;
  v_logica    constant jsonb := '{"L01":"b","L02":"c","L03":"c","L04":"d","L05":"a","L06":"c","L07":"c","L08":"c","L09":"b","L10":"c"}';
  v_likert    constant jsonb := '{"P01":"adaptabilidad","P02":"trabajo_equipo","P03":"liderazgo","P04":"tolerancia_estres","P05":"adaptabilidad","P06":"trabajo_equipo","P07":"liderazgo","P08":"tolerancia_estres","P09":"adaptabilidad","P10":"trabajo_equipo","P11":"liderazgo","P12":"tolerancia_estres","P13":"adaptabilidad","P14":"trabajo_equipo","P15":"liderazgo","P16":"tolerancia_estres","P17":"adaptabilidad","P18":"trabajo_equipo","P19":"liderazgo","P20":"tolerancia_estres"}';
  v_inversas  constant text[] := array['P05', 'P06', 'P08', 'P11', 'P17', 'P20'];
  v_dims      constant text[] := array['adaptabilidad', 'liderazgo', 'tolerancia_estres', 'trabajo_equipo'];
  v_uid       uuid := (select auth.uid());
  v_estado    public.estado_postulacion;
  v_resp      record;
  v_dim       text;
  v_aciertos  int;
  v_n         int;
  v_suma      int;
  v_puntajes  jsonb;
begin
  -- Solo el dueño de la postulación y solo en el estado de pruebas psicométricas
  select p.estado into v_estado
  from public.postulaciones p
  where p.id = p_postulacion_id and p.postulante_id = v_uid;

  if not found then
    raise exception 'Postulación no encontrada' using errcode = '42501';
  end if;
  if v_estado <> 'pruebas_psicometricas' then
    raise exception 'La evaluación no está habilitada para esta postulación' using errcode = '42501';
  end if;

  -- Validar formato de las respuestas
  if p_respuestas is null or jsonb_typeof(p_respuestas) <> 'object' then
    raise exception 'Formato de respuestas inválido' using errcode = '22023';
  end if;

  for v_resp in select key, value from jsonb_each_text(p_respuestas) loop
    if v_logica ? v_resp.key then
      if v_resp.value not in ('a', 'b', 'c', 'd') then
        raise exception 'Respuesta inválida: %', v_resp.key using errcode = '22023';
      end if;
    elsif v_likert ? v_resp.key then
      if v_resp.value !~ '^[1-5]$' then
        raise exception 'Respuesta inválida: %', v_resp.key using errcode = '22023';
      end if;
    else
      raise exception 'Pregunta desconocida: %', v_resp.key using errcode = '22023';
    end if;
  end loop;

  -- Lógica: aciertos sobre el total de preguntas (las omitidas cuentan como incorrectas)
  select count(*) into v_aciertos
  from jsonb_each_text(p_respuestas) r
  where v_logica ->> r.key = r.value;

  v_puntajes := jsonb_build_object('logica', round(v_aciertos * 100.0 / 10));

  -- Likert: (suma - n) / (4n) * 100 sobre los ítems respondidos; ítems inversos puntúan 6 - valor
  foreach v_dim in array v_dims loop
    select count(*), coalesce(sum(case when r.key = any (v_inversas) then 6 - r.value::int else r.value::int end), 0)
    into v_n, v_suma
    from jsonb_each_text(p_respuestas) r
    where v_likert ->> r.key = v_dim;

    v_puntajes := v_puntajes || jsonb_build_object(
      v_dim,
      case when v_n = 0 then null else round((v_suma - v_n) * 100.0 / (4 * v_n)) end
    );
  end loop;

  -- La restricción unique(postulacion_id) garantiza un único intento (error 23505 si se repite)
  insert into public.resultados_psicometricos
    (postulacion_id, version, respuestas, puntajes, respondidas, por_tiempo)
  values
    (p_postulacion_id, v_version, p_respuestas, v_puntajes, (select count(*) from jsonb_object_keys(p_respuestas)), coalesce(p_por_tiempo, false));
end;
$$;

revoke execute on function public.enviar_examen_psicometrico(uuid, jsonb, boolean) from public, anon;
grant execute on function public.enviar_examen_psicometrico(uuid, jsonb, boolean) to authenticated;

-- 4. Ids de las postulaciones del candidato cuya evaluación ya envió (sin exponer puntajes)
create or replace function public.examenes_completados()
returns uuid[]
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(array_agg(r.postulacion_id), '{}'::uuid[])
  from public.resultados_psicometricos r
  join public.postulaciones p on p.id = r.postulacion_id
  where p.postulante_id = (select auth.uid())
$$;

revoke execute on function public.examenes_completados() from public, anon;
grant execute on function public.examenes_completados() to authenticated;

-- 11. Rechaza respuestas nulas en enviar_examen_psicometrico.
-- jsonb_each_text devuelve NULL para un JSON null y `NULL !~ '...'` da NULL (no true),
-- así que la validación no se disparaba y la respuesta contaba como respondida.
-- Solo cambia la validación; el resto de la función es idéntico a la migración 10.

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
      if v_resp.value is null or v_resp.value !~ '^[1-5]$' then
        raise exception 'Respuesta inválida: %', v_resp.key using errcode = '22023';
      end if;
    elsif v_resp.value is null or v_resp.value !~ ('^[a-' || chr(96 + v_c.opciones) || ']$') then
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

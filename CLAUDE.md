# ESTRUCTURA DE COMUNICACIÓN, ARQUITECTURA Y REGLAS DEL PROYECTO
**Nombre del Proyecto:** Plataforma de Recursos Humanos y Vacantes
**Objetivo:** Desarrollar una aplicación web para la gestión de ofertas de trabajo, conectando a reclutadores (publicadores) con candidatos (postulantes).

## 1. ROLES Y FLUJOS DE USUARIO
La aplicación debe manejar autenticación y diferenciar estrictamente entre dos tipos de usuarios:
*   **Publicador (Reclutador):**
    *   Inicio de sesión / Registro.
    *   Acceso a un panel (Dashboard) de administración.
    *   Interfaz con un formulario intuitivo para ingresar los datos del puesto (título, descripción, requisitos, salario, etc.).
    *   Al guardar, la vacante se publica y se inserta automáticamente en la base de datos.
    *   Editar, cerrar y reabrir sus vacantes (sección 9).
    *   Ver los candidatos de cada vacante **ordenados de mayor a menor compatibilidad** (match automático, sección 7), abrir su CV y cambiar el estado de la postulación con confirmación (sección 8).
*   **Postulante (Candidato):**
    *   Inicio de sesión / Registro.
    *   Feed principal para visualizar las vacantes disponibles.
    *   Opción para ver el detalle completo de cada vacante.
    *   Funcionalidad para postularse subiendo su CV (archivo PDF) y declarando su perfil (edad, estudios, experiencia, habilidades) para el match.
    *   Sección "Mis postulaciones" para consultar el estado de cada solicitud (sección 8.4).

## 2. STACK TECNOLÓGICO Y HERRAMIENTAS
*   **Frontend:** React (SPA), Vite, TypeScript.
*   **Estilos:** Tailwind CSS.
*   **Enrutamiento:** React Router DOM.
*   **Backend as a Service (BaaS):** Supabase.
    *   *Supabase Auth:* Para registro y login de usuarios.
    *   *Supabase Database (PostgreSQL):* Para almacenar perfiles, vacantes y postulaciones.
    *   *Supabase Storage:* Para el almacenamiento y recuperación de los CVs en formato PDF.
*   **Despliegue:** Vercel (conectado a GitHub).

## 3. UI/UX Y DISEÑO VISUAL
*   **Estilo:** Profesional, serio, corporativo y limpio.
*   **Paleta de colores:** Tonos de confianza (azules, grises oscuros, blancos, contrastes sutiles).
*   **Interacciones:** Interfaces altamente intuitivas. Uso de animaciones sutiles mediante las clases de transición de Tailwind (fade-ins, hover states suaves, skeleton loaders durante la carga de datos) sin sobrecargar la vista.
*   **Componentes:** Minimalistas, con bordes redondeados suaves, sombras ligeras para dar profundidad (cards) y tipografía legible (sans-serif).

## 4. ESTRUCTURA DE DIRECTORIOS (ARQUITECTURA)
Claude Code debe organizar el código fuente (`src/`) de la siguiente manera:
*   `/assets`: Imágenes estáticas y logos.
*   `/components`: Componentes reutilizables de UI (Botones, Inputs, Cards, Modales).
*   `/pages` o `/views`: Pantallas completas mapeadas a las rutas (Home, Login, Dashboard, Vacantes).
*   `/lib` o `/services`: Configuración centralizada de Supabase (`supabaseClient.ts`) y lógica de llamadas a la API.
*   `/types`: Definiciones de interfaces y tipos de TypeScript para la base de datos y estados.
*   `/hooks`: Custom hooks de React para encapsular lógica (ej. `useAuth`, `useVacantes`).

## 5. REGLAS ESTRICTAS DE DESARROLLO PARA CLAUDE CODE
1.  **Conexión Backend:** Utilizar siempre las variables de entorno `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para instanciar el cliente de Supabase. Nunca inventar credenciales ni quemarlas en el código.
2.  **Seguridad RLS:** Antes de crear el frontend de una nueva tabla, debes generar el script SQL necesario para crear la tabla en PostgreSQL con las políticas de Row Level Security (RLS) habilitadas.
3.  **Código Limpio:** Usar componentes funcionales de React, React Hooks y TypeScript estricto. No utilizar clases.
4.  **Modularidad:** Evitar componentes monolíticos. Si un archivo supera las 150 líneas, evaluar su división en subcomponentes.
5.  **Gestión de Archivos:** Las postulaciones requieren la subida de archivos (CVs). Utilizar los métodos oficiales de Supabase Storage (upload) gestionando correctamente los estados de carga y los errores (try/catch).
6.  **Paso a paso:** Al recibir una instrucción de desarrollo, primero analiza la base de datos necesaria, crea los tipos en TS, luego la lógica de conexión, y finalmente la interfaz gráfica de Tailwind.

## 6. ESTADO ACTUAL Y MIGRACIONES SQL
Ejecutar en Supabase (SQL Editor) **en orden**; cada archivo asume los anteriores:
1.  `supabase/01_profiles.sql` — perfiles y roles (`publicador` / `postulante`).
2.  `supabase/02_profiles_grants.sql` — privilegios de `profiles`.
3.  `supabase/03_vacantes.sql` — tabla `vacantes` + RLS.
4.  `supabase/04_postulaciones.sql` — tabla `postulaciones` + bucket privado `cvs` (solo PDF, máx. 5 MB) + RLS.
5.  `supabase/05_match.sql` — campos estructurados del Match automático (sección 7).
6.  `supabase/06_etiquetas.sql` — amplía el límite de cada etiqueta de habilidad a 1–60 caracteres (el catálogo incluye "C" y etiquetas de 41 caracteres).
7.  `supabase/07_estados_postulacion.sql` — estado de cada postulación, política de UPDATE para el publicador y lectura de vacantes para quien se postuló (sección 8).
8.  `supabase/08_examen_psicometrico.sql` — tabla `resultados_psicometricos`, funciones de envío/puntuación y clave de respuestas (sección 11).

Este proyecto **no concede privilegios por defecto** a `anon`/`authenticated`: toda tabla nueva necesita `grant` explícito además de RLS.

## 7. SISTEMA DE MATCH AUTOMÁTICO

### 7.1 Campos en la base de datos
**`vacantes` (requisitos; todos opcionales):**
| Columna | Tipo | Regla |
|---|---|---|
| `edad_min`, `edad_max` | `smallint` | 16–99; `edad_max >= edad_min` |
| `nivel_estudios` | enum `nivel_estudios` | `secundaria` < `preparatoria` < `universidad` < `posgrado` |
| `grado_academico` | enum `grado_academico` | `tecnico`, `licenciado`, `ingeniero`, `maestro`, `doctor` |
| `experiencia_anios` | `smallint` | 0–60 |
| `habilidades` | `text[]` (default `{}`) | Habilidades clave e idiomas; máx. 20 etiquetas de 1–60 caracteres (`etiquetas_validas()`, ajustada en la migración 06) |

**`postulaciones` (perfil del candidato, *snapshot* al postularse):** `edad` (16–99), `nivel_estudios`, `grado_academico`, `experiencia_anios` (0–60), `habilidades` (`text[]`). Son nullable solo para no romper postulaciones anteriores a la migración 05; el formulario exige edad, nivel de estudios y experiencia. Las políticas RLS no cambiaron (el publicador solo ve las postulaciones de sus vacantes).

### 7.2 Flujo de formularios
*   **Reclutador — "Publicar vacante"** (`VacanteForm`): bloque "Perfil buscado" con edad mínima/máxima (numéricos), nivel de estudios y grado académico (listas con opción "Sin requisito"), años de experiencia (numérico) y habilidades/idiomas (autocompletado multi-selección, `TagInput`). Todo es opcional.
*   **Candidato — "Postularme"** (`PostulacionForm`): CV en PDF + bloque "Tu perfil" con los mismos campos (`PerfilFields` en modo `candidato`). Edad, nivel de estudios y experiencia son obligatorios; grado ("Ninguno") y habilidades son opcionales. Los datos se guardan en la propia postulación (no en `profiles`).
*   **Catálogo de habilidades:** `etiquetas_habilidades.json` (raíz del proyecto, arreglo de strings) se importa en `src/lib/perfilOptions.ts` como `HABILIDADES_CATALOGO`. `TagInput` filtra el catálogo mientras se escribe (sin distinguir mayúsculas ni acentos; primero las que empiezan con el texto, luego las que lo contienen; máx. 50 resultados), se elige con clic o con teclado (↑ ↓ Enter, Esc cierra), permite varias etiquetas y **solo acepta etiquetas del catálogo** para que el match sea exacto. Se guardan en `habilidades text[]` tal como aparecen en el catálogo. Para añadir habilidades basta con editar el JSON (cada una de 1–60 caracteres, sin duplicados).
*   `PerfilFields` es el componente compartido por ambos formularios; las opciones y etiquetas viven en `src/lib/perfilOptions.ts`.
*   El detalle de la vacante muestra "Perfil buscado" (`VacantePerfilBuscado`) para que el candidato conozca los requisitos antes de postularse.

### 7.3 Reglas de negocio del match (`src/lib/match.ts`)
*   Solo cuentan los **criterios que la vacante define**. El porcentaje base es el promedio ponderado de la compatibilidad (0–1) de los criterios activos (sin habilidades), redondeado al entero: `round(Σ peso·score / Σ peso activos · 100)`. Si la vacante solo exige habilidades, la base es 0 y el porcentaje es `2 · coincidencias`.
*   Pesos del promedio: **edad 15, nivel de estudios 20, grado académico 20, experiencia 20**. Las **habilidades NO entran en el promedio**: cada habilidad requerida que el candidato tenga **suma 2 puntos porcentuales** (`BONO_HABILIDAD`) al porcentaje global, que **nunca supera el 100%**: `porcentaje = min(100, base + 2 · coincidencias)`.
*   Cálculo por criterio:
    *   **Edad:** 1 si está dentro del rango (un límite ausente es abierto); 0 si queda fuera o no hay dato.
    *   **Nivel de estudios / grado académico:** `min(rango_candidato / rango_requerido, 1)`. Ingeniero y licenciado tienen el mismo rango (2); técnico 1, maestro 3, doctor 4. Sin dato = 0. Un grado superior al requerido cuenta como cumplido.
    *   **Experiencia:** `min(años_candidato / años_requeridos, 1)`; si se exigen 0 años, 1.
    *   **Habilidades (bono):** se cuenta cuántas de las habilidades requeridas tiene el candidato (comparación sin mayúsculas ni acentos); las habilidades extra del candidato no suman.
*   Si la vacante no define ningún requisito estructurado (ni criterios ni habilidades), el porcentaje es `null` y se muestra el aviso "no se calcula compatibilidad".
*   El cálculo es del lado del cliente (función pura `calcularMatch`); si cambian los pesos o reglas, actualizar esta sección.

### 7.4 Regla de ordenamiento (estricta)
En el detalle de una vacante propia, "Postulaciones recibidas" **siempre** se ordena de **mayor a menor porcentaje de compatibilidad** (`ordenarPorMatch`). Desempates (y vacantes sin porcentaje): primero la postulación más antigua. No hay otros criterios de orden ni controles para alterarlo.
Cada candidato muestra "Cumple con el N% de los requisitos", una barra de progreso, el desglose por criterio, sus datos y etiquetas, y el botón "Ver CV" (URL firmada de 60 s).

## 8. SEGUIMIENTO DE POSTULACIONES

### 8.1 Estados (`postulaciones.estado`, enum `estado_postulacion`)
| Valor | Etiqueta en la UI | Cómo se asigna |
|---|---|---|
| `recibida` | Recibida | **Automático**: es el `default` de la columna, se fija cuando el CV y los datos se guardan correctamente en la base de datos. La política de INSERT exige `estado = 'recibida'`, así que el candidato no puede elegir otro. |
| `en_revision` | En revisión | Lo asigna el reclutador |
| `rechazada` | Rechazada | Lo asigna el reclutador |
| `pruebas_psicometricas` | Avanzar a pruebas psicométricas | Lo asigna el reclutador |

Las etiquetas y colores (`Badge`) viven en `src/lib/postulacionEstados.ts`. "Recibida" **no** aparece en la lista desplegable: solo es el estado inicial y no se puede volver a ella. El reclutador puede pasar entre los tres estados asignables en cualquier momento (incluso desde "Rechazada").

### 8.2 Permisos (RLS)
*   Solo el **publicador de la vacante** puede actualizar una postulación, y solo la columna `estado` (`grant update (estado)`; `updated_at` lo mantiene un trigger). El candidato no puede modificar ni borrar su postulación.
*   Un candidato puede leer las vacantes a las que se postuló aunque luego se cierren (función `security definer` `ha_postulado()`, necesaria para evitar recursión infinita de RLS entre `vacantes` y `postulaciones`).

### 8.3 Cambio de estado con confirmación obligatoria
*   En la tarjeta de cada candidato (`PostulacionCard`) hay una lista **"Cambiar estado"** (`EstadoPostulacionSelect`) con las 3 opciones asignables y una etiqueta con el estado actual.
*   Al elegir una opción **no se guarda nada**: se abre un diálogo (`ConfirmDialog`) con el texto **"¿Seguro que quieres establecer este estado como «[estado elegido]»?"** y los botones *Cancelar* / *Sí, cambiar estado*.
*   Solo al aceptar se llama a `updateEstadoPostulacion`. Si se cancela, la lista conserva el estado anterior; si falla, el error se muestra en el diálogo. Elegir el estado que ya tiene no hace nada.
*   Esta confirmación es obligatoria y no debe eliminarse ni saltarse al añadir nuevos estados.

### 8.4 "Mis postulaciones" (candidato)
*   Ruta `/mis-postulaciones` (solo rol `postulante`, enlace en el encabezado vía `HeaderNav`). Lista cada postulación con puesto, empresa, ubicación, fecha y estado; enlaza al detalle de la vacante e indica si la vacante ya está cerrada.
*   En el detalle de una vacante, si ya se postuló, el candidato ve el estado actual.

## 9. EDICIÓN Y CIERRE DE VACANTES
*   **Cerrar / reabrir:** botón en cada fila del panel (`MisVacanteRow` → `updateEstadoVacante`). Una vacante cerrada deja de aparecer en el feed y no admite nuevas postulaciones.
*   **Editar:** botón "Editar" en cada fila abre el mismo `VacanteForm` en un modal, con los datos guardados (`vacanteToFormValues`) y el botón "Guardar cambios" (`updateVacante`). Se pueden modificar todos los campos, incluido el perfil buscado y las habilidades. Mismas validaciones que al publicar; RLS (`vacantes_update_owner`) garantiza que solo el dueño edita y no puede transferir la vacante.
*   Al editar los requisitos, el porcentaje de match de los candidatos ya postulados se **recalcula** con los requisitos nuevos (se calcula al mostrar la lista); los datos que cada candidato envió no cambian.
*   `VacanteForm` sirve para crear y editar (prop opcional `vacante`); el bloque "Perfil buscado" está en `VacantePerfilFieldset`.

## 10. MAPA DE RUTAS Y ESTADO DEL PROYECTO
| Ruta | Acceso | Pantalla |
|---|---|---|
| `/login`, `/registro` | Solo sin sesión | Autenticación (el rol se elige al registrarse) |
| `/dashboard` | `publicador` | Panel: publicar, editar, cerrar/reabrir vacantes |
| `/vacantes` | `postulante` | Feed de vacantes abiertas con búsqueda |
| `/mis-postulaciones` | `postulante` | Postulaciones propias y su estado |
| `/evaluacion/:postulacionId` | `postulante` | Evaluación de Perfil Profesional (solo con estado `pruebas_psicometricas`) |
| `/vacantes/:id` | Cualquier usuario autenticado | Detalle; el candidato ve "Postularme", el dueño ve las postulaciones ordenadas por match |

**Funcionalidades completadas y verificadas en producción:** autenticación por roles, publicar/editar/cerrar vacantes, feed y detalle, postulación con CV (PDF), match automático con ordenamiento estricto, autocompletado de habilidades, estados de postulación con confirmación, "Mis postulaciones" y la Evaluación de Perfil Profesional (examen psicométrico global, un intento, 15 minutos).

**Fuera de alcance por ahora (no implementar sin pedirlo):** filtros avanzados en el feed y pulido para entrega (README de instalación, ESLint — falla por la incompatibilidad de `typescript-eslint` con TypeScript 7).

**Convenciones de trabajo:** cada cambio de base de datos va en un nuevo archivo `supabase/NN_nombre.sql` (nunca se editan los anteriores) y se documenta en este archivo; antes de hacer commit se ejecuta `npm run build`.

## 11. EVALUACIÓN DE PERFIL PROFESIONAL (EXAMEN PSICOMÉTRICO)
Prueba **global** (la misma para todas las vacantes), de opción múltiple y con evaluación instantánea. Es una herramienta interna de compatibilidad laboral **sin validez clínica**; el texto de inicio lo aclara y no debe eliminarse. No debe llamarse "prueba psicológica" en la interfaz.

### 11.1 Archivos y reparto de responsabilidades
| Qué | Dónde |
|---|---|
| Preguntas, opciones, escala Likert, dimensiones, niveles, textos | `examen_psicometrico.json` (raíz). **No contiene respuestas correctas ni ítems inversos.** |
| Clave de respuestas, ítems inversos y fórmulas de puntuación | `supabase/08_examen_psicometrico.sql`, dentro de `enviar_examen_psicometrico()` (nunca llegan al navegador) |
| Resultados | Tabla `resultados_psicometricos` |

Si se modifican preguntas o la clave: actualizar el JSON **y** la función SQL, y subir `version` en ambos (`v_version` en SQL). Cada resultado guarda la versión con la que se respondió.

### 11.2 Contenido (30 preguntas, versión 1)
*   **Parte 1 – Lógica y resolución de problemas (L01–L10):** opción múltiple A–D con una sola correcta.
*   **Parte 2 – Estilo de trabajo (P01–P20):** escala Likert 1–5 (Totalmente en desacuerdo … Totalmente de acuerdo), 5 ítems por dimensión: **Adaptabilidad, Trabajo en equipo, Liderazgo y Tolerancia al estrés**. 6 ítems están redactados en sentido inverso (puntúan `6 − valor`).

### 11.3 Puntuación (se calcula en la base de datos)
*   **Lógica:** `aciertos / 10 · 100` (las preguntas omitidas cuentan como incorrectas). Se muestra como porcentaje ("Lógica: 80%").
*   **Dimensiones Likert:** `(suma − n) / (4n) · 100`, con `n` = ítems respondidos de la dimensión (si `n = 0`, sin resultado). Se muestran como nivel: **Bajo** < 50 %, **Medio** 50–74 %, **Alto** ≥ 75 % (umbrales en el JSON, `niveles`).

### 11.4 Reglas de acceso (RLS y funciones)
*   Solo puede presentarla el **dueño de la postulación** y **únicamente si su estado es `pruebas_psicometricas`** (lo valida `enviar_examen_psicometrico`, no la interfaz).
*   **Un único intento por postulación:** `unique(postulacion_id)`; un segundo envío falla con 23505 y la interfaz lo trata como "ya enviado".
*   La tabla no tiene políticas ni privilegios de escritura: la **única** vía de escritura es la función `security definer`. El candidato **no puede leer** su resultado; `examenes_completados()` solo devuelve los ids ya enviados.
*   El **reclutador** de la vacante lee los resultados (`resultados_select_publicador`).
*   Las respuestas se validan en SQL (preguntas conocidas, letras a–d, valores 1–5).

### 11.5 Flujo del candidato
1.  El reclutador cambia el estado a "Avanzar a pruebas psicométricas" (con su confirmación habitual).
2.  En "Mis postulaciones" aparece **"Realizar evaluación"** (o "Evaluación enviada" si ya la presentó) → `/evaluacion/:postulacionId`.
3.  Pantalla de inicio (`ExamenIntro`): 30 preguntas, 15 minutos, único intento y el aviso de que no tiene validez clínica. El temporizador arranca al pulsar **Comenzar**.
4.  Una pregunta por pantalla, mapa de preguntas, barra de avance y **rueda de 15 minutos** con el tiempo restante dentro (`TimerRing`; ámbar < 5 min, rojo y parpadeo < 1 min).
5.  **Temporizador de 15 min para toda la prueba, solo en el cliente** (no se valida en el servidor): se calcula con la hora de inicio guardada, así que recargar o salir no lo reinicia. Al llegar a 0 se dispara el envío automático (`useEnviarExamen`) con lo respondido (`por_tiempo = true`); si falla, hay botón "Reintentar envío" (sin bucle automático).
6.  **Progreso en `localStorage`** (clave `examen:{usuario}:{postulación}:v{versión}`): hora de inicio, respuestas y pregunta actual; se borra al enviar. Si el navegador no permite almacenamiento, funciona en memoria.
7.  Al enviar (manual, con confirmación, o por tiempo) el candidato **solo ve** "Examen enviado con éxito. El reclutador ha sido notificado." — nunca su puntaje.

### 11.6 Vista del reclutador
En cada tarjeta de candidato, **debajo de la compatibilidad general**, `DesglosePsicometrico` muestra un recuadro por dimensión: "Lógica: 80%", "Trabajo en equipo: Alto", "Tolerancia al estrés: Medio"…, con barra, número de preguntas respondidas e indicación de envío por tiempo agotado. Si el candidato está en pruebas psicométricas pero aún no la presenta, se indica como pendiente.

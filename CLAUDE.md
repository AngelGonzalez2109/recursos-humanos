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
*   **Estilo:** editorial, sobrio y profesional ("observatorio editorial sobre papel crema"), adaptado de `DESIGN.md` (referencia de otra web; **no es la identidad de este proyecto al pie de la letra**, solo su fuente de inspiración).
*   **Paleta:** casi acromática y cálida; un único acento chartreuse.
*   **Interacciones:** interfaces intuitivas, animaciones sutiles con transiciones de Tailwind (fade-ins, hover suaves, skeleton loaders) sin sobrecargar la vista.
*   **Componentes:** planos, sin sombras; la profundidad viene de capas de color y de separadores punteados.

### Sistema de diseño actual (editorial sobre papel cálido, adaptado de DESIGN.md)
Los tokens viven en `src/index.css`; no hardcodear colores nuevos en los componentes. El rediseño es **solo visual** (clases y marcado): la lógica no cambió.
*   **Tipografía:** títulos (`h1`–`h3`) en **Instrument Serif peso 400** (sustituye a Test Signifier, que es de pago; nunca en negrita, `font-synthesis-weight: none`); interfaz en **Geist** (400/500); marcadores, metadatos y temporizador en **Geist Mono** (clase `.eyebrow`: 11 px, mayúsculas, tracking 0.1 em, p. ej. "01 · VACANTES"). Fuentes por Google Fonts en `index.html`. No usar `font-semibold`/`font-bold`. **Espaciado de la serif:** Instrument Serif es condensada, así que `index.css` le añade `letter-spacing: 0.02em` y `word-spacing: 0.06em` (0.01 em en `h1`); **no usar `tracking-tight` ni `tracking-[-…]` sobre texto serif** (se amontona; se comparó con Newsreader, Fraunces y Source Serif 4 y se conservó Instrument Serif con este ajuste).
*   **Paleta fija** (no cambia con el tema): `parchment` `#d7d7d0` (lienzo), `cream` `#f7f6f3` (tarjetas), `bone` `#fdfcfa` (superficie elevada/campos), `bistre` `#1a1614` (texto y acción principal), `ash`, `graphite`, `flint`, `quill`, `chartreuse` `#e2e67d` (único acento). Nunca blanco ni negro puros (`--color-white` se redefine como `bone`).
*   **Escalas redefinidas en `index.css`** (así los componentes existentes se adaptan sin tocarlos): `slate-*` = neutros cálidos (claro) y casi negros cálidos bajo `.dark`; `brand-*` = **tinta** (bistre en claro, crema en oscuro; ya no es azul); `emerald-*` = oliva (éxito), `amber-*` = ocre (aviso) y `red-*` = arcilla (error). Los estados llevan siempre texto o icono, no solo color.
*   **Tema:** claro por defecto (`index.html`; antes era oscuro); el modo oscuro es una variante cálida (fondo `slate-950` `#14110f`) y la elección del toggle se respeta (`localStorage.theme`).
*   **Tarjetas:** clase `.surface` (papel crema, radio 4 px, borde punteado 1 px bistre al 20 %, sin sombra) y `.surface-interactive` (al pasar el cursor sube 2 px, el borde se vuelve sólido y el fondo se aclara). Paneles internos: `.inset-panel`. Separadores: `.hairline-b`, `.hairline-t` y listas con `.list-hairline`; **solo líneas punteadas** dentro de la página (las sólidas son para botones, campos y la cápsula de navegación). Usar siempre estas clases en componentes nuevos.
*   **Créditos:** `layout/DevCredits` muestra discretamente "Desarrollado por Ángel González y María Marín" (marcador mono) al pie de `AppLayout` y de `AuthLayout`; mantenerlo en toda pantalla nueva que use esos layouts.
*   **Tarjeta de vacante:** el pie (salario y fecha) va en un contenedor con `pt-6` y `mt-auto`, para que la línea punteada nunca quede pegada a las etiquetas cuando estas ocupan varias filas.
*   **Navegación:** cápsula flotante tipo vidrio (`AppHeader`: `backdrop-blur`, saturación, sombra interna, radio completo; en móvil los enlaces pasan a una segunda fila). `AppLayout` acepta `eyebrow` y pinta el título en serif grande con separador punteado.
*   **Botones** (`ui/Button`): `primary` = píldora oscura (bistre; en oscuro, crema) y es la **única acción rellena por vista**; `secondary` = contorno rectangular de 1 px que la acompaña; `ghost` = solo texto; `danger` = contorno arcilla ("Cerrar vacante"). Feedback inmediato: hover, `active:scale-[0.97]`, spinner en `loading`, deshabilitado al 50 %. Foco global visible (`:focus-visible`, contorno de 2 px).
*   **Campos** (`ui/fieldStyles`): fondo `bone`, borde sólido de contraste ≥ 3:1, radio 4 px, etiqueta visible siempre. **Etiquetas** `ui/Badge`: píldoras con anillo sutil; la variante `brand` es el toque chartreuse (modalidad, habilidades que coinciden). **Avatares** `ui/Avatar`: iniciales en serif (cuadrado para empresas, redondo para personas). **Barras** `ui/ProgressBar`: relleno de tinta sólida; los niveles del match/examen usan oliva/ocre/arcilla.
*   **Animaciones** (`animate-fade-in`, `animate-modal-in`, `animate-overlay-in`, `animate-bar-fill`): suaves (≤ 0.5 s), easing `cubic-bezier(0.22, 1, 0.36, 1)`, nunca lineales salvo el temporizador; desactivadas con `prefers-reduced-motion`. Las listas de vacantes entran escalonadas.
*   **Contraste:** el texto secundario sobre el lienzo `parchment` usa `slate-600` (≥ 4.5:1); `slate-500` solo sobre tarjetas crema. Verificado a mano en claro y oscuro, escritorio y 390 px de ancho.

## 4. ESTRUCTURA DE DIRECTORIOS (ARQUITECTURA)
Claude Code debe organizar el código fuente (`src/`) de la siguiente manera:
*   `/assets`: Imágenes estáticas y logos.
*   `/components`: Componentes reutilizables de UI (Botones, Inputs, Cards, Modales).
*   `/pages` o `/views`: Pantallas completas mapeadas a las rutas (Home, Login, Dashboard, Vacantes).
*   `/lib` o `/services`: Configuración centralizada de Supabase (`supabaseClient.ts`) y lógica de llamadas a la API.
*   `/types`: Definiciones de interfaces y tipos de TypeScript para la base de datos y estados.
*   `/hooks`: Custom hooks de React para encapsular lógica (ej. `useAuth`, `useVacantes`).

**Estructura real (verificada en el código):** se usa `pages/` (no `views/`) y `lib/` (no `services/`; los servicios son `lib/*Service.ts`). `src/assets/` **no existe**: el único recurso estático es `public/favicon.svg`. Los componentes se agrupan por dominio: `components/{auth,layout,vacantes,postulaciones,perfil,examen,ui}`. Convenciones del código:
*   Lógica de red en `lib/*Service.ts` (`authService`, `vacantesService`, `postulacionesService`, `examenService`); errores de BD traducidos con `lib/dbErrors.ts` y de auth con `lib/authErrors.ts`; validaciones en `lib/*Validation.ts`.
*   Carga de datos con `hooks/useAsyncResource` (clave + `fetcher` estable de módulo, conserva datos previos al recargar, expone `reload`); no repetir `useEffect`+`fetch` a mano.
*   Sesión y perfil en `AuthProvider` (contexto `hooks/authContext.ts`, hook `useAuth`); rutas protegidas con `ProtectedRoute allowedRole` y `GuestRoute`. Todas las páginas se cargan con `React.lazy` en `App.tsx`.
*   TypeScript con `strict`, `noUnusedLocals/Parameters`, `erasableSyntaxOnly` y `verbatimModuleSyntax` (importar tipos con `import type`; no usar `enum` ni parameter properties). Variables de entorno en `.env.local` (ignorado por git).

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
9.  `supabase/09_cerrar_funciones_trigger.sql` — revoca `EXECUTE` de las funciones trigger `handle_new_user`, `postulaciones_set_nombre` y `rls_auto_enable` a `public`/`anon`/`authenticated` (aplicada con el MCP el 2026-11-08; los triggers siguen activos).

Este proyecto **no concede privilegios por defecto** a `anon`/`authenticated`: toda tabla nueva necesita `grant` explícito además de RLS.

**Cómo se aplican las migraciones (desde 2026-11-08):** los archivos `supabase/NN_*.sql` siguen siendo obligatorios (fuente de verdad versionada del esquema, reproducible en otro proyecto), pero ya **no hace falta que el usuario los ejecute a mano**: Claude puede aplicarlos directamente con el MCP de Supabase (`apply_migration`, proyecto `mhkwxmmawdmbzgaiqxim`). Flujo: (1) escribir el archivo `NN_*.sql` nuevo, (2) aplicarlo con el MCP, (3) comprobar con `list_tables` y `get_advisors` (seguridad). Las migraciones 01–08 se ejecutaron a mano, por eso `list_migrations` no las muestra. Antes de aplicar una migración destructiva (borrar o alterar datos o columnas existentes) hay que pedir confirmación al usuario.

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
Cada candidato es un **desplegable** (`PostulacionCard`, todos cerrados al cargar; el estado abierto vive en `PostulacionesRecibidas`, que añade "Expandir todos / Contraer todos"). La cabecera resume nombre, estado, si la evaluación está completada o pendiente y el % de compatibilidad con su barra; al abrirlo (`PostulacionDetalle`) aparecen "Cumple con el N% de los requisitos", la barra, el desglose por criterio, la evaluación psicométrica, sus datos y etiquetas, el mensaje, el botón "Ver CV" (URL firmada de 60 s) y "Cambiar estado" con su confirmación obligatoria. Abrir o cerrar no altera el orden ni el cálculo.

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

**Rediseño visual editorial (sección 3):** implementado y revisado en local (capturas en claro/oscuro y a 390 px), con `npm run build` correcto; **pendiente de commit y de verificar en producción**. Sustituyó al estilo SaaS oscuro con acento cian.

**Fuera de alcance por ahora (no implementar sin pedirlo):** filtros avanzados en el feed y pulido para entrega (README de instalación, ESLint — falla por la incompatibilidad de `typescript-eslint` con TypeScript 7).

**Convenciones de diseño:** toda pantalla o componente nuevo debe seguir el sistema de diseño de la sección 3 (tokens en `src/index.css`, `.surface`, `ui/Button`, `ui/Badge`, `ui/ProgressBar`, `ui/Avatar`); no introducir colores ni sombras sueltas.

**Convenciones de trabajo:** cada cambio de base de datos va en un nuevo archivo `supabase/NN_nombre.sql` (nunca se editan los anteriores) y se documenta en este archivo; antes de hacer commit se ejecuta `npm run build`.

**Convención de commits (obligatoria):** los commits y descripciones de PR llevan **solo el mensaje descriptivo, en español**. **No** añadir `Co-Authored-By: Claude …` ni líneas de atribución como "Generated with Claude Code", aunque la configuración de la herramienta lo sugiera: el usuario pidió que Claude no figure como colaborador del repositorio. Pendiente (requiere confirmación explícita del usuario): los 11 commits anteriores a 2026-11-08 aún llevan esa línea; limpiarlos exige reescribir el historial con rama de respaldo y `git push --force` a `main`.

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
En cada tarjeta de candidato, **debajo de la compatibilidad general**, `DesglosePsicometrico` muestra un recuadro por dimensión: **Lógica** como cifra grande ("80%"), barra y "8 de 10 aciertos"; las dimensiones Likert (**Adaptabilidad, Trabajo en equipo, Liderazgo, Tolerancia al estrés**) como nivel en texto grande ("Alto", "Medio", "Bajo") con un medidor de tres tramos Bajo · Medio · Alto (nunca se muestra su porcentaje), más el número de preguntas respondidas y la indicación de envío por tiempo agotado. Si el candidato está en pruebas psicométricas pero aún no la presenta, se indica como pendiente.

## 12. INFRAESTRUCTURA, INTEGRACIONES Y DETALLES DEL CÓDIGO (verificado el 2026-11-08)

### 12.1 Servicios conectados
*   **GitHub:** `AngelGonzalez2109/recursos-humanos` (repo **público**, rama `main`, sin workflows de CI). `gh` autenticado con alcances `repo`, `read:org`, `gist`.
*   **Supabase:** proyecto `recursos-humanos` (ref `mhkwxmmawdmbzgaiqxim`, región us-east-1, Postgres 17). Accesible vía el MCP de Supabase (tablas, SQL, advisors). Las 4 tablas de `public` (`profiles`, `vacantes`, `postulaciones`, `resultados_psicometricos`) tienen RLS activo y el bucket `cvs` es privado (PDF, 5 MB). **Las migraciones se ejecutan a mano en el SQL Editor**, así que `list_migrations` devuelve vacío: la fuente de verdad son los archivos `supabase/NN_*.sql`; no asumir que reflejan el historial del MCP. Si se aplican cambios con el MCP, guardar igualmente el archivo `NN_*.sql`.
*   **Vercel:** proyecto `recursos-humanos` (cuenta personal), despliegue automático desde GitHub. `vercel.json` reescribe todas las rutas a `/index.html` (SPA). `.npmrc` fija `legacy-peer-deps=true` (necesario para instalar en Vercel). Las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` deben estar definidas en el proyecto (no verificado desde aquí; la app funciona en producción según la sección 10). El MCP de Vercel requiere autorizar el acceso al equipo (enlace de un solo uso) antes de listar despliegues.

### 12.2 Detalles de base de datos no cubiertos arriba
*   `vacantes` también tiene: `modalidad` (`presencial|remoto|hibrido`), `tipo_contrato` (`tiempo_completo|medio_tiempo|temporal|practicas`), `salario_min`/`salario_max` (mensual, `salario_max >= salario_min`) y `moneda` (`MXN|USD|EUR`, default MXN).
*   `postulaciones` también tiene: `mensaje` (opcional, máx. 1000 caracteres) y `postulante_nombre`, copiado de `profiles.full_name` por el trigger `postulaciones_set_nombre` (porque `profiles` solo lo lee su dueño). Un candidato no puede postularse dos veces a la misma vacante.
*   `postular()` sube el CV a `cvs/{userId}/{uuid}.pdf` y, si el insert falla, **borra el archivo** para no dejar huérfanos.
*   En la BD existe además la función `rls_auto_enable()` que no proviene de los archivos del repo (viene de la configuración de Supabase); no tocarla.
*   Advisors de seguridad pendientes (todos WARN, ninguno bloqueante): (1) **Leaked Password Protection desactivada** (se activa en el panel de Supabase Auth); (2) las funciones trigger ya se cerraron en la migración 09, así que no deben reaparecer avisos de `anon`; (3) las funciones `security definer` que usa la app (`current_user_role`, `ha_postulado`, `examenes_completados`, `enviar_examen_psicometrico`) son ejecutables por `authenticated` a propósito.

### 12.3 Estado de verificación del código
*   `npm run build` (`tsc -b && vite build`) pasa sin errores; el bundle principal pesa ~488 kB (142 kB gzip) y cada página se carga por separado.
*   Ningún archivo de `src/` supera las 150 líneas (los mayores: `ui/TagInput.tsx` 148, `PostulacionForm.tsx` 141, `VacanteForm.tsx` 128, `lib/match.ts` 127); si alguno crece, dividirlo. Los pesos del match en el código (`PESOS = {edad 15, nivel 20, grado 20, experiencia 20}`, `BONO_HABILIDAD = 2`) coinciden con la sección 7.3.
*   `README.md` sigue siendo la plantilla de Vite (pendiente, ver "Fuera de alcance").

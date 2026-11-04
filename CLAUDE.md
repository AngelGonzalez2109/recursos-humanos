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
*   **Postulante (Candidato):**
    *   Inicio de sesión / Registro.
    *   Feed principal para visualizar las vacantes disponibles.
    *   Opción para ver el detalle completo de cada vacante.
    *   Funcionalidad para postularse subiendo su CV (archivo PDF) directamente a la plataforma.

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
| `habilidades` | `text[]` (default `{}`) | Habilidades clave e idiomas; máx. 20 etiquetas de 2–40 caracteres (`etiquetas_validas()`) |

**`postulaciones` (perfil del candidato, *snapshot* al postularse):** `edad` (16–99), `nivel_estudios`, `grado_academico`, `experiencia_anios` (0–60), `habilidades` (`text[]`). Son nullable solo para no romper postulaciones anteriores a la migración 05; el formulario exige edad, nivel de estudios y experiencia. Las políticas RLS no cambiaron (el publicador solo ve las postulaciones de sus vacantes).

### 7.2 Flujo de formularios
*   **Reclutador — "Publicar vacante"** (`VacanteForm`): bloque "Perfil buscado" con edad mínima/máxima (numéricos), nivel de estudios y grado académico (listas con opción "Sin requisito"), años de experiencia (numérico) y habilidades/idiomas (etiquetas con sugerencias, `TagInput`). Todo es opcional.
*   **Candidato — "Postularme"** (`PostulacionForm`): CV en PDF + bloque "Tu perfil" con los mismos campos (`PerfilFields` en modo `candidato`). Edad, nivel de estudios y experiencia son obligatorios; grado ("Ninguno") y habilidades son opcionales. Los datos se guardan en la propia postulación (no en `profiles`).
*   `PerfilFields` es el componente compartido por ambos formularios; las opciones y etiquetas viven en `src/lib/perfilOptions.ts`.
*   El detalle de la vacante muestra "Perfil buscado" (`VacantePerfilBuscado`) para que el candidato conozca los requisitos antes de postularse.

### 7.3 Reglas de negocio del match (`src/lib/match.ts`)
*   Solo cuentan los **criterios que la vacante define**. El porcentaje es el promedio ponderado de la compatibilidad (0–1) de los criterios activos, redondeado al entero: `round(Σ peso·score / Σ peso activos · 100)`.
*   Pesos: **edad 15, nivel de estudios 20, grado académico 20, experiencia 20, habilidades 25**.
*   Cálculo por criterio:
    *   **Edad:** 1 si está dentro del rango (un límite ausente es abierto); 0 si queda fuera o no hay dato.
    *   **Nivel de estudios / grado académico:** `min(rango_candidato / rango_requerido, 1)`. Ingeniero y licenciado tienen el mismo rango (2); técnico 1, maestro 3, doctor 4. Sin dato = 0. Un grado superior al requerido cuenta como cumplido.
    *   **Experiencia:** `min(años_candidato / años_requeridos, 1)`; si se exigen 0 años, 1.
    *   **Habilidades:** proporción de las habilidades requeridas que el candidato tiene (comparación sin mayúsculas ni acentos).
*   Si la vacante no define ningún requisito estructurado, el porcentaje es `null` y se muestra el aviso "no se calcula compatibilidad".
*   El cálculo es del lado del cliente (función pura `calcularMatch`); si cambian los pesos o reglas, actualizar esta sección.

### 7.4 Regla de ordenamiento (estricta)
En el detalle de una vacante propia, "Postulaciones recibidas" **siempre** se ordena de **mayor a menor porcentaje de compatibilidad** (`ordenarPorMatch`). Desempates (y vacantes sin porcentaje): primero la postulación más antigua. No hay otros criterios de orden ni controles para alterarlo.
Cada candidato muestra "Cumple con el N% de los requisitos", una barra de progreso, el desglose por criterio, sus datos y etiquetas, y el botón "Ver CV" (URL firmada de 60 s).

# CLAUDE.md — INSTRUCCIONES DEL PROYECTO

## 1. CONTEXTO Y OBJETIVO

Desarrollar una aplicación web de reclutamiento y postulación a vacantes laborales.

La plataforma tendrá dos tipos principales de usuarios:
1. Publicadores de vacantes.
2. Postulantes que buscan oportunidades laborales.

El objetivo es crear una aplicación web funcional, profesional, intuitiva y visualmente cuidada, con autenticación, persistencia real de información y almacenamiento de documentos.

La aplicación es un proyecto académico, pero debe desarrollarse con buenas prácticas de calidad, arquitectura y seguridad.

No se busca únicamente una demostración visual. Las funcionalidades deben operar realmente y conservar la información mediante servicios de backend.

## 2. TECNOLOGÍAS

Utilizar las siguientes tecnologías:

- React
- Vite
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage
- Git
- GitHub
- Vercel

Evitar introducir tecnologías adicionales sin una justificación clara.

## 3. TIPOS DE USUARIO Y FLUJO GENERAL

La aplicación debe permitir que el usuario identifique claramente cuál de estas dos actividades desea realizar:

- Publicar vacantes.
- Buscar vacantes y postularse.

La interfaz inicial debe comunicar ambas opciones de manera clara y profesional.

El usuario deberá registrarse o iniciar sesión según corresponda.

La plataforma debe identificar el rol asociado a la cuenta y mostrar la interfaz adecuada.

El rol no debe poder modificarse libremente mediante una petición del frontend.

Si un usuario necesita cambiar de tipo de cuenta, deberá existir un procedimiento controlado y documentado.

## 4. FLUJO DEL PUBLICADOR DE VACANTES

Los usuarios que publican vacantes deben disponer de una interfaz propia.

Funcionalidades:

- Registro e inicio de sesión.
- Panel principal del publicador.
- Interfaz para registrar nuevas vacantes.
- Formulario intuitivo para introducir los datos del puesto.
- Validación de campos obligatorios.
- Posibilidad de guardar, revisar y publicar la vacante.
- Creación automática del registro de la vacante en la base de datos al confirmar su publicación.
- Visualización de las vacantes propias.
- Edición de vacantes.
- Cierre de convocatorias.
- Consulta de las postulaciones recibidas.
- Acceso autorizado a los CV de los candidatos.
- Seguimiento del estado de las postulaciones.

El formulario debe proporcionar una experiencia de uso clara, con campos bien organizados, etiquetas, instrucciones y validaciones.

La publicación debe generar un registro persistente en la base de datos.

No utilizar datos estáticos para simular la publicación.

Una vacante publicada debe aparecer en el catálogo de vacantes disponibles cuando cumpla las condiciones de visibilidad correspondientes.

Las vacantes cerradas no deben permitir nuevas postulaciones.

## 5. FLUJO DEL POSTULANTE

Los usuarios postulantes deben disponer de una interfaz enfocada en encontrar oportunidades laborales.

Funcionalidades:

- Registro e inicio de sesión.
- Exploración de vacantes disponibles.
- Visualización de tarjetas o elementos de vacantes.
- Consulta de los detalles de cada vacante.
- Búsqueda y filtros.
- Visualización de requisitos y descripción del puesto.
- Posibilidad de postularse.
- Carga de CV en formato PDF.
- Confirmación de la postulación.
- Consulta del historial de postulaciones.
- Seguimiento del estado de cada postulación.

El postulante debe poder identificar claramente qué vacantes están disponibles y cuáles ya no aceptan solicitudes.

El proceso de postulación debe ser intuitivo y requerir únicamente la información necesaria.

La aplicación debe prevenir postulaciones duplicadas a la misma vacante, salvo que posteriormente se defina una política diferente.

El sistema debe conservar la relación entre candidato, vacante, postulación y documento asociado.

El CV debe quedar asociado correctamente a la postulación correspondiente.

## 6. AUTENTICACIÓN Y CUENTAS

Utilizar Supabase Auth.

Implementar:

- Registro.
- Inicio de sesión.
- Cierre de sesión.
- Recuperación de contraseña.
- Gestión de sesión.
- Protección de rutas.
- Redirección según el rol.
- Manejo de errores de autenticación.
- Estados de carga.
- Validaciones de formularios.

No almacenar contraseñas manualmente en PostgreSQL.

No utilizar autenticación ficticia ni sesiones simuladas.

La interfaz debe distinguir entre usuarios autenticados y no autenticados.

## 7. BASE DE DATOS Y ALMACENAMIENTO

Utilizar PostgreSQL mediante Supabase.

Diseñar un modelo relacional normalizado y documentado.

El esquema deberá contemplar, como mínimo, las entidades necesarias para:

- Perfiles.
- Vacantes.
- Postulaciones.
- Documentos CV.

Definir adecuadamente:

- Claves primarias.
- Claves foráneas.
- Restricciones.
- Índices cuando sean necesarios.
- Relaciones entre entidades.
- Reglas de integridad.
- Estados y transiciones válidas.

Los datos de las vacantes deben almacenarse en PostgreSQL.

Los archivos CV deben almacenarse en Supabase Storage.

En PostgreSQL se guardarán las referencias y metadatos necesarios para relacionar los archivos con sus propietarios y postulaciones.

No almacenar los PDF completos como texto ni codificarlos en Base64 dentro de los registros.

Utilizar un bucket privado para los documentos personales.

## 8. SEGURIDAD Y PERMISOS

Implementar Row Level Security (RLS) y políticas de autorización.

Consideraciones:

- Los usuarios solo podrán consultar y modificar los recursos para los que tengan autorización.
- Los postulantes no podrán acceder a los documentos privados de otros candidatos.
- Los publicadores solo podrán administrar sus propias vacantes.
- Los publicadores únicamente podrán consultar postulaciones y documentos que estén autorizados a gestionar.
- Las operaciones privilegiadas deben validarse del lado servidor.
- No confiar en roles, identificadores o permisos enviados desde el cliente.
- No exponer claves secretas ni service_role keys en el frontend.
- Validar el tipo, tamaño y contenido de los archivos.
- Evitar accesos no autorizados mediante rutas, consultas o solicitudes directas a la API.
- No desactivar RLS para solucionar problemas de implementación.

Documentar las políticas de acceso y probarlas con cuentas de diferentes roles.

## 9. DISEÑO Y EXPERIENCIA DE USUARIO

La aplicación debe tener una apariencia profesional, seria, moderna y confiable.

El diseño debe transmitir la identidad de una plataforma laboral profesional.

### Dirección visual

- Diseño limpio y elegante.
- Estética corporativa contemporánea.
- Jerarquía visual clara.
- Tipografía legible y profesional.
- Paleta de colores sobria y coherente.
- Uso moderado del color de acento.
- Espaciado consistente.
- Componentes visuales uniformes.
- Iconografía consistente.
- Evitar saturación visual.
- Evitar efectos exagerados, degradados excesivos y elementos decorativos innecesarios.

No utilizar una plantilla genérica sin adaptar su composición y navegación al propósito de la plataforma.

### Interfaces

Diseñar cuidadosamente:

- Página de inicio.
- Selección del tipo de usuario.
- Registro.
- Inicio de sesión.
- Recuperación de contraseña.
- Panel del publicador.
- Formulario de publicación.
- Gestión de vacantes.
- Catálogo de vacantes.
- Detalle de vacante.
- Proceso de postulación.
- Carga de CV.
- Historial de postulaciones.
- Seguimiento de candidatos.

Cada interfaz debe tener una estructura visual coherente con las demás.

### Experiencia de usuario

Priorizar interfaces intuitivas.

- Navegación clara.
- Acciones principales fáciles de identificar.
- Formularios organizados por secciones.
- Etiquetas explícitas.
- Mensajes de validación comprensibles.
- Confirmaciones para acciones importantes.
- Indicadores de progreso cuando sean necesarios.
- Estados vacíos útiles.
- Mensajes de error claros.
- Retroalimentación visual después de cada operación.
- Diseño responsivo para escritorio, tablet y móvil.

Evitar flujos innecesariamente largos o confusos.

## 10. ANIMACIONES Y MICROINTERACCIONES

Incorporar animaciones sutiles y profesionales.

Ejemplos:

- Transiciones suaves entre estados.
- Aparición discreta de elementos.
- Efectos hover moderados.
- Feedback visual en botones.
- Transiciones de apertura y cierre de paneles.
- Indicadores animados de carga.
- Microinteracciones en formularios.

Las animaciones deben mejorar la percepción de calidad sin distraer al usuario.

No utilizar animaciones excesivas ni que retrasen la navegación.

Respetar prefers-reduced-motion para usuarios que prefieren movimiento reducido.

## 11. ARQUITECTURA DEL CÓDIGO

Organizar el proyecto en módulos.

Separar:

- Páginas.
- Componentes.
- Layouts.
- Hooks.
- Servicios.
- Integración con Supabase.
- Tipos.
- Validaciones.
- Configuración.
- Utilidades.
- Pruebas.

Evitar archivos excesivamente grandes.

Evitar duplicación de código.

Mantener una separación clara entre interfaz, lógica de negocio y acceso a datos.

Usar componentes reutilizables cuando aporten valor real.

No abstraer innecesariamente funcionalidades simples.

## 12. CALIDAD Y FUNCIONALIDAD

- Todas las operaciones relevantes deben tener persistencia real.
- No simular resultados de operaciones exitosas.
- No utilizar localStorage como sustituto de la base de datos.
- No utilizar datos ficticios como sustituto permanente de información real.
- Los datos de demostración deben estar claramente identificados.
- Manejar errores de red y de base de datos.
- Evitar formularios que aparenten funcionar sin guardar información.
- Implementar estados de carga.
- Implementar validaciones tanto en cliente como en servidor cuando corresponda.
- Mantener compatibilidad con el despliegue en Vercel.

## 13. DESARROLLO Y METODOLOGÍA

Antes de comenzar:

1. Inspeccionar los archivos existentes.
2. Revisar la configuración del proyecto.
3. Identificar dependencias instaladas.
4. Presentar una propuesta de arquitectura.
5. Proponer el esquema de datos y las relaciones.
6. Proponer los módulos y las páginas.
7. Identificar los riesgos de seguridad.

Desarrollar por etapas:

ETAPA 1:
Arquitectura, estructura, diseño general y navegación.

ETAPA 2:
Autenticación, perfiles y roles.

ETAPA 3:
Publicación y administración de vacantes.

ETAPA 4:
Catálogo, detalle de vacantes y búsqueda.

ETAPA 5:
Postulaciones y carga de CV.

ETAPA 6:
Paneles, seguimiento y gestión.

ETAPA 7:
Pruebas, seguridad, optimización y despliegue.

No es obligatorio terminar una etapa completa antes de descubrir problemas en otra, pero mantener un desarrollo ordenado.

No implementar todo en un único bloque de cambios.

## 14. PRUEBAS Y DOCUMENTACIÓN

- Probar los flujos principales de cada tipo de usuario.
- Probar permisos y políticas RLS.
- Probar creación y edición de vacantes.
- Probar postulaciones.
- Probar carga y acceso a CV.
- Probar restricciones de acceso entre cuentas.
- Probar validaciones.
- Probar diseño responsivo.
- Revisar errores de compilación.
- Ejecutar pruebas automatizadas disponibles.

Documentar:
- Instalación.
- Ejecución local.
- Configuración de Supabase.
- Variables de entorno.
- Migraciones.
- Despliegue.
- Pruebas.
- Decisiones arquitectónicas.

No afirmar que las pruebas fueron ejecutadas si no se realizaron.

## 15. CONTROL DE CAMBIOS Y DESPLIEGUE

- Utilizar Git para mantener el historial.
- No eliminar archivos o configuraciones importantes sin justificación.
- No sobrescribir cambios existentes del desarrollador.
- No realizar cambios destructivos sin autorización.
- No publicar ni desplegar en producción sin confirmación.
- No realizar operaciones externas con efectos importantes sin autorización explícita.

## 16. INSTRUCCIÓN INICIAL

Comienza analizando estas instrucciones y el estado actual del proyecto.

Primero presenta:
1. La arquitectura propuesta.
2. La estructura de carpetas.
3. El flujo de comunicación.
4. El esquema de datos preliminar.
5. El diseño general de las interfaces.
6. El plan de implementación.

No comiences creando todos los módulos simultáneamente.

Prioriza una base sólida, una experiencia visual profesional y una implementación funcional y segura.

Si falta una decisión importante, explícala y pregunta antes de asumir.
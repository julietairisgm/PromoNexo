# Especificación para el desarrollo del prototipo web de PromoNexo

## 1. Rol

Actuá como desarrollador web full stack con experiencia en React, TypeScript y diseño de interfaces. Tu tarea es desarrollar un prototipo web funcional, navegable e interactivo para PromoNexo.

## 2. Contexto y objetivo

**PromoNexo** es una plataforma destinada a gestionar, difundir y facilitar la participación en las actividades de las promociones estudiantiles de San Pedro de Jujuy.

El prototipo corresponde al ciclo 2026 y debe representar cómo funcionaría la plataforma para estudiantes, delegados y administradores municipales.

## 3. Áreas de la aplicación

La aplicación tendrá tres áreas:

- **Sitio público:** accesible sin iniciar sesión. Permite consultar actividades, resultados, reconocimientos, fotografías y anuarios.
- **Panel del delegado:** permite gestionar la información y las actividades de su institución.
- **Panel municipal:** permite administrar instituciones, actividades, publicaciones, evidencias y reconocimientos.

El acceso al inicio de sesión estará disponible desde el sitio público. Después de ingresar, el usuario será dirigido al panel correspondiente a su rol.

## 4. Identidad visual

Utilizar la siguiente paleta de colores:

- Violeta principal: `#5321BF`
- Violeta oscuro: `#401C7C`
- Verde: `#7DB921`
- Amarillo anaranjado: `#F2B33D`
- Amarillo: `#FFC93C`
- Negro: `#1A1A1B`
- Blanco: `#FFFFFF`

El diseño debe ser moderno, juvenil, claro y organizado. Evitar el uso excesivo de blanco o negro y no implementar modo oscuro.

La interfaz debe adaptarse a computadoras, tablets y celulares.

## 5. Navegación y páginas

### Sitio público

La navegación principal debe organizarse de la siguiente manera:

- **Inicio:** presentación de PromoNexo, información destacada y accesos directos a las principales secciones.
- **Actividades:** listado de actividades publicadas por las instituciones y la Municipalidad.
- **Estudiantina:**
  - **Puntuaciones o tabla:** resultados finales de la Estudiantina 2026, con el podio destacado y la tabla de los cinco primeros puestos.
  - **Reconocimientos:** reconocimientos generales de las promociones y reconocimiento Mejor Hinchada de la Estudiantina.
- **Galería:**
  - **Galería actual:** fotografías de elecciones de reina de las instituciones, elección departamental y Estudiantina.
  - **Anuario:** acceso al anuario del ciclo 2026, con fotografías y recuerdos organizados por año.
- **Iniciar sesión:** acceso a los paneles privados.

Las opciones de Estudiantina y Galería deben funcionar como menús desplegables o elementos de navegación equivalentes. Cada opción debe llevar a su propia página.

### Panel del delegado

Debe permitir:

- Consultar la información de su institución.
- Crear, editar y eliminar sus actividades.
- Consultar las actividades publicadas.
- Gestionar la información de sus propuestas.
- Consultar los resultados y reconocimientos públicos.

El delegado solamente puede gestionar la información de su propia institución.

### Panel municipal

Debe permitir:

- Consultar y administrar las instituciones.
- Gestionar actividades municipales.
- Consultar y validar evidencias.
- Gestionar publicaciones y reconocimientos.
- Consultar información general del ciclo.

## 6. Comportamiento e interacciones

La aplicación debe ser navegable y tener interacciones funcionales para demostrar su comportamiento.

Implementar:

- Navegación entre páginas y submenús.
- Formularios para crear y editar actividades.
- Filtros y búsquedas cuando corresponda.
- Visualización de detalles de actividades.
- Inicio de sesión simulado y redirección según el rol.
- Acciones de administración y gestión mediante datos locales.
- Confirmaciones o mensajes al realizar acciones.

Los cambios realizados durante la demostración pueden mantenerse en memoria o mediante almacenamiento local del navegador. No se necesita un backend real.

## 7. Datos de demostración y recursos gráficos

Antes de comenzar el desarrollo, leer el archivo `datos-demo-promonexo.json`, que contiene los datos de demostración de instituciones, actividades, resultados, reconocimientos, galería, anuario y usuarios.

Utilizarlo como fuente principal de información. Respetar los nombres, identificadores, fechas, puntajes y relaciones definidos en el archivo. No inventar resultados adicionales ni modificar los datos proporcionados.

### Escudos institucionales

Utilizar los escudos disponibles para cada institución. Si una institución no tiene un escudo, mostrar un **escudo genérico que incluya el nombre de la institución**, manteniendo un diseño uniforme con el resto de los escudos. No inventar ni presentar escudos ficticios como si fueran oficiales.

### Galería y anuario

La galería actual debe contener únicamente fotografías relacionadas con:

- Elección de reina de las distintas instituciones.
- Elección departamental.
- Estudiantina.

Cada fotografía debe tener un título y, cuando corresponda, indicar la institución relacionada.

El anuario debe presentar una recopilación de fotografías y recuerdos del ciclo 2026, diferenciada de la galería actual.

Las imágenes ilustrativas que se utilicen como reemplazo deben poder cambiarse fácilmente por fotografías reales.

Crear las siguientes carpetas para organizar los recursos:

- `public/images/instituciones/`
- `public/images/galeria/`
- `public/images/anuario/`

Respetar las rutas de imágenes indicadas en el JSON.

## 8. Tecnologías y organización del código

Utilizar:

- React.
- TypeScript.
- Vite.
- Tailwind CSS.

Organizar el proyecto en componentes reutilizables, páginas, datos y recursos gráficos. Crear las carpetas y archivos necesarios para mantener una estructura clara y fácil de modificar.

El archivo JSON debe permanecer como fuente de los datos iniciales de demostración.

## 9. Restricciones

- No desarrollar un backend.
- No implementar autenticación real ni conexión a una base de datos.
- No agregar roles distintos de administrador municipal y delegado.
- No inventar instituciones, puntajes ni resultados.
- No reemplazar los resultados oficiales proporcionados.
- No presentar actividades ficticias como eventos reales.
- No utilizar escudos inventados como oficiales.
- Mantener separadas las puntuaciones competitivas y los reconocimientos generales.

## 10. Verificación y entrega

Antes de finalizar, comprobar que:

- Todas las páginas y opciones del menú funcionen.
- Los menús desplegables permitan acceder a sus secciones.
- El inicio tenga accesos claros a las principales áreas.
- Los paneles de delegado y administrador permitan realizar las acciones previstas.
- Los datos se muestren correctamente desde el JSON.
- Las instituciones sin escudo tengan un recurso genérico con su nombre.
- La galería y el anuario estén diferenciados.
- La aplicación sea adaptable a distintos tamaños de pantalla.

Al finalizar, explicar brevemente la estructura creada, cómo ejecutar el proyecto y qué funcionalidades están implementadas.

---
title: Estructura del Proyecto
description: Análisis detallado de la arquitectura técnica y la organización de contenido en FusionDoc.
order: 1
icon: 'lucide:git-merge'
---

# Estructura y Arquitectura del Proyecto

FusionDoc-Next está diseñado con una arquitectura moderna basada en **Next.js (App Router)**, optimizado para procesar MarkDown (MDX) dinámicamente y estructurarlo visualmente sin requerir configuraciones complejas por parte del usuario final.

En este documento detallaremos exhaustivamente el sistema de archivos, el motor de renderizado y las convenciones de nomenclatura que hacen posible la navegación inteligente.

---

## 📂 Visión General del Directorio

El árbol principal del código fuente está diseñado para separar limpiamente la configuración, la interfaz de usuario y el motor lógico.

<FileTree>
  <Folder name="docs" highlighted>Carpeta raíz. Puede contener versiones o tópicos directos</Folder>
  <Folder name="docs/v1" highlighted>Ejemplo de carpeta de versión (Opcional)</Folder>
  <Folder name="docs/v2" highlighted>Ejemplo de carpeta de versión (Opcional)</Folder>
  <Folder name="public">Archivos estáticos (imágenes, logos)</Folder>
  <Folder name="src" defaultOpen>
    <Folder name="app">Next.js App Router (Páginas, Layouts, API)</Folder>
    <Folder name="components">Componentes React y MDX personalizados</Folder>
    <Folder name="lib">Lógica base e integraciones (Github, Versiones, Search)</Folder>
  </Folder>
  <File name=".env.local">Configuración de variables de entorno (Título, Versiones, etc.)</File>
  <File name="package.json">Control de dependencias</File>
</FileTree>

---

## 🔄 Sistema de Versionado (Multi-Tenant)

FusionDoc permite gestionar múltiples proyectos o versiones de documentación de forma simultánea y automática.

### Detección y Visibilidad Mixta
A diferencia de sistemas tradicionales, FusionDoc utiliza una lógica híbrida para detectar lo que debe mostrar:
- **Escaneo de Directorios**: El motor escanea el directorio raíz `docs/` en tiempo real. Cada carpeta se identifica como un proyecto potencial (ej. `v1`, `Python`).
- **Overrides de Base de Datos**: Si el sistema está en **Modo Gestionado** (`ENABLE_AUTH_DB=true`), el administrador puede usar el Panel de Control para ocultar carpetas del sistema de archivos sin borrarlas, o marcarlas como privadas de forma selectiva.
- **Nombres Limpios**: El sistema limpia automáticamente prefijos numéricos (ej. `01-mi-app` -> `Mi App`) para la interfaz.

### Portal de Entrada e Inteligencia de Ruta
Cuando el usuario llega a la raíz de la aplicación (`/`), FusionDoc toma decisiones inteligentes basadas en el contenido:

1. **Redirección Directa**: Si el repositorio contiene **exactamente un proyecto**, el sistema redirige automáticamente al usuario hacia esa documentación, eliminando clics innecesarios.
2. **Grid de Selección Centrado**: Si hay múltiples proyectos, se muestra una Landing Page con un diseño **centrado horizontalmente**. Cada tarjeta presenta el icono, nombre y descripción del proyecto.
3. **URLs por Proyecto**: Cada proyecto mantiene su propio contexto de ruteo independiente: `dominio.com/id-proyecto/topico/pagina`.

---

## 🔢 Convención de Numeración de Carpetas

Una de las características clave de FusionDoc es el uso de prefijos numéricos en los nombres de las carpetas (ej. `01-fundamentos`, `02-componentes`). Esta convención tiene dos propósitos fundamentales:

### 1. Orden Físico y de Desarrollo
En sistemas operativos y editores de código (como VS Code), las carpetas se ordenan alfabéticamente por defecto. Al anteponer un número (`01-`, `02-`), garantizas que la estructura de archivos en tu disco coincida exactamente con la progresión lógica de tu documentación, facilitando la edición.

### 2. Procesamiento Inteligente del Motor
El motor core de FusionDoc (`src/lib/github.ts`) procesa estos nombres de la siguiente manera:
- **Limpieza de Títulos:** Si una carpeta se llama `01-fundamentos` y no tiene un título explícito en su `index.md`, el sistema elimina el prefijo `01-` y reemplaza los guiones por espacios para mostrar "**Fundamentos**" en la interfaz.
- **Fall-back de Orden:** Aunque recomendamos usar la propiedad `order` en el Frontmatter, el sistema utiliza la numeración física como un indicador secundario de prioridad para construir la barra lateral (Sidebar).

> [!TIP]
> **URLs Limpias**: Aunque las carpetas tengan números para el orden interno, el sistema está diseñado para que las rutas en el navegador sean memorables y profesionales.

---

## 🧠 Estructura de Navegación (3 Niveles Reales)

Para garantizar una experiencia de usuario (UX) coherente y escalable, FusionDoc implementa una jerarquía de 3 niveles de contenido:

### Nivel 1: El Proyecto (Versión)
Es la carpeta raíz dentro de `docs/`. 
- **Propósito:** Separar diferentes productos o versiones (ej. `v1`, `v2`, `Alpha`).
- **Navegación:** Aparecen en el selector de proyectos (Landing Page o Selector lateral).

### Nivel 2: El Tópico (Carpeta)
Son las carpetas situadas inmediatamente debajo del Proyecto.
- **Propósito:** Agrupar grandes áreas de conocimiento.
- **Navegación:** Aparecen como **pestañas principales en el Header**.
- **Ejemplo:** `docs/v1/01-fundamentos/`. Cada carpeta en este nivel genera una sección independiente de navegación.

### Nivel 3: La Página (Archivo)
Son los archivos `.md` o `.mdx` individuales dentro de un Tópico.
- **Propósito:** Contener el contenido técnico final.
- **Navegación:** Aparecen en la **barra lateral (Sidebar)**.
- **Organización Automática:** Si agrupas archivos en subcarpetas dentro del Tópico (ej. `01-fundamentos/02-organizacion/`), el Sidebar detectará automáticamente esa estructura y creará **categorías colapsables**.

> [!NOTE]
> Esta jerarquía de 3 niveles es la base de todo el sistema de ruteo y es la que utiliza el **Omni Assistant** en el panel de administración para guiarte.

---

## 📝 El Rol Crítico de `index.md`

Cada carpeta (Tópico o Categoría) **debe** contener un archivo `index.md`. Este archivo cumple dos funciones vitales:

1.  **Metadatos del Grupo:** Es el lugar donde defines el `title`, `icon` y `order` que representarán a toda la carpeta en la navegación.
2.  **Landing Page:** Cuando un usuario hace clic en un Tópico (ej. "Fundamentos") sin seleccionar una página interna, el sistema renderiza el `index.md` de esa carpeta.
3.  **Generación de Grids:** FusionDoc detecta automáticamente si estás en un `index.md` y genera una `NavigationGrid` (botonera visual) al final de la página para invitar al usuario a explorar los contenidos internos de esa sección.

---

## 🎨 Arquitectura MDX y Registro

A diferencia de otros sistemas, FusionDoc no requiere que registres cada componente manualmente en cada archivo.

- **Registro Central:** Todos los componentes MDX (Hero, Terminal, Steps, etc.) están registrados en `src/components/MarkdownRenderer.tsx`.
- **Uso Natural:** Puedes escribir `<Terminal />` directamente en cualquier archivo Markdown y el motor sabrá exactamente qué componente de React invocar.
- **Estilos Dinámicos:** El sistema utiliza **Tailwind CSS v4**, lo que permite que el diseño sea extremadamente ligero y que los temas visuales se definan mediante variables CSS (`globals.css`) en lugar de archivos de configuración JSON complejos.

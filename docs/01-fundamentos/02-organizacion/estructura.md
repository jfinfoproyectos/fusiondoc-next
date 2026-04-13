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

## 🔄 Sistema de Versionado

FusionDoc permite gestionar múltiples versiones de tu documentación (ej. v1, v2, v3) de forma simultánea.

### Configuración
El sistema se activa mediante la variable `NEXT_PUBLIC_GITHUB_VERSIONS` en el `.env.local`. Puedes usar una lista simple o un JSON para mayor detalle:

```bash
# Ejemplo avanzado con nombres y descripciones
NEXT_PUBLIC_GITHUB_VERSIONS='[
  {"id": "v1", "name": "V1.0", "description": "Versión inicial"},
  {"id": "v2", "name": "V2.0", "description": "Estable - Recomendada"}
]'
```

### Impacto en la Estructura
Cuando el versionado está activo, el motor de FusionDoc espera que cada entrada del array sea una subcarpeta dentro de `docs/`. 

- **Con Versiones:** La ruta física es `docs/{version}/{topic}/{slug}.md`.
- **Sin Versiones:** La ruta física se mantiene como `docs/{topic}/{slug}.md`.

> [!IMPORTANT]
> Si habilitas versiones, el **Selector de Versiones** aparecerá automáticamente en el Header (barra principal), permitiendo a los usuarios cambiar de contexto manteniendo su posición relativa en la documentación.

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

## 🧠 Estructura de Navegación (3 Niveles)

Para garantizar una experiencia de usuario (UX) coherente, FusionDoc implementa una jerarquía estricta de 3 niveles:

### Nivel 1: Tópicos (Topics)
Son las carpetas raíz dentro de `docs/` (o dentro de la carpeta de versión activa). 
- **Representación:** Aparecen como pestañas principales en el **Header** (barra superior).
- **Ejemplo:** `docs/v1/01-fundamentos/`. Cada tópico agrupa grandes áreas de conocimiento.

### Nivel 2: Categorías (Categories)
Son subcarpetas dentro de un Tópico.
- **Representación:** Aparecen como secciones colapsables en el **Sidebar** (barra lateral izquierda).
- **Ejemplo:** `docs/01-fundamentos/02-organizacion/`. Permiten fragmentar un tema complejo en partes manejables.

### Nivel 3: Hojas o Páginas
Son los archivos `.md` individuales dentro de una Categoría.
- **Representación:** Son los enlaces finales de navegación.
- **Ejemplo:** `docs/01-fundamentos/02-organizacion/estructura.md`.

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

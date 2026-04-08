---
title: Estructura del Proyecto
description: >-
  Análisis detallado de la arquitectura técnica y la organización de contenido
  en FusionDoc.
order: 1
icon: 'lucide:git-merge'
---

# Estructura y Arquitectura del Proyecto

FusionDoc-Next está diseñado con una arquitectura moderna basada en **Next.js (App Router)**, optimizado para procesar MarkDown (MDX) dinámicamente y estructurarlo visualmente sin requerir configuraciones complejas por parte del usuario final.

En este documento detallaremos exhaustivamente la estructura de directorios, el motor de renderizado y cómo interactúan las piezas clave del sistema.

---

## 📂 Visión General del Directorio

El árbol principal del código fuente está diseñado para separar limpiamente la configuración, la interfaz de usuario y el motor lógico.

```bash
fusiondoc-next/
├── docs/                  # 📝 Carpeta raíz de toda tu documentación
├── public/                # 🌐 Archivos estáticos accesibles públicamente (imágenes, logos)
├── src/                   # 💻 Código fuente de la aplicación Next.js
│   ├── app/               # 🚀 Next.js App Router (Páginas, Layouts, API)
│   ├── components/        # 🧩 Componentes React y MDX personalizados
│   ├── lib/               # ⚙️ Lógica base, integraciones y utilidades (Github API, etc.)
│   └── types/             # 🏷️ Definiciones de tipos TypeScript globales
├── tailwind.config.ts     # 🎨 Configuración del motor de estilos Tailwind v4
├── next.config.ts         # ⚙️ Configuración del compilador y bundler de Next.js
└── package.json           # 📦 Control de dependencias (React, Framer Motion, Lucide, etc.)
```

---

## 🧠 Arquitectura Lógica (Motor Core)

La magia de FusionDoc recae en cómo convierte archivos Markdown estáticos en una experiencia Single Page Application completa y veloz.

### 1. Sistema de Enrutamiento (`src/app/[[...slug]]`)
FusionDoc utiliza una ruta atrapalo-todo (Catch-all route) de Next.js llamada `[[...slug]]`.
- **Qué hace:** Intercepta cualquier URL introducida por el navegador (ej: `/01-fundamentos/introduccion`).
- **Cómo lo procesa:** Envía el arreglo de segmentos de la ruta (el `slug`) a nuestro motor central en `src/lib/github.ts`.

### 2. Motor de Extracción (`src/lib/github.ts`)
Este es el cerebro del sistema documental. Exporta métodos vitales como `getDocContent`, `getTopics` y `getNavigation`.
*   **Modo Local (Prioritario):** Escanea tu carpeta local `docs/` usando módulos de servidor (`fs`, `path`). Lee el contenido de los `.md` y extrae su metadato usando `gray-matter`.
*   **Modo GitHub (Fallback):** En producción o despliegues estáticos, si se configura, puede descargar y reconstruir el árbol documental directamente desde la API oficial de GitHub usando control de caché mediante SHA para peticiones ultra rápidas y evitar penalizaciones de Rate Limit.
*   **Manejo de Rutas Base (`index.md`):** Identifica inteligentemente cuándo estás accediendo a la raíz de una carpeta e inyecta dinámicamente sus "hijos" para auto-generar la cuadrícula de navegación.

### 3. Pipeline MDX (`src/components/MarkdownRenderer.tsx`)
Una vez que `github.ts` devuelve el texto plano del archivo Markdown, este componente toma el control.
*   **`MDXRemote`:** Convierte el string Markdown en nodos de React del lado del servidor (RSC).
*   **Plugins Remark/Rehype:** 
    *   `remark-gfm`: Habilita tablas, listas de tareas y auto-enlazado.
    *   `rehype-slug`: Genera IDs automáticos en los títulos para permitir anclas en la tabla de contenidos.
    *   `rehype-pretty-code`: Parsea técnicamente los bloques de código y les aplica coloreado de sintaxis a nivel de servidor utilizando el tema predefinido (Github Dark), integrándolos con la API de tipografía de Tailwind.

---

## 🎨 Arquitectura de la Interfaz (UI)

Toda la estructura visual de la página está montada en `src/app/layout.tsx`, definiendo el marco maestro donde se inyecta el Markdown compilado.

### Layout Principal
El diseño está fuertemente inspirado en soluciones de primer nivel, apoyado en el sistema de cuadrícula (Grid) y cajas flexibles (Flexbox) de Tailwind.

*   `Header (`src/components/Header.tsx`)`: Barra superior. Carga el logo, el componente de barra de búsqueda, el selector de temas y navega entre los **Tópicos** principales que devuelve `getTopics()`.
*   `Sidebar (`src/components/Sidebar.tsx`)`: Panel de navegación primario izquierdo. Analiza activamente tu posición en el documento instanciando `SidebarNav.tsx` y armando una representación jerárquica retráctil segmentada por categorías.
*   `Content Area`: Panel principal y responsivo, envuelto siempre por el utilitario Tipográfico de Tailwind (`.prose`). 
*   `RightSidebar (`src/components/RightSidebar.tsx`)`: Panel opcional diseñado para albergar la "Tabla de Contenidos interna de la página actual" (Tabla de Títulos), permitiendo saltar a secciones dentro del mismo artículo.

### Biblioteca de Componentes MDX
La interfaz Markdown ha sido dotada de esteroides visuales. Residen en `src/components/mdx`. Éstos son componentes React puros que tú puedes usar de manera natural dentro de tus archivos `.md`.
*   `<Alert />`: Componente para banners (Advertencias, Éxitos, Errores).
*   `<CodeTabs />` y `<Terminal />`: Simuladores interactivos para código multilingüístico y líneas de comandos.
*   `<Steps />`: Escaleras numeradas para tutoriales estructurados.

El archivo `src/mdx-components.tsx` funciona como diccionario, informándole al compilador general que si alguien escribe `<Terminal>` en Markdown, debe invocar al componente `.tsx` correspondiente.

---

## 📝 Organización de Documentos (`docs/`)

Para funcionar óptimamente con las lógicas anteriores, la convención física en el disco dentro de esta carpeta debe ser extremadamente ordenada, implementando una regla de "3 niveles jerárquicos".

### Estrategia de los 3 Niveles
1.  **Tópicos (1er Nivel):** Carpetas que representan las pestañas más grandes del proyecto en el Header (Ej: `docs/01-fundamentos/`).
2.  **Categorías (2do Nivel):** Subcarpetas dentro de tu Tópico que agudizan las ramas temáticas y formarán las secciones en la Barra Lateral (Ej: `docs/01-fundamentos/02-organizacion/`).
3.  **Hojas o Páginas (3er Nivel):** Tu colección de archivos con extensión concreta `.md`. 

### Rol del archivo `index.md`
Cada Tópico y cada Categoría se favorecen radicalmente si tienen un archivo interior nombrado `index.md`.
Este sirve como la **Landing Page** o cartelera de bienvenida a ese cajón.
Si visitas `/01-fundamentos`, FusionDoc automáticamente buscará `docs/01-fundamentos/index.md` y creará, en su parte inferior, una botonera cuadriculada (NavigationGrid) dándote rápido acceso a todas las hojas en su interior.

### Frontmatter (YAML)
El motor de metadatos exige un bloque en la cima de cada documento `.md`:
```yaml
---
title: Arquitectura
description: Resumen técnico del framework
order: 1
draft: false 
date: 2026-05-15
icon: lucide:git-merge
---
```
*   `title`: Reemplaza el nombre puramente "del archivo de texto" por un formato humanizado.
*   `order`: Modifica en qué orden ascendente procesa y renderiza el SidebarNav este documento.
*   `draft`: Si está `true`, desactiva por completo el procesamiento en compilación y devuelve un error de seguridad silencioso ante requests.
*   `date`: (Opcional) Fecha de **Publicación Programada** (Formato `YYYY-MM-DD`). Si configuras una fecha futura, el documento será invisible en todo el ecosistema hasta que se alcance esa fecha.
*   `icon`: (Opcional) Cadena con el formato `coleccion:nombre` (ej. `lucide:rocket`) inyectado automáticamente en topics, sidebars y grids.

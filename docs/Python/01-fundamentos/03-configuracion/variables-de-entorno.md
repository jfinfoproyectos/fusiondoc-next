---
title: Variables de Entorno
description: Aprende a configurar las variables de entorno necesarias para FusionDoc.
order: 1
icon: 'lucide:variable'
---

# Variables de Entorno

FusionDoc utiliza variables de entorno para configurar aspectos como el token de GitHub, la rama por defecto y el repositorio de origen.

### ⚙️ Configuración General

<PropertyTable items="[
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    type: 'string',
    description: 'URL base en producción (ej. https://docs.tusitio.com) utilizada para sitemaps y metaetiquetas SEO.',
    required: true
  }
]" />

### 💻 Orígenes de Documentación (Local vs GitHub)

Controla desde dónde FusionDoc lee los archivos Markdown de tu proyecto, permitiendo apagar GitHub e ingerir carpetas locales.

<PropertyTable items="[
  {
    name: 'USE_LOCAL_DOCS',
    type: 'boolean',
    description: 'Bandera maestra. Si es true, Vercel o tu entorno Localhost forzarán la lectura de la carpeta interna `/docs` eliminando el soporte de GitHub. (Recomendado para Vercel).',
    required: false
  },
  {
    name: 'DOCKER_USE_LOCAL_VOLUMES',
    type: 'boolean',
    description: 'Bandera exclusiva para Contenedores Docker. Si es true, el contenedor consumirá los documentos montados por el volumen de Docker-Compose.',
    required: false
  }
]" />

### ☁️ Modo Remoto (GitHub)

<PropertyTable items="[
  {
    name: 'GITHUB_TOKEN',
    type: 'string',
    description: 'Token de acceso personal (PAT). Altamente recomendado para evitar el rate-limiting de la API pública.',
    required: false
  },
  {
    name: 'GITHUB_OWNER',
    type: 'string',
    description: 'Nombre de usuario o de la organización propietaria del repositorio de documentos.',
    required: true
  },
  {
    name: 'GITHUB_REPO',
    type: 'string',
    description: 'Nombre del repositorio que contiene la carpeta /docs.',
    required: true
  },
  {
    name: 'GITHUB_BRANCH',
    type: 'string',
    description: 'Rama de la cual extraer la información (por defecto: main).',
    required: false
  },
  {
    name: 'GITHUB_DOCS_PATH',
    type: 'string',
    description: 'Carpeta interna del repositorio donde residen los Markdowns (por defecto: docs).',
    required: false
  }
]" />

### 🎨 Diseño y Branding

Configura la identidad visual de tu portal de documentación.

<PropertyTable items="[
  {
    name: 'SITE_TITLE',
    type: 'string',
    description: 'El título de tu sitio. Aparece en el Header y en la pestaña del navegador.',
    required: false
  },
  {
    name: 'SITE_LOGO',
    type: 'string',
    description: 'Icono del sitio utilizando formato Iconify (ej. lucide:package).',
    required: false
  },
  {
    name: 'FOOTER',
    type: 'string',
    description: 'Texto copyright o mensaje para el pie de página. Si está vacío, el footer no se muestra.',
    required: false
  },
  {
    name: 'FOOTER_LINKS',
    type: 'JSON',
    description: 'Lista de enlaces con iconos para el footer en formato JSON.',
    required: false
  },
  {
    name: 'DEFAULT_THEME',
    type: 'string',
    description: 'Fuerza un tema visual específico y oculta el selector (ej: cyberpunk).',
    required: false
  },
  {
    name: 'DEFAULT_CODE_THEME',
    type: 'string',
    description: 'Fuerza un tema de código Shiki específico y oculta el selector (ej: dracula).',
    required: false
  },
  {
    name: 'DEFAULT_APPEARANCE',
    type: 'string',
    description: 'Fuerza el modo claro u oscuro y oculta el selector (valores: light | dark).',
    required: false
  }
]" />

#### Ejemplo de FOOTER_LINKS
Para configurar iconos sociales o enlaces legales en el footer, usa el siguiente formato en tu `.env.local`:

```bash
FOOTER_LINKS=[
  {"name":"GitHub","url":"https://github.com/tu-usuario","icon":"mdi:github"},
  {"name":"Twitter","url":"https://twitter.com/tu-cuenta","icon":"mdi:twitter"}
]
```

> [!TIP]
> Puedes encontrar miles de iconos disponibles en el buscador oficial de [Iconify](https://icon-sets.iconify.design/).

> [!WARNING]
> **Aviso sobre Turbopack en modo de desarrollo local:** Si el servidor de Next.js está en ejecución (`npm run dev`) y editas el archivo `.env.local` drásticamente (ej. cambiando valores del theme o de rutas), podrías encontrar un "Fatal Error: Next.js package not found". Esto es provocado por una desincronización de caché en Turbopack a nivel de rutas complejas SSG. **Solución:** Detén tu servidor (`Ctrl + C`), borra manualmente la carpeta oculta `.next` y vuelve a correr `npm run dev`.

> [!IMPORTANT]
> Recuerda nunca subir tu `.env.local` al repositorio público.

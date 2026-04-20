---
title: Variables de Entorno
description: Aprende a configurar las variables de entorno necesarias para FusionDoc.
order: 1
icon: 'lucide:variable'
---

# Variables de Entorno

FusionDoc utiliza variables de entorno para configurar aspectos como el token de GitHub, la rama por defecto y el repositorio de origen.

### ⚙️ Modos de Operación (Público vs Gestionado)

FusionDoc puede operar en dos modos fundamentales controlados por estados de base de datos.

<PropertyTable items="[
  {
    name: 'ENABLE_AUTH_DB',
    type: 'boolean',
    description: 'Cambia entre Modo Público (false) donde todo es abierto y no requiere DB, y Modo Gestionado (true) con Login y Panel de Control.',
    required: false
  },
  {
    name: 'DATABASE_PROVIDER',
    type: 'string',
    description: 'Motor de base de datos a utilizar (postgresql, sqlite, mysql). Crucial para el script de sincronización dinámica.',
    required: false
  }
]" />

### 🗄️ Conexión de Base de Datos

<PropertyTable items="[
  {
    name: 'DATABASE_URL',
    type: 'string',
    description: 'URL de conexión principal. Se utiliza tanto para la ejecución de la app como para las migraciones de esquema.',
    required: true
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
    description: 'Texto copyright o mensaje para el pie de página.',
    required: false
  },
  {
    name: 'SOCIAL_LINKS',
    type: 'JSON',
    description: 'Lista de enlaces sociales con iconos para el Header (ej. GitHub, YouTube, Twitter).',
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

#### Ejemplo de SOCIAL_LINKS
Para configurar iconos sociales en el header, usa el siguiente formato en tu `.env.local`:

```bash
SOCIAL_LINKS=[
  {"name":"GitHub","url":"https://github.com/tu-usuario","icon":"mdi:github"},
  {"name":"Twitter","url":"https://twitter.com/tu-cuenta","icon":"mdi:twitter"},
  {"name":"YouTube","url":"https://youtube.com","icon":"mdi:youtube"}
]
```

> [!TIP]
> Puedes encontrar miles de iconos disponibles en el buscador oficial de [Iconify](https://icon-sets.iconify.design/).

> [!WARNING]
> **Aviso sobre Turbopack en modo de desarrollo local:** Si el servidor de Next.js está en ejecución (`npm run dev`) y editas el archivo `.env.local` drásticamente (ej. cambiando valores del theme o de rutas), podrías encontrar un "Fatal Error: Next.js package not found". Esto es provocado por una desincronización de caché en Turbopack a nivel de rutas complejas SSG. **Solución:** Detén tu servidor (`Ctrl + C`), borra manualmente la carpeta oculta `.next` y vuelve a correr `npm run dev`.

> [!IMPORTANT]
> Recuerda nunca subir tu `.env.local` al repositorio público.

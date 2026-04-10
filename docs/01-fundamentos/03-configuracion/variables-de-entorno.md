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

### 💻 Modo Local

<PropertyTable items="[
  {
    name: 'LOCAL_DOCS_PATH',
    type: 'string',
    description: 'Ruta absoluta o relativa a tu carpeta local de documentación (./docs). Si existe, el sistema entra en Modo Local.',
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
FOOTER_LINKS='[
  {"name":"GitHub","url":"https://github.com/tu-usuario","icon":"mdi:github"},
  {"name":"Twitter","url":"https://twitter.com/tu-cuenta","icon":"mdi:twitter"}
]'
```

> [!TIP]
> Puedes encontrar miles de iconos disponibles en el buscador oficial de [Iconify](https://icon-sets.iconify.design/).

> [!IMPORTANT]
> Recuerda nunca subir tu `.env` al repositorio público.

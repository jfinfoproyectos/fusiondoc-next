---
title: Variables de Entorno
description: Aprende a configurar las variables de entorno necesarias para FusionDoc.
order: 1
icon: 'lucide:variable'
---

# Variables de Entorno

FusionDoc utiliza variables de entorno para configurar aspectos como el token de GitHub, la rama por defecto y el repositorio de origen.

## Variables Principales
- `GITHUB_TOKEN`: Para aumentar el límite de peticiones a la API.
- `LOCAL_DOCS_PATH`: Para desarrollo local indicando la ruta de la carpeta `docs`.
- `NEXT_PUBLIC_SITE_URL`: Para la generación de sitemaps y metadatos SEO.

> [!TIP]
> Recuerda nunca subir tu `.env` al repositorio público.

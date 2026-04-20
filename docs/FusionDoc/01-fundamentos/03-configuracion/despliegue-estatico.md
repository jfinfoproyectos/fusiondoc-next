---
title: Despliegue Estático (SSG)
description: Configuración avanzada para desplegar FusionDoc como sitio estático en GitHub Pages (SSG) usando Next.js 16.
order: 3
icon: 'lucide:server'
---

# Despliegue Estático y Modo Público

La arquitectura híbrida de **FusionDoc** permite que este portal de documentación funcione con un consumo mínimo de recursos. Para lograr una experiencia similar a un sitio estático tradicional, hemos introducido el **Modo Público**.

### 🌟 El Poder del Modo Público
Al configurar `ENABLE_AUTH_DB=false` en tus variables de entorno, FusionDoc entra en un estado de **Zero-Dependencia**:
- **Sin Base de Datos**: No se realizan consultas a Prisma ni a SQL.
- **Acceso Abierto**: Se eliminan todos los controles de autenticación y grupos.
- **Rápido como el Rayo**: El sistema sirve los Markdowns directamente desde GitHub o la caché local con latencia mínima.

Esta configuración es la recomendada para desplegar en servicios como **Vercel, Railway o GitHub Pages**, donde se busca un portal informativo abierto al mundo.

### 1. Activar el Modo de Exportación en `next.config.ts`

Verifica en tu rama de publicación o en el workflow que Next.js tenga configurado el entorno de exportación:

```ts next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true }, // Importante para Github Pages!
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

export default nextConfig;
```

### 2. Flujo Integrado de GitHub Actions (GitHub Pages)

Para lograr un ciclo continuo automatizado en GitHub Pages, FusionDoc utiliza un workflow que ejecuta los siguientes pasos tras hacer un *push* a la rama `main`:

1.  **Clona el repositorio**.
2.  **Instala las dependencias** (con React 19 y Node 20+).
3.  **Ejecuta `npm run build`** (esto compila tus documentaciones y genera el path `./out`).
4.  Sube el directorio `./out` a la rama asilada `gh-pages` de tu repo, o al entorno de *GitHub Pages*.

## Consideraciones sobre Orama y Búsqueda Frontend

Al construir estáticamente el sistema, herramientas de búsqueda como **Orama** inicializan el índice del sitio directamente en el cliente o cargan el índice precargado, manteniendo velocidades increíbles sin necesidad de bases de datos remotas.

> [!WARNING]  
> Ten en cuenta que si usas características asíncronas basadas en SSR puro (Server Actions con base de datos), fallarán en un entorno `output: 'export'`. Sin embargo, FusionDoc está aislado específicamente para ser *SSG-ready*.

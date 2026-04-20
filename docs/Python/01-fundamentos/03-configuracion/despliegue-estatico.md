---
title: Despliegue Estático (SSG)
description: Configuración avanzada para desplegar FusionDoc como sitio estático en GitHub Pages (SSG) usando Next.js 16.
order: 3
icon: 'lucide:server'
---

# Despliegue Estático Máximo (SSG)

La gran ventaja de la arquitectura híbrida de **FusionDoc en Next.js 16** es que todo este portal de documentación dinámico puede ser estáticamente pre-renderizado (SSG). Esto significa que no necesitas servidores costosos; puedes alojar tu documentación completamente gratis en servicios como **GitHub Pages, Vercel o Netlify**.

## Cómo funciona la exportación estática

Por defecto, la función `generateStaticParams()` extrae todas las rutas disponibles de tus archivos markdown (los localizados en la carpeta `docs/` o aquellos servidos a través de la API de GitHub). 

Luego, en tiempo de compilación (build-time), compilará cada uno de los archivos `.md/.mdx` al igual que sus componentes React en HTML/CSS plano y cargará el JS interactivo (Hydration) posteriormente.

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

---
title: Añadir Componentes MDX
description: Guía paso a paso sobre cómo programar e inyectar un nuevo componente React dentro de tus documentos Markdown.
order: 3
icon: lucide:code
---

# Creando y Registrando MDX Components

Una de las piezas de valor más fuertes de **FusionDoc** es la integración con Next.js y su ecosistema interactivo a través de `next-mdx-remote`. En lugar de estar atado a simple texto o imágenes en el documento, puedes inyectar tus propios UI Components en React e incrustarlos en vivo al cuerpo del markdown.

En este tutorial diseñaremos un **"Boton Destacado"** puramente de ejemplo para demostrar flujos de registro.

## Paso 1: Programa el componente en React

Cualquier componente a inyectar se escribe como un `.tsx` tradicional. Nosotros los organizamos en `src/components/mdx` para el ecosistema Markdown.

Crea el archivo `src/components/mdx/FeatureButton.tsx`
```tsx
"use client";

import React from 'react';

// Recuerda exportar tu componente para importaciones
export function FeatureButton({ label, link }: { label: string, link: string }) {
  return (
    <a 
      href={link} 
      className="inline-block my-4 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-transform hover:scale-105"
    >
      {label}
    </a>
  );
}
```

> [!CAUTION]
> Si tu componente va a utilizar interactividad (Botones reales de estado de React, animaciones Framer-Motion, tooltips o useStates) debes inyectar `"use client";` arriba del todo como en nuestro código.


## Paso 2: Registra en el Parser MDX

Dado que en FusionDoc renderizamos los markdown localmente fuera del Router central de páginas, **no basta** con declararlo en `mdx-components.tsx`. Necesitas inyectarlo en el parseador manual.

Abre el archivo de servidor: `src/components/MarkdownRenderer.tsx`.

1. Importas tu función en las cabeceras:
```tsx
import { FeatureButton } from "./mdx/FeatureButton";
```

2. Registra el nombre en el vector `components`:
```tsx
const components = {
  // Map standard HTML tags or custom components
  CodeTabs,
  CodeTab,
  Terminal,
  Steps,
  Step,
  CodeBlockWrapper,
  Alert,
  Icon: MdxIcon,
  // **AQUÍ INYECTAS TU BOTÓN**
  FeatureButton: FeatureButton, 
  
  // Mapping lowercase for compatibility
  featurebutton: FeatureButton, // En caso de que se escriba en minúsculas en el MD
  // ...
};
```

## Paso 3: ¡Úsalo en la documentación!

Ya que fue inyectado globalmente al Parser, ahora todos tus archivos en `docs/**/*.md` conocen ese `<Tag />`. ¡Pruébalo libremente!

Ejemplo en tu `cualquier-archivo.md`:

```mdx
Bienvenido a este grandioso artículo. Nos gustaría que te llevaras mucho de este texto.
Y sí deseas suscribirte a la red no dudes en presionar:

<FeatureButton label="Suscríbete ahora gratis" link="https://google.com" />
```

Ese fragmento se transformaría exitosamente en un botón con Tailwind e interactividad `React` embebido en tu contenido estático.

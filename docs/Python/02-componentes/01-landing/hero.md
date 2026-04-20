---
title: Sección Hero
description: Un componente de alto impacto visual para encabezados de página y landing pages.
icon: 'lucide:layout'
order: 10
---

# Hero Component

El componente `Hero` está diseñado para captar la atención del usuario de inmediato. Utiliza animaciones de entrada suaves (vía Framer Motion) y soporta efectos de vidrio, gradientes y botones de acción.

## Ejemplo

### Hero Centrado (Gradiente)

Ideal para introducciones de módulos o secciones principales.

<Hero 
  title="Bienvenido a FusionDoc"
  description="La plataforma definitiva para documentación técnica premium, construida con Next.js 16 y optimizada para la experiencia del desarrollador."
  icon="Zap"
  variant="gradient"
  actions={[
    { label: "Primeros Pasos", href: "/01-introduccion/instalacion", variant: "primary", icon: "ArrowRight" },
    { label: "Ver en GitHub", href: "#", variant: "outline", icon: "Github" }
  ]}
/>

### Hero a la Izquierda (Glassmorphism)

Perfecto para guías técnicas que requieren un estilo más sobrio pero moderno.

<Hero 
  align="left"
  variant="glass"
  title="Componentes Extendidos"
  description="Explora nuestra biblioteca de UI diseñada para ser tanto funcional como estéticamente impresionante."
  actions={[
    { label: "Explorar UI", href: "/02-componentes", variant: "primary" }
  ]}
/>

### Hero con Imagen de Fondo

Ideal para portadas principales que requieren un impacto visual inmersivo. El componente añade automáticamente un velo (overlay) para asegurar que el texto sea legible.

<Hero 
  title="Diseño Inmersivo"
  description="Añade fácilmente imágenes externas o locales a tus encabezados. El texto siempre será legible gracias al degradado automático."
  backgroundImage="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
  align="left"
  actions={[
    { label: "Ver Galería", href: "#", variant: "primary", icon: "Image" }
  ]}
/>

## Uso en MDX

```mdx
<Hero 
  title="Título Impactante"
  description="Breve descripción del contenido."
  icon="Box" // Nombre de icono de Lucide
  variant="gradient" // 'gradient' | 'glass' | 'minimal'
  align="center" // 'left' | 'center'
  backgroundImage="/images/mi-fondo.jpg" // URL externa o path local
  actions={[
    { label: "Botón 1", href: "/ruta", variant: "primary" },
    { label: "Botón 2", href: "/ruta", variant: "outline" }
  ]}
/>
```

## Propiedades del objeto

### `<Hero>`

| Prop | Tipo | Valor por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Requerido** | El encabezado principal en negrita. |
| `description` | `string` | `undefined` | Texto de apoyo debajo del título. |
| `icon` | `string` | `undefined` | Nombre de icono de Lucide (ej: 'Code', 'Layers'). |
| `variant` | `enum` | `'gradient'` | Estilo visual: `gradient`, `glass`, `minimal`. |
| `align` | `enum` | `'center'` | Alineación del texto: `left`, `center`. |
| `backgroundImage`| `string` | `undefined` | URL o path de una imagen para usar de fondo inmersivo. |
| `actions` | `array` | `[]` | Lista de botones de acción `{ label, href, variant, icon }`. |

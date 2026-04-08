---
title: Cuadrícula Bento
description: Cómo crear layouts modernos de cuadrícula para presentar características.
icon: 'lucide:layout-grid'
order: 10
---

# Cuadrícula Bento

El componente `BentoGrid` (o su alias `bento`) es ideal para crear secciones visuales impactantes, como por ejemplo en una página de inicio o resumen de características.

## Ejemplo de Cuadrícula

<BentoGrid>
  <BentoCard 
    title="Rendimiento Extreme" 
    description="Optimizado con Next.js 16 para cargas instantáneas en milisegundos." 
    icon={<icon icon="lucide:zap" />}
    className="md:col-span-2"
  />
  <BentoCard 
    title="Seguridad" 
    description="Validación completa." 
    icon={<icon icon="lucide:shield" />}
  />
</BentoGrid>

## Uso en MDX

```mdx
<BentoGrid>
  <BentoCard 
    title="Título" 
    description="Descripción." 
    icon={<icon icon="lucide:name" />}
    className="md:col-span-2" // Opcional para celdas dobles
  />
</BentoGrid>
```

### Propiedades de BentoCard
| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `title` | `string` | **Requerido**. Título de la tarjeta. |
| `description` | `string` | Descripción del ítem o característica. |
| `icon` | `React.ReactNode` | Elemento de icono (usa `<icon />`). |
| `className` | `string` | Clases de Tailwind (ej: `md:col-span-2`). |

> [!TIP]
> Puedes anidar cualquier otro componente dentro de un `<BentoCard />`, como un botón o una imagen.

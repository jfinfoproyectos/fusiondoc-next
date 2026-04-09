---
title: Interactive Roadmap
description: Muestra el progreso del producto con una línea de tiempo interactiva y estados de desarrollo.
icon: 'lucide:map'
---

# Interactive Roadmap

El componente `<Roadmap />` es una herramienta visual premium para comunicar el estado de desarrollo de funcionalidades o versiones de tu proyecto.

## Uso Básico

Define una lista de hitos dentro del contenedor `Roadmap`.

```jsx
<Roadmap>
  <RoadmapItem 
    title="Versión 1.0 Lanzada" 
    status="released" 
    date="Enero 2024" 
    description="Lanzamiento oficial de FusionDoc con soporte para MDX y temas personalizados."
  />
  <RoadmapItem 
    title="Nuevos Componentes Premium" 
    status="beta" 
    date="En curso" 
    description="Integración de mapas interactivos y gráficos avanzados."
  />
  <RoadmapItem 
    title="IA Documentación" 
    status="planned" 
    description="Asistente de IA para responder preguntas sobre la documentación."
    isLast={true}
  />
</Roadmap>
```

## Estados de RoadmapItem

Cada hito puede tener uno de los siguientes estados, los cuales cambian el color y el icono automáticamente:

| Estado | Icono | Color | Significado |
| :--- | :--- | :--- | :--- |
| `released` | Rocket | Verde | Funcionalidad ya disponible. |
| `beta` | Star | Púrpura | En fase de pruebas abierta. |
| `in-progress` | Circle | Azul | En desarrollo activo. |
| `planned` | Clock | Gris | Planificado para el futuro. |

## Propiedades de RoadmapItem

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Requerido** | Título del hito. |
| `status` | `'released' \| 'beta' \| 'in-progress' \| 'planned'` | **Requerido** | Estado visual del hito. |
| `description` | `string` | - | Descripción del hito. |
| `date` | `string` | - | Fecha o período estimado. |
| `isLast` | `boolean` | `false` | Oculta la línea conectora bajo el último elemento. |

## Ejemplo Dinámico

<Roadmap>
  <RoadmapItem 
    title="Fase de Estabilización" 
    status="released" 
    date="Hace 2 semanas" 
    description="Limpieza de código base y optimización del motor de búsqueda interno."
  />
  <RoadmapItem 
    title="Nuevos Componentes Visuales" 
    status="in-progress" 
    date="Fecha estimada: Mayo 2024" 
    description="Estamos trabajando en el FeatureGlow y el Roadmap que estás viendo ahora mismo."
  />
  <RoadmapItem 
    title="Exploración de Plugins Externos" 
    status="planned" 
    description="Apertura de la API para que la comunidad pueda crear sus propios componentes de documentación."
    isLast={true}
  />
</Roadmap>

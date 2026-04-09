---
title: Feature Glow Cards
description: Tarjetas con un efecto de resplandor interactivo que sigue el movimiento del mouse.
icon: 'lucide:sparkles'
---

# Feature Glow Cards

El componente `<FeatureGlow />` permite crear una cuadrícula de tarjetas con un efecto "spotlight" premium. El resplandor sigue dinámicamente el cursor del usuario, creando una experiencia inmersiva y moderna.

## Uso Básico

Para usar este componente, utiliza `FeatureGlow` como contenedor y `FeatureGlowCard` para cada elemento.

```jsx
<FeatureGlowGrid columns={3}>
  <FeatureGlowCard 
    title="Diseño Premium" 
    description="Efectos de glassmorphism y animaciones suaves con Framer Motion."
    icon="Palette"
  />
  <FeatureGlowCard 
    title="Rendimiento" 
    description="Optimizado para cargar instantáneamente sin sacrificar la estética."
    icon="Zap"
  />
  <FeatureGlowCard 
    title="Personalizable" 
    description="Ajusta colores, iconos y columnas según tus necesidades."
    icon="Settings"
  />
</FeatureGlowGrid>
```

## Propiedades de FeatureGlow (Contenedor)

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `columns` | `1 \| 2 \| 3 \| 4` | `3` | Número de columnas en la cuadrícula. |
| `className` | `string` | - | Clases adicionales de CSS. |

## Propiedades de FeatureGlowCard

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Requerido** | Título de la tarjeta. |
| `description` | `string` | - | Descripción corta. |
| `icon` | `string` | - | Nombre del icono de Lucide. |
| `glowColor` | `string` | `rgba(var(--primary-rgb), 0.15)` | Color del efecto de resplandor. |
| `href` | `string` | - | URL de destino (opcional). |

## Ejemplo Dinámico

<FeatureGlowGrid columns={2}>
  <FeatureGlowCard 
    title="Interacción Fluida" 
    description="El efecto de luz sigue tu mouse de forma natural para guiar la atención."
    glowColor="rgba(59, 130, 246, 0.2)"
    icon="MousePointer2"
  />
  <FeatureGlowCard 
    title="Modo Oscuro Integrado" 
    description="Se adapta perfectamente tanto a temas claros como oscuros manteniendo la elegancia."
    glowColor="rgba(139, 92, 246, 0.2)"
    icon="Moon"
  />
</FeatureGlowGrid>

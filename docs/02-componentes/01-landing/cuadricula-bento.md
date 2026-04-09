---
title: Cuadrícula Bento
description: Muestra características o contenido en una cuadrícula moderna y responsiva con celdas de diferentes tamaños.
icon: 'lucide:layout-grid'
order: 5
---

# Cuadrícula Bento

La `<BentoGrid />` es un sistema de diseño moderno inspirado en las cajas bento japonesas, permitiendo organizar elementos (tarjetas) de forma no lineal. Es ideal para secciones de características en landing pages o dashboards.

## Uso Básico

Combina el contenedor `<BentoGrid />` con múltiples `<BentoCard />`.

```jsx
<BentoGrid columns={3}>
  <BentoCard 
    title="Análisis Masivo" 
    description="Procesa millones de registros en segundos con nuestro motor optimizado."
    icon="Zap"
    colSpan={2}
  />
  <BentoCard 
    title="Seguridad" 
    description="Cifrado E2E en todos tus datos."
    icon="Lock"
  />
  <BentoCard 
    title="API Flexible" 
    description="Integración sencilla con cualquier stack tecnológico."
    icon="Code2"
  />
  <BentoCard 
    title="Soporte 24/7" 
    description="Equipo dedicado a tu éxito."
    icon="LifeBuoy"
    colSpan={2}
  />
</BentoGrid>
```

<BentoGrid columns={3}>
  <BentoCard 
    title="Análisis Masivo" 
    description="Procesa millones de registros en segundos con nuestro motor optimizado."
    icon="Zap"
    colSpan={2}
  />
  <BentoCard 
    title="Seguridad" 
    description="Cifrado E2E en todos tus datos."
    icon="Lock"
  />
  <BentoCard 
    title="API Flexible" 
    description="Integración sencilla con cualquier stack tecnológico."
    icon="Code2"
  />
  <BentoCard 
    title="Soporte 24/7" 
    description="Equipo dedicado a tu éxito."
    icon="LifeBuoy"
    colSpan={2}
  />
</BentoGrid>

---

## Diseños Complejos

Puedes jugar con `colSpan` y `rowSpan` para crear jerarquías visuales.

<BentoGrid columns={3}>
  <BentoCard 
    title="Característica Destacada" 
    description="Esta tarjeta ocupa más espacio para llamar la atención del usuario inmediatamente."
    icon="Star"
    colSpan={2}
    rowSpan={2}
  />
  <BentoCard 
    title="Rápido" 
    description="Optimizado para velocidad."
    icon="FastForward"
  />
  <BentoCard 
    title="Cloud" 
    description="Sincronización total."
    icon="Cloud"
  />
  <BentoCard 
    title="Comunidad" 
    description="Únete a miles de devs."
    icon="Users"
    colSpan={3}
  />
</BentoGrid>

---

## Propiedades de BentoGrid

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `columns` | `1 \| 2 \| 3 \| 4` | `3` | Número de columnas en pantallas grandes (desktop). |
| `className` | `string` | - | Clases CSS adicionales para el contenedor. |

## Propiedades de BentoCard

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Requerido** | Título de la tarjeta. |
| `description` | `string` | - | Texto descriptivo debajo del título. |
| `icon` | `string` | - | Nombre del icono de Lucide (ej: "Zap", "Lock"). |
| `colSpan` | `1 \| 2 \| 3` | `1` | Cuántas columnas ocupa la tarjeta. |
| `rowSpan` | `1 \| 2` | `1` | Cuántas filas ocupa la tarjeta. |
| `href` | `string` | - | Si se define, la tarjeta se convierte en un enlace. |
| `className` | `string` | - | Clases CSS adicionales para la tarjeta. |

> [!TIP]
> Usa iconos descriptivos y títulos cortos para mantener la cuadrícula limpia y escaneable.

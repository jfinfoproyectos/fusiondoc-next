---
title: Línea de Tiempo
description: Cómo crear historiales de eventos, lanzamientos o procesos de forma secuencial.
icon: 'lucide:git-commit'
order: 11
---

# Línea de Tiempo

El componente `Timeline` (o su alias `timeline`) permite visualizar una secuencia cronológica de eventos o hitos de manera profesional.

## Ejemplo de Línea de Tiempo

<Timeline>
  <TimelineItem title="Versión 1.2.0" date="Abril 2026" variant="success">
    Añadimos soporte para la biblioteca extendida de componentes interactivos y mejoras de rendimiento.
  </TimelineItem>
  <TimelineItem title="Beta Pública" date="Marzo 2026" variant="warning">
    Lanzamiento inicial de la plataforma FusionDoc para pruebas comunitarias.
  </TimelineItem>
  <TimelineItem title="Desarrollo Inicial" date="Enero 2026">
    Primer prototipo del sistema de documentación basado en Next.js y Markdown.
  </TimelineItem>
</Timeline>

## Uso en MDX

```mdx
<Timeline>
  <TimelineItem title="Título" date="Fecha" variant="success">
    Contenido descriptivo aquí.
  </TimelineItem>
</Timeline>
```

### Propiedades de TimelineItem
| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `title` | `string` | **Requerido**. El título del hito o evento. |
| `date` | `string` | La fecha o marca de tiempo mostrada arriba. |
| `variant` | `string` | El color del nodo (`default`, `success`, `warning`, `error`). |

> [!TIP]
> Dentro de un `<TimelineItem />` puedes usar otros componentes MDX como negritas, enlaces o incluso pequeñas imágenes.

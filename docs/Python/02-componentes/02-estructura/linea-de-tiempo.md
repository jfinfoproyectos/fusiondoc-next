---
title: Línea de Tiempo
description: Visualiza eventos, hitos o mapas de ruta de manera cronológica.
icon: 'lucide:git-pull-request'
order: 9
---

# Línea de Tiempo

El componente `<Timeline />` es perfecto para mostrar el historial de un proyecto, registros de cambios (changelogs) o planes futuros de una manera estructurada y visual.

## Ejemplo de Mapa de Ruta

Combina diferentes variantes para indicar el estado de cada hito.

<Timeline>
  <TimelineItem 
    title="Lanzamiento Versión 1.0" 
    date="Enero 2026" 
    variant="success"
  >
    Lanzamiento oficial de FusionDoc con soporte completo para MDX y temas dinámicos.
  </TimelineItem>
  
  <TimelineItem 
    title="Beta de Componentes IA" 
    date="Marzo 2026" 
    variant="active"
  >
    Integración experimental con modelos de lenguaje para generación automática de documentación.
  </TimelineItem>
  
  <TimelineItem 
    title="Soporte para Plugins Externos" 
    date="Julio 2026" 
    variant="default"
  >
    Permitir que la comunidad cree sus propios componentes y extensiones para el sistema.
  </TimelineItem>
</Timeline>

## Uso en MDX

Envuelve elementos `<TimelineItem />` dentro de un contenedor `<Timeline />`.

````mdx
<Timeline>
  <TimelineItem title="Paso 1" date="2024" variant="success">
    Contenido del paso 1.
  </TimelineItem>
  <TimelineItem title="Paso 2" date="En progreso" variant="active">
    Contenido del paso 2.
  </TimelineItem>
</Timeline>
````

## Propiedades

### `<TimelineItem>`

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `title` | `string` | **Requerido**. Título del hito. |
| `date` | `string` | Fecha o periodo de tiempo (aparece a la derecha). |
| `variant` | `string` | Estilo visual: `default`, `success`, `warning`, `info`, `active`. |

> [!TIP]
> La variante `active` incluye una pequeña animación de pulso, lo que la hace ideal para señalar hitos en los que se está trabajando actualmente.

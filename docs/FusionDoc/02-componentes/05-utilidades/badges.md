---
title: Badges (Etiquetas)
description: Cómo usar pequeñas etiquetas de estado para categorizar o resaltar contenido.
icon: 'lucide:badge'
order: 12
---

# Badges (Etiquetas)

El componente `Badge` (o su alias `badge`) permite añadir indicadores visuales compactos para estados, categorías o novedades.

## Ejemplo

<div className="flex gap-2 flex-wrap my-4">
  <Badge variant="purple">Nuevo</Badge>
  <Badge variant="success">Estable</Badge>
  <Badge variant="info">Beta</Badge>
  <Badge variant="warning">Experimental</Badge>
  <Badge variant="error">Depreciado</Badge>
</div>

## Uso en MDX

```mdx
<Badge variant="success">Mensaje</Badge>
```

## Propiedades del objeto
| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `variant` | `string` | **Requerido**. El color del badge (`default`, `info`, `success`, `warning`, `error`, `purple`, `outline`). |

### Estilos Visuales
Los badges utilizan un estilo **Glassmorphism** que se adapta tanto al modo claro como al modo oscuro, manteniendo siempre una alta legibilidad.

> [!TIP]
> Son ideales para poner al lado de títulos de componentes para indicar si son experimentales o están en beta.

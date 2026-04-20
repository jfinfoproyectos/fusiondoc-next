---
title: Premium Tooltips
description: Muestra información contextual elegante al pasar el cursor sobre términos o elementos.
icon: 'lucide:message-square'
---

# Premium Tooltips

El componente `<Tooltip />` permite añadir explicaciones cortas o glosarios sin interrumpir el flujo de lectura. Utiliza una animación suave de elevación y un fondo con desenfoque (backdrop blur).

## Uso Básico

Envuelve la palabra o frase que quieres explicar y proporciona el texto de ayuda en la propiedad `content`.

```jsx
<p>
  Puedes aprender más sobre el{" "}
  <Tooltip content="Un tooltip es una pequeña ventana emergente que proporciona información adicional.">
    hover
  </Tooltip>{" "}
  en este párrafo.
</p>
```

## Propiedades

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `content` | `string` | **Requerido** | El texto que se mostrará dentro del tooltip. |
| `className` | `string` | - | Clases adicionales para el texto activador. |

## Ejemplo Dinámico

En FusionDoc-Next, priorizamos la <Tooltip content="Diseño que prioriza la estética y la experiencia de usuario de alto nivel.">Experiencia Premium</Tooltip> y la velocidad de <Tooltip content="El proceso de convertir archivos MDX en páginas web interactivas.">renderizado</Tooltip>. Pasa el mouse por las palabras subrayadas para ver el efecto.

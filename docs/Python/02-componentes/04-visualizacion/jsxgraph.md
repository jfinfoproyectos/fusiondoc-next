---
title: Gráficos Matemáticos (JSXGraph)
description: Visualiza y manipula gráficos interactivos, diagramas geométricos y funciones matemáticas complejas mediante JSXGraph.
icon: 'lucide:line-chart'
order: 25
---

# Funciones y Gráficos con JSXGraph

FusionDoc-Next proporciona soporte completo para **JSXGraph**, permitiéndote incrustar gráficos matemáticos dinámicos y totalmente interactivos.

El componente se maneja a través de `<JSXGraphBoard />` o usando los atajos `JSXGraph` y `jsxgraph`.

---

## 📈 Parábolas y Puntos Interactivos

Crea funciones, puntos deslizables e intersecciones matemáticas fácilmente. Puedes inyectar el código que interactuará con el tablero a través de la propiedad `code`. Internamente, dispones de la variable `board` para dibujar.

<JSXGraphBoard 
  title="Mi primera gráfica JSXGraph" 
  code="var p1 = board.create('point', [-2, -2], {name: 'A', size: 4, face: 'o', color: '#10b981'}); var p2 = board.create('point', [0, 1], {name: 'B', size: 4, face: 'o', color: '#3b82f6'}); var p3 = board.create('point', [2, -2], {name: 'C', size: 4, face: 'o', color: '#f59e0b'}); board.create('conic', [p1, p2, p3, p1, p3], {strokeColor: '#ef4444', strokeWidth: 3});"
/>

```mdx
<JSXGraphBoard 
  title="Mi primera gráfica JSXGraph" 
  code="var p1 = board.create('point', [-2, -2], {name: 'A', size: 4, face: 'o', color: '#10b981'}); var p2 = board.create('point', [0, 1], {name: 'B', size: 4, face: 'o', color: '#3b82f6'}); var p3 = board.create('point', [2, -2], {name: 'C', size: 4, face: 'o', color: '#f59e0b'}); board.create('conic', [p1, p2, p3, p1, p3], {strokeColor: '#ef4444', strokeWidth: 3});"
/>
```

---

## 📏 Deslizadores y Funciones de Onda

También puedes crear ondas cuya frecuencia cambia en función del valor de deslizadores interactivos.

<JSXGraphBoard 
  title="Senoides Interactivas" 
  height={350}
  code="var s = board.create('slider', [[-4, -3], [3, -3], [1, 5, 10]], {name: 'frecuencia', snapWidth: 0.1}); board.create('functiongraph', [function(x) { return Math.sin(s.Value() * x); }], {strokeColor: '#8b5cf6', strokeWidth: 3, dash: 2});"
/>

```mdx
<JSXGraphBoard 
  title="Senoides Interactivas" 
  height={350}
  code="var s = board.create('slider', [[-4, -3], [3, -3], [1, 5, 10]], {name: 'frecuencia', snapWidth: 0.1}); board.create('functiongraph', [function(x) { return Math.sin(s.Value() * x); }], {strokeColor: '#8b5cf6', strokeWidth: 3, dash: 2});"
/>
```

---

## ⚙️ Propiedades

El componente `<JSXGraphBoard>` admite las siguientes opciones:

| Propiedad | Tipo | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `"JSXGraph Interactive Board"` | El título superior de la barra de la gráfica. |
| `code` | `string` | `""` | El código en JavaScript nativo usado para construir la geometría dentro del tablero. |
| `height` | `number \| string` | `400` | Altura del área del mapa/rejilla principal. |
| `width` | `number \| string` | `"100%"` | Anchura del área principal (`%` o `px`). |
| `boardId` | `string` | Aleatorio | Útil si deseas proporcionar manualmente un ID al contenedor del tablero. |
| `attributes` | `object` | `{ boundingbox: ... }` | Atributos subyacentes pasados a `JXG.JSXGraph.initBoard`. Interfiere directamente en la malla original. |

> [!TIP]
> **Acceso Interno:** Dentro de la propiedad `code` tienes inyectadas dos variables directamente desde la ejecución en tiempo real:
> `board` (tu tabla configurada) y `JXG` (para acceder a constructores de la librería nativa).

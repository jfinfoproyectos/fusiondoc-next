---
title: Visualizaciones Interactivas (p5.js)
description: Algoritmos animados paso a paso y sketches p5.js creativos directamente en tu documentación.
icon: 'lucide:cpu'
order: 20
---

# Visualizaciones Interactivas con p5.js

FusionDoc incluye dos componentes de visualización interactiva: **AlgoVisualizer** para algoritmos y **P5Sketch** para sketches p5.js libres.

---

## 🧮 AlgoVisualizer — Algoritmos Animados

<AlgoVisualizer algo="bubble-sort" data="[8, 3, 5, 1, 9, 2, 7, 4, 6]" speed={1.5} />

```mdx
<AlgoVisualizer algo="bubble-sort" data="[8, 3, 5, 1, 9, 2, 7, 4, 6]" speed={1.5} />
```

---

<AlgoVisualizer algo="quick-sort" data="[7, 2, 10, 4, 1, 8, 3, 6, 9, 5]" speed={1} />

<AlgoVisualizer algo="binary-search" data="[3, 7, 12, 18, 24, 31, 45, 52, 67, 80]" target={31} />

### ⚙️ Propiedades

| Propiedad | Tipo | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `algo` | `string` | `bubble-sort` | Algoritmo: `bubble-sort` · `insertion-sort` · `selection-sort` · `quick-sort` · `binary-search` |
| `data` | `string \| number[]` | `[8,3,5,…]` | Array de números. |
| `target` | `number` | — | Número a buscar (solo para `binary-search`). |
| `speed` | `number` | `1` | Multiplicador de velocidad (ej. `1.5`, `2`). |
| `height` | `number` | `300` | Altura en píxeles del área de barras. |

---

## 🎨 P5Sketch — Sketches Creativos

Usa un bloque de código con lenguaje **`p5`** para incrustar cualquier sketch de p5.js. El código se escribe en estilo global (`setup`, `draw`, `mouseX`...) sin prefijos.

```p5 Partículas interactivas
function setup() {
  createCanvas(600, 360);
  background(10, 10, 20);
}

function draw() {
  background(10, 10, 20, 25);
  let d = dist(mouseX, mouseY, width / 2, height / 2);
  let num = int(map(d, 0, 300, 1, 8));
  for (let i = 0; i < num; i++) {
    let angle = random(TWO_PI);
    let r = random(5, 30);
    let x = mouseX + cos(angle) * r;
    let y = mouseY + sin(angle) * r;
    fill(map(mouseX, 0, width, 80, 255), map(mouseY, 0, height, 80, 255), 200);
    noStroke();
    circle(x, y, random(2, 8));
  }
}
```

```p5 Onda de Lissajous
let t = 0;
function setup() {
  createCanvas(600, 320);
  background(10);
}
function draw() {
  background(10, 10, 18, 15);
  stroke(80, 180, 255, 200);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < 360; i++) {
    let a = radians(i);
    let x = width/2 + 220 * sin(3 * a + t);
    let y = height/2 + 140 * sin(2 * a);
    vertex(x, y);
  }
  endShape();
  t += 0.008;
}
```

### Cómo escribir un sketch

````mdx
```p5 Título del sketch
function setup() {
  createCanvas(600, 400);
}
function draw() {
  background(20);
  fill(100, 200, 255);
  circle(mouseX, mouseY, 50);
}
```
````

> [!TIP]
> El texto después de `p5` (en la misma línea) se convierte en el título del sketch.
> Haz clic en **"Ver código"** para consultar o copiar el código fuente.
>
> [!NOTE]
> Todos los eventos p5 están disponibles: `mousePressed`, `keyPressed`, `mouseMoved`, `touchStarted`, etc.

> [!WARNING]
> Al renderizar P5 en la estructura SSG/SSR de Next.js V16/React 19, `fusiondoc` fuerza al componente P5Sketch a ser del lado cliente (`"use client"`). Evita importar utilidades de P5 por fuera del Canvas o se dispararán errores de ventana asíncrona (`window is not defined`).

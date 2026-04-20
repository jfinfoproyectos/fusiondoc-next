# Arte Generativo y Simulaciones (p5.js)

El componente `<P5Sketch />` integra la librería **p5.js** para permitir la creación de sketches creativos, simulaciones físicas y arte generativo directamente en tu documentación. Proporciona un entorno de ejecución global donde puedes escribir código estilo Processing sin preocuparte por la configuración del DOM.

## Características
- **Sintaxis Global**: Usa funciones estándar como `setup()`, `draw()`, `mouseX`, `dist()`, etc.
- **Interactividad Nativa**: Soporta eventos de ratón, teclado y gestos táctiles out-of-the-box.
- **Modo Pantalla Completa**: Botón integrado para disfrutar de las visualizaciones en todo el viewport.
- **Aislamiento de Entorno**: Cada sketch se ejecuta en su propia instancia, evitando conflictos entre múltiples visualizaciones en la misma página.

---

## Diseños de Alto Nivel

### 1. Dinámica de Partículas
Interactúa con el lienzo para generar partículas que reaccionan a la posición del cursor.

<P5Sketch height={360} title="Efecto de Proximidad" code="
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
" />

### 2. Síntesis Geométrica (Lissajous)
Demostración de curvas armónicas generadas mediante funciones trigonométricas.

<P5Sketch height={320} title="Curvas de Lissajous" code="
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
" />

### 3. Sistemas Recursivos (Árbol Fractal)
Visualización de estructuras naturales mediante recursividad simple.

<P5Sketch height={350} title="Crecimiento Fractal" code="
function setup() {
  createCanvas(600, 350);
}

function draw() {
  background(15);
  stroke(222);
  translate(width/2, height);
  branch(80);
}

function branch(len) {
  line(0, 0, 0, -len);
  translate(0, -len);
  if (len > 4) {
    push();
    rotate(map(mouseX, 0, width, 0, PI/2));
    branch(len * 0.7);
    pop();
    push();
    rotate(-map(mouseX, 0, width, 0, PI/2));
    branch(len * 0.7);
    pop();
  }
}
" />

---

## Referencia de API

### `<P5Sketch />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `code` | `string` | **Sí** | El código JavaScript de p5.js. Se inyecta en un contexto global `with(p)`. |
| `height` | `number` | `400` | Altura del contenedor del canvas en píxeles. |
| `title` | `string` | `"p5.js Sketch"` | Texto que aparece en la barra superior del componente. |

---

## Cómo escribir un Sketch
A diferencia de p5.js estándar en HTML, aquí el código se define dentro de un bloque de Markdown o una prop de React. No necesitas llamar a `new p5()`.

````mdx
<P5Sketch title="Esfera" code={`
function setup() {
  createCanvas(600, 400, WEBGL);
}
function draw() {
  background(20);
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  normalMaterial();
  sphere(100);
}
`} />
````

---

## Mejores Prácticas
- **Limpieza**: El componente destruye automáticamente la instancia de p5 (`p.remove()`) al desmontarse, evitando fugas de memoria.
- **Responsividad**: Aunque `createCanvas` requiere medidas fijas, puedes usar `width: "100%"` en el contenedor y manejar el redimensionado dentro de `windowResized()`.
- **RSC Friendly**: Este componente está marcado como `"use client"`, por lo que es compatible con Next.js App Router sin configuraciones adicionales.

> [!WARNING]
> Evita usar variables globales que choquen con nombres reservados de p5.js (ej: no nombres una variable `width` fuera de las funciones de ciclo de vida).

# Geometría Dinámica (JSXGraph)

El componente `<JSXGraphBoard />` integra el motor **JSXGraph** para crear construcciones geométricas interactivas, visualizaciones de cálculo y simulaciones físicas de alta precisión. A diferencia de las gráficas estáticas, JSXGraph permite definir restricciones geométricas (ej: "este punto siempre debe estar sobre este círculo") que se mantienen durante la interacción del usuario.

## Características
- **Geometría de Restricciones**: Permite crear puntos, líneas y curvas que dependen unos de otros de forma dinámica.
- **Interactividad Precisa**: Los usuarios pueden arrastrar elementos, usar deslizadores y observar cómo el sistema de ecuaciones se resuelve en tiempo real.
- **Inyección de Código Directa**: El prop `code` permite escribir scripts imperativos en JavaScript con acceso total al motor `JXG` y al objeto `board`.
- **Diseño Integrado**: Barra de herramientas superior estilo "Workbench" y soporte para temas claro/oscuro integrados.

---

## Diseños de Alto Nivel

### 1. Geometría y Restricciones (Triángulo)
Demuestra cómo los puntos pueden estar vinculados para formar figuras geométricas persistentes.

<JSXGraphBoard 
  title="Laboratorio de Geometría" 
  code="var p1 = board.create('point', [-2, -2], {name: 'A', color: '#10b981'}); 
var p2 = board.create('point', [0, 2], {name: 'B', color: '#3b82f6'}); 
var p3 = board.create('point', [2, -2], {name: 'C', color: '#f59e0b'}); 
var poly = board.create('polygon', [p1, p2, p3], {fillColor: 'rgba(59, 130, 246, 0.1)', strokeColor: '#3b82f6'});"
/>

### 2. Cinemática con Deslizadores
Usa controles interactivos para modificar la frecuencia de una onda senoidal en tiempo real.

<JSXGraphBoard 
  title="Simulador de Ondas" 
  height={350}
  code="var s = board.create('slider', [[-4, -3.5], [2, -3.5], [1, 5, 10]], {name: 'frecuencia'}); 
board.create('functiongraph', [function(x) { return Math.sin(s.Value() * x); }], {strokeColor: '#8b5cf6', strokeWidth: 3});"
/>

### 3. Cálculo Diferencial (Tangentes)
Visualiza la derivada de una función mediante una línea tangente que sigue al cursor.

<JSXGraphBoard 
  title="Estudio de la Derivada" 
  code="var f = board.create('functiongraph', [function(x){ return 0.2*x*x*x - x; }], {strokeWidth:2});
var p = board.create('glider', [1, 1, f], {name: 'P', color: '#ef4444'});
var t = board.create('tangent', [p], {strokeColor: '#ef4444', dash: 2});"
/>

---

## Referencia de API

### `<JSXGraphBoard />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `code` | `string` | **Sí** | Script en JavaScript que construye la geometría. Tienes acceso a `board` y `JXG`. |
| `height` | `number \| string` | `400` | Altura del lienzo (soporta `px` o `vh`). |
| `title` | `string` | `"JSXGraph Board"` | Título descriptivo en la barra superior del componente. |
| `attributes` | `object` | - | Configuración base del tablero (boundingbox, axis, grid). |

---

## Mejores Prácticas
- **Limpieza de IDs**: Si usas múltiples tableros en una misma página, el sistema genera IDs únicos automáticamente, pero puedes usar `boardId` para control manual.
- **Variables Globales**: Evita declarar variables con `window.` dentro del prop `code`. Usa `var`, `let` o `const` normalmente; el script se ejecuta en un contexto aislado.
- **Legibilidad**: Para scripts largos, usa plantillas de string con backticks (`` ` ``) en tu archivo MDX para mantener los saltos de línea legibles.

> [!TIP]
> Puedes usar `board.on('move', function(){ ... })` dentro de tu código para disparar eventos personalizados de FusionDoc cuando el usuario interactúe con la geometría.

# Visualización Matemática (Mafs & KaTeX)

El componente `<MafsBoard />` integra el motor **Mafs** para crear visualizaciones matemáticas interactivas, declarativas y de alta fidelidad. Combinado con **KaTeX**, permite ilustrar conceptos complejos con la precisión de un libro de texto y la interactividad de un laboratorio digital.

## Características
- **Renderizado Nativo React**: A diferencia de otras librerías que usan iframes o canvas "de caja negra", Mafs utiliza SVGs reactivos que se integran perfectamente con el DOM y los estilos de FusionDoc.
- **Soporte KaTeX**: Propiedad `expression` integrada para mostrar la ecuación algebraica enriquecida sobre el gráfico.
- **Interacción Fluida**: Soporte nativo para zoom (rueda), desplazamiento (arrastrar) y controles de navegación manuales.
- **Sintaxis de Función MDX**: El componente `MafsPlot` permite pasar funciones matemáticas como strings (Ej: `"Math.sin(x)"`) facilitando la autoría en archivos Markdown.

---

## Diseños de Alto Nivel

### 1. Dinámica de Ondas (Trigonometría)
Visualización de una función senoidal con decaimiento, ideal para explicar fenómenos físicos.

<MafsBoard expression="f(x) = \sin(x) \cdot e^{-x/5}" height={350}>
  <MafsCoordinates subdivisions={4} />
  <MafsPlot y="Math.sin(x) * Math.exp(-x / 5)" color="var(--primary)" weight={3} />
</MafsBoard>

### 2. Análisis Analítico (Parábola)
Representación de una función cuadrática con resaltado de puntos críticos.

<MafsBoard expression="f(x) = x^2 - 4" initialViewBox={{ x: [-4, 4], y: [-5, 5] }}>
  <MafsCoordinates subdivisions={2} />
  <MafsPlot y="x * x - 4" color="#ec4899" weight={4} />
  <MafsPoint x={0} y={-4} color="#ef4444" />
  <MafsPoint x={2} y={0} color="#22c55e" />
  <MafsPoint x={-2} y={0} color="#22c55e" />
</MafsBoard>

### 3. Crecimiento Logarítmico
Perfecto para documentar algoritmos de complejidad $O(\log n)$ o escalas de intensidad.

<MafsBoard expression="f(x) = \ln(x)" initialViewBox={{ x: [-1, 10], y: [-2, 3] }}>
  <MafsCoordinates subdivisions={5} />
  <MafsPlot y="Math.log(x)" color="#3b82f6" weight={3} />
</MafsBoard>

---

## Referencia de API

### `<MafsBoard />`
Contenedor principal que inicializa el lienzo matemático.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `expression` | `string` | - | Ecuación KaTeX que se muestra centrada sobre el gráfico. |
| `height` | `number` | `400` | Altura del lienzo en píxeles. |
| `initialViewBox` | `object` | `x:[-5,5], y:[-5,5]` | Rango visible inicial del plano cartesiano. |

### `<MafsPlot />`
Dibuja una función continua.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `y` | `string \| function` | **Sí** | La función a graficar. Pasa un string JS como `"Math.cos(x)"`. |
| `color` | `string` | `var(--primary)` | Color de la línea de la función. |
| `weight` | `number` | `2` | Grosor del trazo. |

### `<MafsPoint />`
Dibuja un punto en coordenadas específicas.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `x`, `y` | `number` | **Sí** | Coordenadas del punto. |
| `color` | `string` | `#ef4444` | Color del punto. |

---

## Mejores Prácticas
- **Nombres de Funciones**: Al usar strings en `MafsPlot`, asegúrate de usar el prefijo `Math.` (ej: `Math.PI`, `Math.sqrt`).
- **Vista Inicial**: Configura `initialViewBox` de forma que los puntos críticos de tu función sean visibles inmediatamente sin que el usuario tenga que hacer zoom.
- **Rendimiento**: Mafs es extremadamente eficiente, pero evita renderizar cientos de puntos individuales; prefiere usar `MafsPlot` para series de datos continuas.

> [!IMPORTANT]
> El componente MafsBoard incluye controles de Zoom (+/-) en la esquina superior derecha para facilitar la exploración en dispositivos táctiles o laptops sin mouse de rueda.

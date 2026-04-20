# Visualizador de Algoritmos (AlgoVisualizer)

El componente `<AlgoVisualizer />` es una de las herramientas más potentes de FusionDoc para la enseñanza técnica y la documentación de lógica de datos. Permite ejecutar simulaciones interactivas de algoritmos clásicos, mostrando visualmente el estado de la memoria (array) y las métricas de rendimiento en cada paso.

## Características
- **Métricas en Tiempo Real**: Contador integrado de comparaciones (`🔍`) e intercambios (`🔄`).
- **Control de Reproducción**: Botones para iniciar, pausar, reiniciar y navegar paso a paso (adelante/atrás).
- **Leyenda Inteligente**: Identificación por colores de elementos en comparación, intercambio, pivotes y elementos ya ordenados.
- **Velocidad Ajustable**: Propiedad `speed` para controlar la fluidez de la animación según la complejidad del algoritmo.

---

## Diseños de Alto Nivel

### 1. Quick Sort: Dividir y Conquistar
Observa cómo el algoritmo utiliza pivotes para organizar grandes conjuntos de datos de forma eficiente.

<AlgoVisualizer 
  algo="quick-sort" 
  data="[12, 45, 7, 23, 56, 1, 90, 34, 15, 67, 4, 28]" 
  speed={2} 
/>

### 2. Binary Search: Búsqueda Logarítmica
Simulación de cómo reducir el espacio de búsqueda a la mitad en cada paso. Ideal para explicar algoritmos $O(\log n)$.
*Nota: Los datos se ordenan automáticamente antes de iniciar la búsqueda.*

<AlgoVisualizer 
  algo="binary-search" 
  target={70} 
  data="[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]" 
/>

### 3. Selection Sort: Estabilización de Mínimos
Muestra visualmente la búsqueda sucesiva del valor más pequeño para construir el array ordenado desde el inicio.

<AlgoVisualizer 
  algo="selection-sort" 
  data="[9, 1, 8, 2, 7, 3, 6, 4, 5]" 
  speed={1.5}
  height={250}
/>

---

## Referencia de API

### `<AlgoVisualizer />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `algo` | `string` | **Sí** | Uno de: `bubble-sort`, `quick-sort`, `insertion-sort`, `selection-sort`, `binary-search`. |
| `data` | `string \| number[]` | `[8,3,5,...]` | Array de números a procesar. |
| `target` | `number` | - | Solo para `binary-search`. El valor que se desea encontrar. |
| `speed` | `number` | `1` | Multiplicador de velocidad de la animación. |
| `height` | `number` | `300` | Altura del área de barras en píxeles. |

---

## Mejores Prácticas
- **Quick Sort vs Bubble Sort**: Usa Quick Sort para demostrar algoritmos modernos con muchos datos, y Bubble Sort para explicar conceptos básicos de intercambio.
- **Binary Search**: Asegúrate de que el array `data` proporcionado sea coherente con el `target` que buscas para una demostración exitosa.
- **Velocidad**: Para algoritmos con muchos pasos como Quick Sort, se recomienda un `speed={2}` o superior.

> [!TIP]
> Usa el botón de **Paso a Paso** (`<` y `>`) para explicar detalladamente un intercambio específico a tu audiencia durante una presentación o tutorial.

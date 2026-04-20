---
title: Mafs y KaTeX
description: Componentes interactivos basados en React para matemáticas y diagramas enriquecidos, con soporte para renderizado de ecuaciones KaTeX.
icon: 'lucide:sigma'
order: 14
---

# Matemáticas Interactiva con Mafs y KaTeX

**Mafs** es una librería moderna para crear visualizaciones matemáticas declarativas en React. Combinada con **KaTeX**, permite ilustrar conceptos matemáticos y renderizar expresiones algebraicas con alta fidelidad, de forma mucho más amigable con el ciclo de vida de React que alternativas antiguas.

Nuestra integración expone directamente los primitivos visuales a `MDX`, evitando la compilación compleja.

---

## 📈 Gráfica de Funciones y Fórmulas
Puedes utilizar `<MafsBoard>` juntamente con la propiedad `expression` para agregar un bloque KaTeX sobre tu visualización interactiva.

<MafsBoard expression="f(x) = \sin(x) \cdot e^{\frac{-x}{5}}">
  <MafsCoordinates />
  <MafsPlot y="Math.sin(x) * Math.exp(-x / 5)" color="var(--primary)" weight={3} opacity={0.8} />
</MafsBoard>

```mdx
<MafsBoard expression="f(x) = \sin(x) \cdot e^{\frac{-x}{5}}">
  <MafsCoordinates />
  <MafsPlot y="Math.sin(x) * Math.exp(-x / 5)" color="var(--primary)" weight={3} opacity={0.8} />
</MafsBoard>
```

---

## 📐 Ecuaciones Integradas en Texto

La integración con KaTeX también provee componentes para renderizar ecuaciones por separado, sin necesidad de un entorno interactivo completo. Usa `<Math>` para matemáticas en bloque y `<math>` para matemática en línea alineada con el texto.

Por ejemplo, aquí tenemos una ecuación de límite usando `<math math="\lim_{x \to \infty} \frac{1}{x} = 0" />` en medio del texto! 

Y para ecuaciones destacadas:

<Math math="E = mc^2" />

```mdx
La ecuación clave es <math math="E = mc^2" /> en texto en línea o:

<Math math="E = mc^2" />
```

---

## 🧮 Sistema de Coordenadas y Puntos

Puedes controlar múltiples figuras dentro del mismo canvas declarativo:

<MafsBoard expression="\text{Geometría Analítica Práctica}">
  <MafsCoordinates subdivisions={2} />
  <MafsPlot y="x * x - 2" color="#ec4899" />
  <MafsPoint x={0} y={-2} color="#10b981" />
  <MafsPoint x={1.414} y={0} color="#3b82f6" />
</MafsBoard>

```mdx
<MafsBoard expression="\text{Geometría Analítica Práctica}">
  <MafsCoordinates subdivisions={2} />
  <MafsPlot y="x * x - 2" color="#ec4899" />
  <MafsPoint x={0} y={-2} color="#10b981" />
  <MafsPoint x={1.414} y={0} color="#3b82f6" />
</MafsBoard>
```

> [!TIP]
> Mafs está creado explícitamente para integrarse con React, por lo que evita casi todos los problemas de _Strict Mode_ y fugas de memoria típicos de alternativas como JSXGraph. Si bien JSXGraph ofrece algunas primitivas imperativas únicas, para gráficas puramente declarativas, Mafs es superior.

> [!NOTE]
> Tanto el bloque Mafs como la estructura subyacente de `react-katex` requieren de renderización dinámica de cliente dentro de Next.js App Router (React 19). Su inclusión está completamente integrada a nuestro motor MDX, por lo que no deberás preocuparte por hidratar errores de server vs client.

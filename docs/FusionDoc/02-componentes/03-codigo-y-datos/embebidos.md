---
title: Embebidos de Código
description: Cómo integrar entornos de ejecución interactivos como CodePen, CodeSandbox y StackBlitz.
icon: 'lucide:code-2'
order: 7
---

# Embebidos de Código

El componente `<CodeEmbed />` permite integrar plataformas externas de ejecución de código directamente en tus documentos. Es ideal para mostrar ejemplos vivos que los usuarios pueden editar y probar en tiempo real.

## Plataformas Soportadas

Actualmente, el componente detecta automáticamente y optimiza los embeds para:
- **CodePen**
- **CodeSandbox**
- **StackBlitz**

## Características Premium

- **Click to Load:** Por defecto, los embebidos no se cargan hasta que el usuario hace clic. Esto mejora drásticamente el rendimiento de la página y evita el rastreo innecesario de terceros hasta que sea necesario.
- **Responsivo:** Se adapta automáticamente al ancho del contenedor.
- **Detección Automática:** Solo necesitas pegar la URL normal del navegador, el componente se encarga de transformarla en una URL de "embed" válida.

## Ejemplos

### CodePen

Ideal para demos rápidas de HTML/CSS/JS.

<CodeEmbed 
  url="https://codepen.io/challenges/pen/mdmByPe" 
  title="Ejemplo de Animación en CodePen"
  height={400}
/>

### CodeSandbox

Perfecto para proyectos de React, Vue o Node.js.

<CodeEmbed 
  url="https://codesandbox.io/s/react-new" 
  height={600}
/>

### StackBlitz

La mejor opción para entornos de desarrollo web completos.

<CodeEmbed 
  url="https://stackblitz.com/edit/react-ts-n8fzkr" 
  height={600}
/>

## Uso en MDX

Puedes usar el componente de cualquiera de las siguientes formas:

````mdx
{/* Forma estándar */}
<CodeEmbed url="https://codepen.io/..." />

{/* Usando alias específicos */}
<codepen url="https://codepen.io/..." />
<sandbox url="https://codesandbox.io/..." />
<stackblitz url="https://stackblitz.com/..." />
````

## Propiedades

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `url` | `string` | **Requerido**. La URL del proyecto o pen (URL normal de navegador). |
| `height` | `number | string` | La altura del embebido en píxeles. (Default: `500`). |
| `title` | `string` | Título descriptivo para accesibilidad y para la carátula de carga. |

> [!IMPORTANT]
> El componente utiliza un sistema de "fachada" para no cargar el iframe hasta que el usuario interactúe con él. Esto asegura que tus páginas se mantengan rápidas incluso con múltiples ejemplos complejos.

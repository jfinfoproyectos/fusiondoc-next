---
title: Embebidos de Código
description: Integra entornos de ejecución interactivos como CodePen, CodeSandbox y StackBlitz con control total sobre altura y margen interno.
icon: 'lucide:code-2'
order: 7
---

# Embebidos de Código

El componente `<CodeEmbed />` permite integrar plataformas externas de ejecución de código directamente en tus documentos. Es ideal para mostrar ejemplos vivos que los usuarios pueden editar y probar en tiempo real.

## Plataformas Soportadas

El componente detecta automáticamente la plataforma y transforma la URL en un embed optimizado:

- **CodePen** — demos de HTML, CSS y JavaScript
- **CodeSandbox** — proyectos de React, Vue, Node.js
- **StackBlitz** — entornos de desarrollo web completos

## Características

- **Click to Load** — por defecto, el iframe no se carga hasta que el usuario hace clic, mejorando el rendimiento.
- **Carga Automática** — usa `autoload` para mostrar la demo directamente sin esperar interacción.
- **Altura adaptable** — usa `autoHeight` para una relación de aspecto 16:9, o `height="N"` para una altura fija en píxeles.
- **Margen Interno** — usa `inset="N"` para añadir espacio entre el borde del componente y el contenido embebido.
- **Detección Automática** — solo pega la URL normal del navegador.

## Ejemplos

### Carga Manual (Por Defecto)

El usuario hace clic para activar el entorno interactivo.

<CodeEmbed
  url="https://codepen.io/challenges/pen/mdmByPe"
  title="Ejemplo de Animación en CodePen"
  height="400"
/>

### Carga Automática

Activa `autoload` para mostrar la demo sin interacción.

<CodeEmbed
  url="https://codepen.io/challenges/pen/mdmByPe"
  title="Demo con Carga Automática"
  autoHeight
  autoload
/>

### Con Margen Interno

Usa `inset="20"` para añadir un marco de aire alrededor de la demo.

<CodeEmbed
  url="https://codepen.io/challenges/pen/mdmByPe"
  title="Demo con margen interno"
  autoHeight
  inset="20"
  autoload
/>

### Altura Fija

Especifica la altura exacta en píxeles con `height="N"`.

<CodeEmbed
  url="https://codesandbox.io/s/react-new"
  height="600"
/>

## Uso en MDX

````mdx
{/* Altura automática (16:9) con carga inmediata y margen interno */}
<CodeEmbed
  url="https://stackblitz.com/edit/react-ts"
  autoHeight
  autoload
  inset="20"
/>

{/* Altura fija */}
<CodeEmbed url="https://codepen.io/..." height="500" />

{/* Usando alias específicos */}
<codepen url="https://codepen.io/..." />
<sandbox url="https://codesandbox.io/..." />
<stackblitz url="https://stackblitz.com/..." />
````

> [!IMPORTANT]
> Los valores de `height` e `inset` deben escribirse **como strings** (con comillas), no como expresiones JSX numéricas.
> ✅ `height="600"` `inset="20"`
> ❌ `height={600}` `inset={20}`

## Propiedades

| Prop | Tipo | Default | Descripción |
| :--- | :--- | :--- | :--- |
| `url` | `string` | — | **Requerido.** URL del proyecto (URL normal del navegador). |
| `height` | `string` | `"500"` | Altura del componente en píxeles. Solo aplica cuando `autoHeight` está desactivado. |
| `autoHeight` | `boolean` | `false` | Adapta la altura automáticamente en relación 16:9. Ignora `height`. |
| `inset` | `string` | `"0"` | Margen interno en píxeles entre el borde del componente y el contenido embebido. |
| `autoload` | `boolean` | `false` | Si se activa, carga la demo inmediatamente sin esperar clic del usuario. |
| `title` | `string` | — | Texto descriptivo para accesibilidad y para la carátula de carga. |

> [!TIP]
> El componente utiliza un sistema de **"fachada"** (click-to-load) por defecto. Esto mantiene las páginas rápidas incluso con múltiples demos, ya que los iframes no se inicializan hasta que el usuario interactúa. Usa `autoload` solo cuando la demo sea el contenido principal de la sección.

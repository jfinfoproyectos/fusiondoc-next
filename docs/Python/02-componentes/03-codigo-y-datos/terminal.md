---
title: Terminal
description: Simula una terminal interactiva con animaciones de escritura paso a paso.
order: 5
icon: 'lucide:terminal'
---

# Terminal

El componente `<Terminal />` es ideal para mostrar comandos, procesos de instalación o demostraciones de CLI con una estética realista y animada.

## Uso Básico

Puedes usarlo para mostrar un comando simple. El componente simula la ejecución y puede mostrar una salida estática.

<Terminal 
  title="Instalación"
  shell="bash"
  commands="npm install @fusiondoc/core"
  staticText="Instalando dependencias..."
/>

```mdx
<Terminal 
  title="Instalación"
  shell="bash"
  commands="npm install @fusiondoc/core"
  staticText="Instalando dependencias..."
/>
```

## Múltiples Comandos

Puedes encadenar múltiples comandos separándolos por saltos de línea (`\n`).

<Terminal 
  title="Crear Proyecto"
  shell="zsh"
  commands="mkdir mi-doc\ncd mi-doc\nnpm init -y"
/>

```mdx
<Terminal 
  title="Crear Proyecto"
  shell="zsh"
  commands="mkdir mi-doc\ncd mi-doc\nnpm init -y"
/>
```

## Propiedades

| Propiedad | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | `"Terminal"` | El título que aparece en la barra superior de la terminal. |
| `shell` | `string` | `"bash"` | El indicador de shell que se muestra (bash, zsh, powershell, etc.). |
| `commands` | `string` | - | Los comandos a ejecutar, separados por `\n`. |
| `staticText` | `string` | - | Texto de salida que aparece después de "ejecutar" los comandos. |
| `isReadOnly` | `boolean` | `true` | Si se debe mostrar como una terminal interactiva o solo visual. |

> [!TIP]
> Usa el componente Terminal para tus guías de "Primeros Pasos" para darles un toque extra de interactividad.

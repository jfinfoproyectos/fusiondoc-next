---
title: Bloques de Código y Tabs
description: Muestra fragmentos de código de manera organizada y funcional.
order: 3
icon: 'lucide:code'
---

# Código Orientado a Desarrolladores

FusionDoc ofrece componentes potentes para gestionar fragmentos de código, incluyendo pestañas intercambiables para múltiples lenguajes y botones de copiado rápido.

## Pestañas de Código (CodeTabs)

Ideal para cuando necesitas mostrar el mismo fragmento de código pero en diferentes lenguajes o herramientas.

<CodeTabs>
  <CodeTab title="JavaScript">
    ```js
    console.log("Hola desde JavaScript");
    ```
  </CodeTab>
  <CodeTab title="TypeScript">
    ```ts
    console.log("Hola desde TypeScript");
    ```
  </CodeTab>
  <CodeTab title="Python">
    ```python
    print("Hola desde Python")
    ```
  </CodeTab>
</CodeTabs>

````mdx
<CodeTabs>
  <CodeTab title="JavaScript">
    ```js
    console.log("Hola desde JavaScript");
    ```
  </CodeTab>
  <CodeTab title="TypeScript">
    ```ts
    console.log("Hola desde TypeScript");
    ```
  </CodeTab>
</CodeTabs>
````

## Bloque de Código con Copiado (CodeBlockWrapper)

Cualquier bloque de código estándar en MDX se envuelve automáticamente en nuestro componente `<CodeBlockWrapper />` para ofrecer mayor control sobre la visualización y un botón de copiado rápido.

```mdx
// Ejemplo de un bloque de código estándar que se envolverá en CodeBlockWrapper
console.log("Copiar contenido disponible");
```

> [!NOTE]
> Gracias a Rehype-Syntax-Highlighting, todo el código tendrá colores vibrantes y legibles de acuerdo al lenguaje detectado.

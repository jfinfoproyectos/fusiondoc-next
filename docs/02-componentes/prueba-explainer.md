---
title: Code Explainer (Interactivo)
description: Cómo usar el nuevo componente CodeExplainer para walkthroughs de código.
icon: 'lucide:sparkles'
order: 12
---

# Code Explainer

El componente `explainer` permite crear recorridos interactivos por bloques de código, resaltando líneas específicas mientras se muestra una explicación dinámica.

## Ejemplo Básico (TypeScript)

A continuación, vemos cómo funciona la desestructuración y el tipado en TypeScript.

<explainer 
  steps={[
    {
      title: "Definición de Interfaz",
      lines: [1, 2, 3, 4, 5],
      explanation: "Comenzamos definiendo una interfaz robusta para nuestros datos de usuario, incluyendo un 'literal type' para el rol."
    },
    {
      title: "Desestructuración",
      lines: [8],
      explanation: "Extraemos las propiedades 'id' y 'name' directamente del objeto user para facilitar su uso."
    },
    {
      title: "Lógica Condicional",
      lines: [11, 12, 13, 14, 15],
      explanation: "Verificamos el rol del usuario. Gracias al tipado de TypeScript, el autocompletado nos ayudará con los valores posibles ('admin' o 'user')."
    }
  ]}
>

```typescript
interface User {
  id: number;
  name: string;
  role: 'admin' | 'user';
}

const processUser = (user: User) => {
  const { id, name } = user;
  console.log(`Procesando ${name} (${id})`);
  
  if (user.role === 'admin') {
    // Lógica especial
    return true;
  }
  return false;
};
```

</CodeExplainer>

## Uso en MDX

Para utilizar este componente, se debe envolver un bloque de código estándar y pasar la lista de pasos (`steps`).

```mdx
<CodeExplainer steps={[
    { title: "Paso 1", lines: [1], explanation: "Definición" },
    { title: "Paso 2", lines: [2], explanation: "Log" }
]}>

\```javascript
const x = 10;
console.log(x);
\```

</CodeExplainer>
```

> [!NOTE]
> El componente utiliza el motor de resaltado global del proyecto (**Shiki**), lo que garantiza consistencia visual y soporte para todos los lenguajes configurados.

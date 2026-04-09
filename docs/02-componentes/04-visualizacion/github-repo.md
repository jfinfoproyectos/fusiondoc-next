---
title: GitHub Repo
description: Tarjeta interactiva para mostrar repositorios de GitHub con estadísticas dinámicas y enlaces directos.
icon: 'lucide:github'
order: 2
---

# GitHub Repo

El componente `<GithubRepo />` permite destacar proyectos de GitHub de una forma visualmente premium. Incluye iconos automáticos, visualización de estrellas, forks y el lenguaje principal del repositorio.

## Uso Básico

Solo necesitas proporcionar la `url` del repositorio.

```jsx
<GithubRepo 
  url="https://github.com/lucide-react/lucide"
  description="Librería de iconos community-run para React."
  stars="54.2k"
  forks="1.2k"
/>
```

<GithubRepo 
  url="https://github.com/lucide-react/lucide"
  description="Librería de iconos community-run para React."
  stars="54.2k"
  forks="1.2k"
/>

---

## Personalización

Puedes personalizar el lenguaje y el color del indicador si no deseas usar los valores por defecto.

```jsx
<GithubRepo 
  url="https://github.com/facebook/react"
  title="React Engine"
  language="JavaScript"
  languageColor="#f7df1e"
  stars="210k"
/>
```

<GithubRepo 
  url="https://github.com/facebook/react"
  title="React Engine"
  language="JavaScript"
  languageColor="#f7df1e"
  stars="210k"
/>

---

## Propiedades

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `url` | `string` | **Requerido** | Enlace completo al repositorio de GitHub. |
| `title` | `string` | - | Nombre a mostrar (si no se define, se extrae de la URL). |
| `description` | `string` | - | Breve descripción del proyecto. |
| `stars` | `string \| number` | - | Número de estrellas (manual). |
| `forks` | `string \| number` | - | Número de forks (manual). |
| `language` | `string` | `"TypeScript"` | Lenguaje principal reportado. |
| `languageColor` | `string` | `"#3178c6"` | Color hexadecimal para el círculo del lenguaje. |

> [!NOTE]
> Este componente es estático por defecto. Para obtener datos en tiempo real, se recomienda conectar las props a una API de servidor o un fetch de cliente.

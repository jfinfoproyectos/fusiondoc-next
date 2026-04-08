---
title: Repositorio GitHub
description: Cómo publicar y mostrar repositorios de GitHub con tarjetas visuales premium.
icon: 'lucide:github'
order: 7
---

# Repositorio GitHub

El componente `GithubRepo` (o su alias `github`) permite integrar tarjetas interactivas que enlazan a tus repositorios, proporcionando información clave de un vistazo.

## Ejemplo de Tarjeta

Puedes configurar el título, la descripción y estadísticas como estrellas o forks.

<GithubRepo 
  url="https://github.com/jfinfotest/fusiondoc-next"
  title="jfinfotest / fusiondoc-next"
  description="Generador de documentación premium construido con Next.js 16 y MDX."
  stars="128"
  forks="45"
  language="TypeScript"
  languageColor="#3178c6"
/>

## Uso en MDX

### Básico
Usando el nombre completo del componente:
```mdx
<GithubRepo 
  url="https://github.com/owner/repo" 
  description="Descripción corta del repositorio."
/>
```

### Usando Alias
Puedes usar `<github />` o `<repo />` para mayor brevedad:
```mdx
<github 
  url="https://github.com/facebook/react" 
  title="React"
  stars="215k"
  language="JavaScript"
  languageColor="#f7df1e"
/>
```

### Propiedades

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `url` | `string` | **Requerido**. Enlace al repositorio de GitHub. |
| `title` | `string` | Título de la tarjeta (si se omite, se extrae de la URL). |
| `description` | `string` | Breve descripción del proyecto. |
| `stars` | `string|number` | Número de estrellas mostradas. |
| `forks` | `string|number` | Número de forks mostrados. |
| `language` | `string` | Lenguaje de programación principal. |
| `languageColor` | `string` | Color hexadecimal para el indicador de lenguaje. |

> [!TIP]
> Puedes encontrar los colores de lenguajes de GitHub en [este repositorio](https://github.com/ozh/github-colors/blob/master/colors.json).

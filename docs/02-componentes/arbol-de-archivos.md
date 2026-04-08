---
title: Árbol de Archivos
description: Cómo mostrar la estructura de carpetas y archivos de un proyecto de forma interactiva.
icon: 'lucide:folder-tree'
order: 8
---

# Árbol de Archivos

El componente `FileTree` (o su alias `filetree`) permite visualizar la jerarquía de directorios de un proyecto con iconos automáticos basados en la extensión de los archivos.

## Ejemplo de Estructura

<FileTree>
  <Folder name="src" defaultOpen={true}>
    <Folder name="components">
      <File name="Header.tsx" label="Componente Principal" />
      <File name="Sidebar.tsx" />
    </Folder>
    <File name="App.tsx" />
    <File name="globals.css" />
  </Folder>
  <File name="package.json" label="Dependencias" />
</FileTree>

## Uso en MDX

```mdx
<FileTree>
  <Folder name="nombre-carpeta" defaultOpen={true}>
    <File name="archivo.js" label="opcional" />
  </Folder>
</FileTree>
```

### Propiedades de Folder
| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `name` | `string` | **Requerido**. Nombre de la carpeta. |
| `defaultOpen` | `boolean` | Determina si la carpeta inicia expandida. |

### Propiedades de File
| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `name` | `string` | **Requerido**. Nombre completo del archivo (incluyendo extensión). |
| `label` | `string` | Texto descriptivo opcional que aparece a la derecha. |

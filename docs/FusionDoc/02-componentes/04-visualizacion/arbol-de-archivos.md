---
title: Árbol de Archivos
description: Visualiza estructuras de directorios y archivos con iconos descriptivos y estados desplegables.
icon: 'lucide:folder-tree'
order: 1
---

# Árbol de Archivos

El componente `<FileTree />` permite representar la estructura de un proyecto o carpetas de forma visual. Incluye iconos automáticos basados en la extensión del archivo y animaciones de apertura/cierre.

## Uso Básico

Usa `<FileTree />` como contenedor y anida componentes `<Folder />` y `<File />`.

```jsx
<FileTree>
  <Folder name="src" defaultOpen={true}>
    <Folder name="components">
      <File name="Button.tsx" label="Componente base" />
      <File name="Card.tsx" />
    </Folder>
    <File name="App.tsx" />
    <File name="index.css" />
  </Folder>
  <File name="package.json" />
  <File name="README.md" />
</FileTree>
```

<FileTree>
  <Folder name="src" defaultOpen={true}>
    <Folder name="components">
      <File name="Button.tsx" label="Componente base" />
      <File name="Card.tsx" />
    </Folder>
    <File name="App.tsx" />
    <File name="index.css" />
  </Folder>
  <File name="package.json" />
  <File name="README.md" />
</FileTree>

---

## Iconos Automáticos

El componente detecta automáticamente el icono adecuado según el nombre o extensión del archivo:
- **Código**: `.js`, `.jsx`, `.ts`, `.tsx`
- **Imágenes**: `.png`, `.jpg`, `.svg`
- **Estilos**: `.css`, `.scss`
- **Configuración**: `config`, `.json`, `.yaml`

---

## Propiedades

### Folder
| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Requerido** | Nombre de la carpeta. |
| `defaultOpen` | `boolean` | `true` | Si la carpeta debe aparecer abierta inicialmente. |

### File
| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Requerido** | Nombre del archivo (incluyendo extensión). |
| `label` | `string` | - | Texto adicional pequeño al lado del nombre. |

> [!TIP]
> Mantén el `defaultOpen={true}` en las carpetas raíz para que el usuario entienda la estructura de un vistazo rápido.

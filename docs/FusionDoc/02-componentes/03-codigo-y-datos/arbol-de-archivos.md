# Árbol de Archivos (FileTree)

El componente `<FileTree />` es esencial para documentar la arquitectura de un proyecto, la estructura de carpetas de un boilerplate o la ubicación de archivos de configuración críticos. Proporciona una visualización jerárquica interactiva con iconos automáticos según la extensión del archivo.

## Características
- **Detección Automática de Iconos**: Asigna iconos visualmente distintos para archivos `.js`, `.ts`, `.json`, `.css`, imágenes y más.
- **Carpetas Colapsables**: Las carpetas se pueden abrir y cerrar interactivamente, ahorrando espacio en estructuras profundas.
- **Etiquetas de Contexto**: Permite añadir pequeñas notas aclaratorias a la derecha de cada archivo mediante la propiedad `label`.
- **Efecto Glassmorphism**: Diseño moderno con desenfoque de fondo que se integra perfectamente en cualquier tema.

---

## Diseños de Alto Nivel

### 1. Estructura Next.js (App Router)
Muestra la organización estándar de un proyecto moderno de Next.js.

<FileTree>
  <Folder name="src">
    <Folder name="app">
      <File name="layout.tsx" label="Root Layout" />
      <File name="page.tsx" label="Home Page" />
      <Folder name="api">
        <File name="route.ts" label="Endpoint Base" />
      </Folder>
    </Folder>
    <Folder name="components">
      <File name="Button.tsx" />
      <File name="Navbar.tsx" />
    </Folder>
  </Folder>
  <File name="next.config.js" />
  <File name="package.json" />
</FileTree>

### 2. Boilerplate de Backend (Node.js)
Ideal para documentar la separación de responsabilidades en una API.

<FileTree>
  <Folder name="src">
    <Folder name="controllers" />
    <Folder name="models">
      <File name="User.ts" />
      <File name="Product.ts" />
    </Folder>
    <Folder name="services" />
    <File name="index.ts" label="Entry Point" />
  </Folder>
  <File name=".env.example" label="Config" />
  <File name="docker-compose.yml" />
</FileTree>

### 3. Gestión de Activos y Estilos
Enfoque en la organización de recursos estáticos.

<FileTree>
  <Folder name="public">
    <Folder name="images">
      <File name="logo.svg" />
      <File name="hero-bg.jpg" />
    </Folder>
  </Folder>
  <Folder name="styles">
    <File name="globals.css" />
    <File name="variables.scss" />
  </Folder>
</FileTree>

---

## Referencia de API

### `<FileTree />`
Contenedor principal para la estructura.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | **Sí** | Lista de componentes `<Folder />` y `<File />`. |

### `<Folder />`
Representa un directorio colapsable.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Sí** | El nombre de la carpeta. |
| `defaultOpen` | `boolean` | `true` | Define si la carpeta inicia expandida. |
| `children` | `ReactNode` | - | Contenido interno de la carpeta. |

### `<File />`
Representa un archivo individual.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `name` | `string` | **Sí** | El nombre del archivo (incluyendo extensión para el icono). |
| `label` | `string` | - | Nota aclaratoria que aparece a la derecha. |

> [!TIP]
> Usa las etiquetas `label` para indicar qué archivos deben ser modificados por el usuario, por ejemplo: `<File name="config.json" label="EDITAR AQUÍ" />`.

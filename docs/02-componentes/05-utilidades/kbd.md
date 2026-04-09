---
title: Keyboard Shortcuts (Kbd)
description: Representación visual elegante de teclas del teclado para atajos y comandos.
icon: 'lucide:keyboard'
---

# Keyboard Shortcuts (Kbd)

El componente `<Kbd />` se utiliza para indicar teclas del teclado en tu documentación. Tiene un diseño 3D sutil para que parezcan teclas reales.

## Uso Básico

```jsx
<p>
  Para buscar, presiona <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> en Windows 
  o <Kbd>⌘</Kbd> + <Kbd>K</Kbd> en macOS.
</p>
```

## Propiedades

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `children` | `React.ReactNode` | **Requerido** | El texto o símbolo que representa la tecla. |
| `className` | `string` | - | Clases CSS adicionales. |

## Ejemplo Dinámico

*   Guardar cambios: <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>
*   Nuevo archivo: <Kbd>Alt</Kbd> + <Kbd>N</Kbd>
*   Cerrar ventana: <Kbd>Esc</Kbd>
*   Buscar en proyecto: <Kbd>Ctrl</Kbd> + <Kbd>Shift</Kbd> + <Kbd>F</Kbd>

## Combinaciones Especiales

Formatear código: <Kbd>Shift</Kbd> + <Kbd>Alt</Kbd> + <Kbd>F</Kbd>

Paleta de comandos: <Kbd>Ctrl</Kbd> + <Kbd>P</Kbd>

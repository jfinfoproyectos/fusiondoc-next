---
title: Imagen con Zoom
description: Imágenes que se expanden a pantalla completa al hacer clic, con soporte para pies de foto y desenfoque de fondo.
icon: 'lucide:zoom-in'
order: 4
---

# Imagen con Zoom

El componente `<ZoomImage />` mejora la experiencia de visualización de capturas de pantalla, diagramas o fotos detalladas, permitiendo que el usuario las expanda sin salir del contexto de la página.

## Uso Básico

Solo proporciona la ruta de la imagen en `src`.

```jsx
<ZoomImage 
  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2070" 
  caption="Entorno de desarrollo moderno con VS Code."
/>
```

<ZoomImage 
  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=2070" 
  caption="Entorno de desarrollo moderno con VS Code."
/>

---

## Características Premium

- **Efecto Hover**: La imagen tiene una ligera escala y un overlay con icono al pasar el mouse.
- **Lightbox**: Al hacer clic, se abre un modal con fondo desenfocado (backdrop-blur).
- **Control**: Se puede cerrar haciendo clic fuera de la imagen o usando el botón de cierre integrado.
- **Cierres**: Soporta cierre por teclado al presionar `ESC` (comportamiento estándar de modal).

---

## Propiedades

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `src` | `string` | **Requerido** | URL o ruta local de la imagen. |
| `alt` | `string` | - | Texto alternativo para accesibilidad (si no se define, usa el caption). |
| `caption` | `string` | - | Texto descriptivo que aparece debajo de la imagen y en el modal. |

> [!TIP]
> Usa `ZoomImage` para todas las capturas de pantalla técnicas donde los detalles (como el texto en un editor) sean importantes para el lector.

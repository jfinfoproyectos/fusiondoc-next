---
title: Imagen con Zoom
description: Cómo permitir a los usuarios ampliar imágenes de alta resolución.
icon: 'lucide:zoom-in'
order: 5
---

# Imagen con Zoom

El componente `ZoomImage` es ideal para mostrar capturas de pantalla, diagramas complejos o fotografías donde los detalles son importantes. Al hacer clic, la imagen se expande en un modal a pantalla completa con un fondo desenfocado.

## Ejemplo de ZoomImage

Haz clic en la imagen para ver el efecto de zoom:

<ZoomImage 
  src="https://images.unsplash.com/photo-1550439062-609e1531270e" 
  alt="Tecnología" 
  caption="Captura de un código fuente complejo con resaltado de sintaxis."
/>

## Uso en MDX

````mdx
<ZoomImage 
  src="/mi-imagen.jpg" 
  alt="Descripción de la imagen" 
  caption="Pie de foto opcional"
/>
````

> [!TIP]
> Puedes usar imágenes locales guardándolas en la carpeta `public/` y referenciándolas como `/mi-imagen.jpg`.

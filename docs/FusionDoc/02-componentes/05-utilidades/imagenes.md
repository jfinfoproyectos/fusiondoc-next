# Imágenes y Zoom

En FusionDoc, las imágenes no son solo archivos estáticos. El componente `<ZoomImage />` (utilizado internamente por el alias `Image`) permite que los lectores examinen detalles minuciosos mediante un lightbox interactivo y efectos visuales premium.

## Características
- **Zoom Lightbox**: Al hacer clic, la imagen se expande ocupando toda la pantalla con un fondo desenfocado (glassmorphism).
- **Caption Integrado**: Soporte para pies de foto estilizados.
- **Efecto Hover**: Micro-zoom al pasar el cursor para invitar a la interacción.
- **Responsive**: Se adapta automáticamente al ancho del contenedor.

## Ejemplo Básico

<ZoomImage 
  src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" 
  alt="Arquitectura de Sistemas" 
  caption="Visualización de flujo de datos en un entorno de microservicios."
/>

## Uso en MDX

Puedes usar la etiqueta tradicional de Markdown `![]()` o el componente avanzado para mayor control:

```mdx
<ZoomImage 
  src="/path/to/image.png" 
  alt="Dashboard Pro" 
  caption="Captura de pantalla de la interfaz administrativa."
/>
```

## Referencia de Props

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `src` | `string` | **Requerido**. Ruta local o URL externa de la imagen. |
| `alt` | `string` | Texto alternativo para accesibilidad y SEO. |
| `caption` | `string` | Texto descriptivo que aparecerá debajo de la imagen. |

---

<Alert variant="success">
  **Tip de Diseño:** Recomendamos usar imágenes con una relación de aspecto de **16:9** o **4:3** para que el componente `ZoomImage` se visualice de forma óptima en el flujo de lectura.
</Alert>

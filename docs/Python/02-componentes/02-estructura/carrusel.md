---
title: Carrusel
description: Slider interactivo para mostrar imágenes, testimonios o cualquier contenido en una secuencia deslizable.
icon: 'lucide:images'
order: 6
---

# Carrusel

El componente `<Carousel />` permite presentar múltiples elementos en un espacio reducido mediante una navegación horizontal suave. Soporta reproducción automática (autoplay) y controles manuales.

## Uso Básico

Simplemente envuelve tus elementos (preferiblemente imágenes) dentro del componente.

```jsx
<Carousel>
  <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072" alt="Web Dev" />
  <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=2069" alt="Coding" />
  <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070" alt="Terminal" />
</Carousel>
```

<Carousel>
  <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072" alt="Web Dev" />
  <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80&w=2069" alt="Coding" />
  <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070" alt="Terminal" />
</Carousel>

---

## Reproducción Automática

Puedes habilitar la transición automática con la propiedad `autoPlay`.

```jsx
<Carousel autoPlay={true} interval={3000}>
  <img src="..." />
  <img src="..." />
</Carousel>
```

---

## Propiedades

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | **Requerido** | Elementos a mostrar en el carrusel. |
| `autoPlay` | `boolean` | `false` | Activa la transición automática entre elementos. |
| `interval` | `number` | `5000` | Tiempo en milisegundos entre cada cambio automático. |

> [!NOTE]
> El carrusel pausa la reproducción automática cuando el usuario pasa el ratón sobre el componente, permitiendo una visualización cómoda.

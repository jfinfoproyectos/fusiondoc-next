---
title: Carrusel
description: Cómo crear galerías interactivas avanzadas con el componente Carousel.
icon: 'lucide:images'
order: 4
---

# Carrusel

El componente `Carousel` ha sido mejorado para ofrecer una experiencia más profesional, incluyendo indicadores de progreso, un contador de diapositivas y soporte para reproducción automática.

## Ejemplo con Auto-Play

Puedes configurar el carrusel para que se mueva solo usando la prop `autoPlay`. Por defecto cambia cada 5 segundos.

<Carousel autoPlay>
  <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" alt="Código" />
  <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6" alt="Programación" />
  <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c" alt="Terminal" />
</Carousel>

## Características Principales

- **Indicador de Posición**: En la esquina superior derecha se muestra el índice actual (ej: "1 / 3").
- **Puntos Interactivos**: En la parte inferior, puedes hacer clic en los puntos para saltar a una diapositiva específica.
- **Auto-Play**: Reproducción automática cíclica.
- **Responsivo**: Adaptado para gestos táctiles en móviles.

## Uso en MDX

### Básico
```mdx
<Carousel>
  <img src="/img1.jpg" alt="1" />
  <img src="/img2.jpg" alt="2" />
</Carousel>
```

### Con Auto-Play Personalizado
```mdx
<Carousel autoPlay interval={3000}>
  <img src="/img1.jpg" alt="1" />
  <img src="/img2.jpg" alt="2" />
</Carousel>
```

> [!TIP]
> El carrusel pausará la reproducción automática si el usuario interactúa manualmente con él o si llega al final (volverá al principio en el siguiente ciclo).

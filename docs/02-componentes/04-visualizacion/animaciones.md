---
title: Animaciones Premium (AnimeJS)
description: Potentes componentes de visualización animados mediante el motor matemático de AnimeJS.
icon: 'lucide:sparkles'
order: 10
---

# Animaciones con AnimeJS

FusionDoc integra **AnimeJS**, una biblioteca ligera pero extremadamente potente para manipulaciones complejas de DOM y SVG. Estos componentes detectan automáticamente el scroll del usuario para activarse justo en el momento preciso.

---

## 🚀 Text Reveal
Ideal para títulos de impacto o frases destacadas. Las letras se revelan con un efecto elástico y escalonado.

<TextReveal 
  text="Experiencias visuales que cautivan" 
  className="text-4xl md:text-6xl font-black text-primary tracking-tighter my-8" 
/>

```mdx
<TextReveal 
  text="Tu Título Aquí" 
  className="text-4xl font-black text-primary" 
/>
```

---

## 🎨 Animated SVG (Drafting)
Este componente toma cualquier SVG y aplica un efecto de "dibujado" automático a todos sus trazados.

<AnimatedSVG duration={3000}>
  <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" stroke="#3b82f6" strokeWidth="4" />
    <path d="M60 100 L90 130 L140 70" stroke="#3b82f6" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
</AnimatedSVG>

```mdx
<AnimatedSVG duration={3000}>
  <svg> ... tus path aquí ... </svg>
</AnimatedSVG>
```

---

## 🌊 Timeline Flow
Un componente dinámico para ilustrar procesos secuenciales con una línea de tiempo conectada.

<TimelineFlow steps="[
  { title: 'Instalación', description: 'Descarga las dependencias iniciales del proyecto.' },
  { title: 'Configuración', description: 'Ajusta tus variables de entorno en el archivo .env' },
  { title: 'Despliegue', description: 'Publica tu documentación en Vercel o Netlify.' },
  { title: '¡Listo!', description: 'Comparte el enlace con tu equipo.' }
]" />

```mdx
<TimelineFlow steps="[
  { title: 'Paso 1', description: 'Descripción...' },
  { title: 'Paso 2', description: 'Descripción...' }
]" />
```

---

> [!TIP]
> Estos componentes utilizan `framer-motion` internamente para la detección de scroll y `animejs` para la ejecución de la animación a 60fps, garantizando un rendimiento óptimo.

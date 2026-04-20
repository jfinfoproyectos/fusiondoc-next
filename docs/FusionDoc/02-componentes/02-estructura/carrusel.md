# Carrusel Interactivo (Carousel)

El componente `<Carousel />` es la solución ideal para presentar colecciones de contenido en un espacio optimizado. Diseñado con transiciones hardware-accelerated y un sistema de control intuitivo, permite navegar a través de imágenes, testimonios o tarjetas de características de manera fluida y elegante.

## Características
- **Transiciones Suaves**: Animaciones de deslizamiento optimizadas para una experiencia premium.
- **Micro-Controles Inteligentes**: Indicadores de posición ("dots") y un contador numérico dinámico para contextualizar al usuario.
- **Reproducción Inteligente**: El `autoPlay` se pausa automáticamente al interactuar, evitando interrupciones molestas.
- **Contenido Agnóstico**: Aunque brilla con imágenes, puede encapsular cualquier componente MDX complejo.

---

## Diseños de Alto Nivel

### 1. Galería de Marca (Cinemático)
Utiliza la reproducción automática para crear una vitrina visual de alto impacto.

<Carousel autoPlay={true} interval={4000}>
  <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Espacio profundo" />
  <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=2069&auto=format&fit=crop" alt="Código neon" />
  <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop" alt="Setup desarrollador" />
</Carousel>

### 2. Tour de Funcionalidades (Nesting)
Demuestra la potencia de FusionDoc anidando otros componentes dentro del carrusel.

<Carousel>
  <div className="p-12 text-center flex flex-col items-center">
    <Alert variant="success" title="Motor de MDX 16" className="max-w-md">
      Renderizado ultra rápido compatible con las últimas APIs de React Server Components.
    </Alert>
  </div>
  <div className="p-12 text-center flex flex-col items-center">
    <Alert variant="info" title="Diseño Glassmorphism" className="max-w-md">
      Efectos de transparencia de última generación integrados nativamente.
    </Alert>
  </div>
</Carousel>

### 3. Sistema de Testimonios
Crea una sección de "Social Proof" elegante y dinámica.

<Carousel autoPlay={true} interval={6000}>
  <div className="p-10 text-center">
    <p className="text-2xl font-serif italic mb-6">"FusionDoc ha transformado por completo cómo nuestro equipo de ingeniería comparte conocimientos. La estética es imbatible."</p>
    <div className="font-bold uppercase tracking-widest text-primary">Elena Rodriguez — CTO en TechFlow</div>
  </div>
  <div className="p-10 text-center">
    <p className="text-2xl font-serif italic mb-6">"Los componentes interactivos como X6 y Mafs nos permiten documentar lógica compleja con una claridad nunca vista."</p>
    <div className="font-bold uppercase tracking-widest text-primary">Marco Antonio — Senior Architect</div>
  </div>
</Carousel>

---

## Referencia de API

### `<Carousel />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | **Sí** | Conjunto de elementos a deslizar. |
| `autoPlay` | `boolean` | `false` | Activa la reproducción automática. |
| `interval` | `number` | `5000` | Milisegundos entre cada slide en modo automático. |

> [!TIP]
> Asegúrate de que las imágenes tengan proporciones similares para mantener la consistencia visual del carrusel. Todas las imágenes dentro del componente se ajustan automáticamente al 100% del ancho disponible.

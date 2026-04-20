# Sección Principal (Hero)

El componente `Hero` es la puerta de entrada a tu documentación o landing page. Diseñado para ofrecer un impacto visual inmediato, combina tipografía audaz, micro-animaciones de Framer Motion y efectos de profundidad para establecer el tono de toda la experiencia del usuario.

## Características
- **Variantes Estéticas**: Elige entre `gradient` (vibrante), `glass` (glassmorphism premium) o `minimal` (sobrio).
- **Control de Alineación**: Soporta layouts centrados para introducciones y alineados a la izquierda para guías técnicas.
- **Fondo Inmersivo**: Capacidad para integrar imágenes de fondo con velos inteligentes de degradado automático para asegurar legibilidad.
- **Lanzadores de Acción**: Soporta múltiples botones con diferentes variantes (`primary`, `outline`, `ghost`) e iconos integrados.

---

## Diseños de Alto Nivel

### 1. The Visionary (Estilo Lanzamiento)
Ideal para la página de inicio o el comienzo de secciones maestras. Utiliza la variante `gradient` y alineación `center`.

<Hero 
  title="Documentación que Inspira"
  description="Lleva la presentación de tus proyectos al siguiente nivel con una suite de componentes MDX diseñada para la era moderna del desarrollo web."
  icon="Rocket"
  variant="gradient"
  actions={[
    { label: "Comenzar Ahora", href: "/docs/inicio", variant: "primary", icon: "ArrowRight" },
    { label: "Documentación", href: "/docs/componentes", variant: "outline" }
  ]}
/>

### 2. The Technical Lead (Alineación Izquierda)
Un enfoque más enfocado en la información, ideal para guías técnicas y referencia de API. Utiliza la variante `glass` y alineación `left`.

<Hero 
  align="left"
  variant="glass"
  title="Referencia de API Core"
  description="Explora los endpoints, hooks y utilidades internas que dan vida al motor de FusionDoc. Todo lo que necesitas saber para extender el sistema."
  icon="Code2"
  actions={[
    { label: "Ver Endpoints", href: "/docs/api", variant: "primary" },
    { label: "Ejemplos", href: "/docs/ejemplos", variant: "ghost", icon: "ExternalLink" }
  ]}
/>

### 3. The Immersive (Fondo Cinematográfico)
Uso de imágenes de alta resolución con overlays inteligentes para portadas de alto impacto visual.

<Hero 
  title="Experiencias Inmersivas"
  description="Sincroniza tus imágenes de marca con nuestra tipografía optimizada. El texto siempre será legible gracias a nuestro sistema de capas dinámicas."
  backgroundImage="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
  align="center"
  actions={[
    { label: "Explorar Diseños", href: "#", variant: "primary", icon: "Sparkles" }
  ]}
/>

---

## Referencia de API

### `<Hero />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Sí** | El encabezado principal (soporta degradados automáticos). |
| `description` | `string` | - | Texto de apoyo en tamaño grande. |
| `icon` | `string` | - | Nombre de icono Lucide (ej: `Zap`, `Rocket`). |
| `variant` | `gradient` \| `glass` \| `minimal` | `gradient` | Define el estilo de fondo y sombras. |
| `align` | `left` \| `center` | `center` | Alineación horizontal de todo el contenido. |
| `backgroundImage` | `string` | - | URL para el fondo. Aplica degradado de legibilidad automáticamente. |
| `actions` | `HeroAction[]` | `[]` | Array de botones: `{ label, href, variant, icon }`. |

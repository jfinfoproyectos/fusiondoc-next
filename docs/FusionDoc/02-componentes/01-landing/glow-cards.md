# Tarjetas con Resplandor (Glow)

El componente `<FeatureGlow />` representa el estado del arte en diseño de interfaces interactivas. Utiliza un efecto de "foco dinámico" (spotlight) que rastrea la posición del cursor para iluminar sutilmente la tarjeta, creando una sensación de profundidad y respuesta táctil virtual.

## Características
- **Spotlight Dinámico**: El resplandor sigue el movimiento del mouse en tiempo real mediante `framer-motion`.
- **Personalización Cromática**: Control total sobre el color y la intensidad del resplandor mediante la prop `glowColor`.
- **Efecto Glassmorphism**: Fondo con desenfoque (`backdrop-blur`) que se adapta al contenido subyacente.
- **Micro-animaciones**: Escalado de iconos y transiciones de flechas de navegación automáticas.

---

## Diseños de Alto Nivel

### 1. Núcleo Tecnológico Neon
Utiliza el color primario de tu marca con mayor intensidad para destacar las capacidades técnicas centrales.

<FeatureGlowGrid columns={3}>
  <FeatureGlowCard 
    title="Renderizado Edge" 
    description="Despliegue global en milisegundos con latencia cero."
    icon="Cpu"
    glowColor="rgba(var(--primary-rgb), 0.3)"
  />
  <FeatureGlowCard 
    title="Autenticación v2" 
    description="Seguridad biométrica y MFA integrada por defecto."
    icon="Fingerprint"
    glowColor="rgba(var(--primary-rgb), 0.3)"
  />
  <FeatureGlowCard 
    title="Análisis Real-time" 
    description="Métricas en vivo sin necesidad de recargar la página."
    icon="Activity"
    glowColor="rgba(var(--primary-rgb), 0.3)"
  />
</FeatureGlowGrid>

### 2. Paleta Creativa Multicolor
Diferencia áreas de servicio o categorías mediante el uso de sprays de luz de distintos colores.

<FeatureGlowGrid columns={2}>
  <FeatureGlowCard 
    title="Diseño UX/UI" 
    description="Interfaces centradas en el usuario con estética de vanguardia."
    icon="Figma"
    glowColor="rgba(168, 85, 247, 0.2)"
  />
  <FeatureGlowCard 
    title="Desarrollo Cloud" 
    description="Infraestructura escalable en AWS y Google Cloud."
    icon="Cloud"
    glowColor="rgba(14, 165, 233, 0.2)"
  />
</FeatureGlowGrid>

### 3. Navegador de Secciones Elegante
Ideal para guiar al usuario a través de diferentes módulos de la documentación con una estética limpia.

<FeatureGlowGrid columns={3}>
  <FeatureGlowCard 
    title="Guía de Inicio" 
    description="Todo lo que necesitas para comenzar en 5 minutos."
    icon="Rocket"
    href="/docs/inicio"
  />
  <FeatureGlowCard 
    title="Componentes" 
    description="Explora la librería completa de bloques MDX."
    icon="Library"
    href="/docs/componentes"
  />
  <FeatureGlowCard 
    title="Comunidad" 
    description="Únete a nuestro Discord y comparte tus dudas."
    icon="MessagesSquare"
    href="/community"
  />
</FeatureGlowGrid>

---

## Referencia de API

### `<FeatureGlowGrid />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `columns` | `1 \| 2 \| 3 \| 4` | `3` | Número de columnas en pantallas grandes. |
| `children` | `ReactNode` | - | Lista de componentes `<FeatureGlowCard />`. |
| `className` | `string` | - | Clases adicionales para el contenedor. |

### `<FeatureGlowCard />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Sí** | Título principal de la tarjeta. |
| `description` | `string` | - | Texto de apoyo descriptivo. |
| `icon` | `string` | - | Nombre del icono Lucide (ej: `Zap`, `Cloud`). |
| `glowColor` | `string` | `rgba(...primary, 0.15)` | Color en formato CSS (rgba, hex) para el efecto spotlight. |
| `href` | `string` | - | Convierte la tarjeta en un enlace clicleable. |

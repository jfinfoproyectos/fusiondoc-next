# Cuadrícula Bento

La `<BentoGrid />` es uno de los componentes más versátiles de FusionDoc. Inspirado en el diseño editorial moderno de Apple, permite organizar contenido de forma no lineal, creando una jerarquía visual inmediata. Es ideal para secciones de características en landing pages, glosarios visuales o dashboards interactivos.

## Características
- **Jerarquía Visual**: Utiliza `colSpan` y `rowSpan` para destacar el contenido más importante.
- **Micro-interacciones**: Animaciones de hover suaves y efectos de iluminación dinámica integrados.
- **Responsividad Nativa**: Se adapta automáticamente de una columna en móvil a múltiples columnas en escritorio.
- **Premium Design**: Bordes redondeados extremos (`rounded-[2rem]`), desenfoque de fondo y sombras sutiles.

---

## Diseños de Alto Nivel

### 1. Showcase de Características (3 Columnas)
El layout clásico para presentar las bondades de tu producto con balance y claridad.

<BentoGrid columns={3}>
  <BentoCard 
    title="Velocidad Extrema" 
    description="Renderizado en milisegundos gracias a la arquitectura de componentes de caché de Next.js 16."
    icon="Zap"
    colSpan={2}
  />
  <BentoCard 
    title="Seguridad E2E" 
    description="Tus documentos están protegidos con cifrado de grado militar."
    icon="ShieldCheck"
  />
  <BentoCard 
    title="Personalización v4" 
    description="Estilo total con Tailwind CSS v4."
    icon="Palette"
  />
  <BentoGrid columns={2} className="md:col-span-2 gap-4 my-0">
    <BentoCard 
      title="Open Source" 
      description="Código transparente y comunitario."
      icon="Github"
    />
    <BentoCard 
      title="SEO Ready" 
      description="Optimizado para buscadores."
      icon="Search"
    />
  </BentoGrid>
</BentoGrid>

### 2. Dashboard Interactivo (Asimétrico)
Perfecto para mostrar flujos de trabajo complejos o datos densos que requieren mayor espacio vertical.

<BentoGrid columns={3}>
  <BentoCard 
    title="Análisis Predictivo" 
    description="Visualiza tendencias futuras basadas en tus logs históricos."
    icon="BarChart3"
    colSpan={2}
    rowSpan={2}
  >
    <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/10 font-mono text-[10px] opacity-70">
      PREDICT: SUCCESS_RATE > 98%
    </div>
  </BentoCard>
  <BentoCard 
    title="Notificaciones" 
    description="Alertas en tiempo real."
    icon="Bell"
  />
  <BentoCard 
    title="Cloud Sync" 
    description="Sincronización instantánea."
    icon="Cloud"
  />
</BentoGrid>

### 3. Directorio de Servicios (Navegación)
Convierte tu bento en una herramienta de navegación interactiva usando la propiedad `href`.

<BentoGrid columns={4}>
  <BentoCard 
    title="Documentación"
    icon="Book"
    href="/docs/FusionDoc"
    className="bg-blue-500/10 border-blue-500/20"
  />
  <BentoCard 
    title="Tutoriales"
    icon="Play"
    href="/docs/tutoriales"
    className="bg-emerald-500/10 border-emerald-500/20"
  />
  <BentoCard 
    title="API Reference"
    icon="Code"
    href="/docs/api"
    className="bg-purple-500/10 border-purple-500/20"
  />
  <BentoCard 
    title="Soporte"
    icon="LifeBuoy"
    href="/support"
    className="bg-rose-500/10 border-rose-500/20"
  />
</BentoGrid>

---

## Referencia de API

### `<BentoGrid />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `columns` | `1 \| 2 \| 3 \| 4` | `3` | Número máximo de columnas en escritorio. |
| `children` | `ReactNode` | - | Lista de componentes `<BentoCard />`. |
| `className` | `string` | - | Personalización adicional de la rejilla. |

### `<BentoCard />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Sí** | Título principal de la tarjeta. |
| `description` | `string` | - | Texto de apoyo descriptivo. |
| `icon` | `string` | - | Nombre de icono de Lucide (ej: `Zap`, `Lock`). |
| `colSpan` | `1 \| 2 \| 3` | `1` | Columnas que ocupa (grid-column). |
| `rowSpan` | `1 \| 2` | `1` | Filas que ocupa (grid-row). |
| `href` | `string` | - | URL para convertir la tarjeta en un enlace. |
| `children` | `ReactNode` | - | Contenido extra (ej: minicards, gráficos). |

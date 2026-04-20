# Mapa de Ruta (Roadmap)

El componente `<Roadmap />` es la herramienta definitiva para gestionar las expectativas de los usuarios y stakeholders. Permite visualizar la evolución cronológica y el estado de desarrollo de un proyecto a través de una línea de tiempo elegante, animada e interactiva.

## Características
- **Estados Semánticos**: Identificación inmediata mediante colores y iconos específicos para estados `released`, `beta`, `in-progress` y `planned`.
- **Línea de Vida Infinita**: Los conectores se generan automáticamente entre hitos, creando un flujo visual continuo.
- **Micro-interacciones**: Animaciones de entrada suave (`whileInView`) y efectos de hover que iluminan la tarjeta y escalan los iconos.
- **Información Temporal**: Espacios optimizados para fechas o períodos, facilitando la planificación a largo plazo.

---

## Diseños de Alto Nivel

### 1. Visión Estratégica de Producto
Divide tu proyecto en grandes fases de desarrollo para comunicar el futuro del ecosistema.

<Roadmap>
  <RoadmapItem 
    title="Fase 1: Motor del Núcleo" 
    status="released" 
    date="Finalizado - Q4 2023" 
    description="Implementación de Next.js 16, MDX Engine y sistema de temas dinámico. Estabilización de la arquitectura base."
  />
  <RoadmapItem 
    title="Fase 2: IA Colaborativa" 
    status="in-progress" 
    date="En curso - Enero 2024" 
    description="Integración de LLMs para autocompletado en el editor administrativo y asistente de búsqueda inteligente para usuarios finales."
  />
  <RoadmapItem 
    title="Fase 3: Ecosistema de Plugins" 
    status="beta" 
    date="Beta Cerrada - Marzo 2024" 
    description="Portal para desarrolladores, Marketplace de componentes y soporte para extensiones de terceros."
  />
  <RoadmapItem 
    title="Fase 4: Despliegue Multi-Cloud" 
    status="planned" 
    date="Estimado - Q3 2024" 
    description="Sincronización automática con AWS, GCP y Azure mediante webhooks nativos."
    isLast={true}
  />
</Roadmap>

### 2. Historial de Lanzamientos (Changelog)
Utiliza el roadmap para documentar versiones específicas y sus cambios más importantes.

<Roadmap>
  <RoadmapItem 
    title="Versión 2.1.0" 
    status="released" 
    date="15 de Abril, 2024" 
    description="Mejora crítica en el rendimiento del sidebar y nuevo componente de visualización de algoritmos."
  />
  <RoadmapItem 
    title="Versión 2.0.5" 
    status="released" 
    date="2 de Abril, 2024" 
    description="Corrección de errores en el editor Monaco y soporte mejorado para Safari móvil."
    isLast={true}
  />
</Roadmap>

### 3. Ruta de Aprendizaje para Desarrolladores
Guía a tus colaboradores a través de los pasos necesarios para dominar FusionDoc.

<Roadmap>
  <RoadmapItem 
    title="1. Fundamentos de MDX" 
    status="released" 
    description="Aprende a combinar Markdown con componentes React. Etiquetas, props y componentes personalizados."
  />
  <RoadmapItem 
    title="2. Arquitectura de FusionDoc" 
    status="in-progress" 
    description="Entiende cómo se gestionan los archivos físicos y cómo funciona el sistema de caché dinámico."
  />
  <RoadmapItem 
    title="3. Creación de Componentes Propios" 
    status="planned" 
    description="Taller avanzado sobre cómo registrar tus propios componentes en el registro MDX."
    isLast={true}
  />
</Roadmap>

---

## Referencia de API

### `<Roadmap />`
El contenedor principal que agrupa los hitos.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | - | Lista de componentes `<RoadmapItem />`. |

### `<RoadmapItem />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Sí** | Título descriptivo del hito. |
| `status` | `released` \| `beta` \| `in-progress` \| `planned` | **Sí** | El estado de desarrollo que define el color e icono. |
| `description` | `string` | - | Detalles adicionales sobre el hito. |
| `date` | `string` | - | Fecha, versión o período estimado. |
| `isLast` | `boolean` | `false` | Si es `true`, no dibuja la línea hacia abajo. |

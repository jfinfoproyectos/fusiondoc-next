# Línea de Tiempo (Timeline)

El componente `<Timeline />` es una herramienta esencial para narrar la evolución de un proyecto, documentar cambios técnicos o planificar hitos futuros. Con un diseño minimalista de "línea lateral", permite una lectura vertical fluida que prioriza la jerarquía visual y la claridad temporal.

## Características
- **Variantes Semánticas**: Usa colores predefinidos (`success`, `info`, `warning`, `active`) para comunicar estados sin palabras adicionales.
- **Micro-interacciones**: Efectos de entrada suaves y animaciones de "pulso" para los hitos activos.
- **Flexibilidad de Contenido**: Cada hito puede contener texto simple, código, imágenes o alertas.
- **Diseño Responsivo**: La línea lateral se ajusta automáticamente, manteniendo la legibilidad en dispositivos móviles.

---

## Diseños de Alto Nivel

### 1. Changelog de Producto (Técnico)
Documenta las versiones de tu software resaltando nuevas características, mejoras y correcciones críticas.

<Timeline>
  <TimelineItem 
    title="Versión 2.5.0 - Estabilidad Total" 
    date="15 Abr 2024" 
    variant="success"
  >
    Implementación del nuevo motor de búsqueda semántica y optimización del tiempo de build en un 40%.
    <Alert variant="info">Se recomienda actualizar para obtener las últimas parches de seguridad.</Alert>
  </TimelineItem>
  
  <TimelineItem 
    title="Mejora en el Editor Administrativo" 
    date="2 Abr 2024" 
    variant="info"
  >
    Añadidos nuevos atajos de teclado para inserción rápida de componentes MDX.
  </TimelineItem>
  
  <TimelineItem 
    title="Corrección: Fuga de Memoria" 
    date="28 Mar 2024" 
    variant="warning"
  >
    Solucionado un problema en el componente `X6Diagram` que causaba lentitud al renderizar más de 50 nodos.
  </TimelineItem>
</Timeline>

### 2. Roadmap Estratégico (Hitos Vivos)
Muestra a tu comunidad en qué estás trabajando ahora mismo utilizando la variante `active`.

<Timeline>
  <TimelineItem 
    title="Motor de IA Integrado" 
    date="En Desarrollo" 
    variant="active"
  >
    Estamos entrenando un modelo específico para que FusionDoc pueda autogenerar documentación desde comentarios de código.
  </TimelineItem>
  
  <TimelineItem 
    title="Colaboración en Tiempo Real" 
    date="Q3 2024" 
    variant="default"
  >
    Edición simultánea para equipos grandes, similar a Google Docs pero para ingeniería de software.
  </TimelineItem>
</Timeline>

### 3. Carrera de Aprendizaje (Educativo)
Guía a tus colaboradores a través de un camino predefinido de conocimientos.

<Timeline>
  <TimelineItem title="Fundamentos de MDX" date="Semana 1" variant="success">
    Aprende la sintaxis básica y cómo FusionDoc extiende Markdown.
  </TimelineItem>
  <TimelineItem title="Arquitectura de Componentes" date="Semana 2" variant="active">
    Cómo crear, registrar y utilizar componentes personalizados en el sistema.
  </TimelineItem>
</Timeline>

---

## Referencia de API

### `<Timeline />`
El contenedor que dibuja la línea vertical.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | - | Lista de componentes `<TimelineItem />`. |

### `<TimelineItem />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Sí** | Título principal del hito. |
| `date` | `string` | - | Texto temporal (aparece como un badge elegante). |
| `variant` | `default` \| `success` \| `warning` \| `info` \| `active` | `default` | Define el color del indicador. `active` incluye animación de pulso. |
| `children` | `ReactNode` | - | Contenido detallado del hito. |

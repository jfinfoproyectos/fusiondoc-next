# Acordeón

El componente `Accordion` es una herramienta esencial para organizar grandes volúmenes de información en bloques colapsables. Es perfecto para secciones de Preguntas Frecuentes (FAQ), detalles técnicos secundarios o guías paso a paso donde se desea evitar la sobrecarga visual.

## Características
- **Control de Apertura**: Soporta apertura única (acordeón clásico) o múltiple mediante la prop `allowMultiple`.
- **Contenido Rico**: Puedes inyectar cualquier componente MDX dentro de un `AccordionItem` (Código, Alertas, Imágenes, etc.).
- **Interacción Fluida**: Animaciones suaves de apertura y cierre con estados visuales claros.

---

## Ejemplos Completos

### 1. Centro de Ayuda (FAQ)
Un uso clásico para resolver dudas comunes de forma compacta y organizada.

<Accordion>
  <AccordionItem title="¿Cómo puedo desplegar FusionDoc?">
    FusionDoc está optimizado para **Vercel** y **Netlify**. Simplemente conecta tu repositorio de GitHub y el sistema detectará automáticamente la configuración de Next.js.
  </AccordionItem>
  <AccordionItem title="¿Es compatible con Tailwind CSS?">
    Sí, de hecho utiliza **Tailwind CSS v4** por defecto, lo que permite una personalización extrema mediante variables CSS sin archivos de configuración pesados.
  </AccordionItem>
  <AccordionItem title="¿Puedo usar mis propios componentes React?">
    Absolutamente. Solo necesitas registrarlos en el archivo `MarkdownRenderer.tsx` para que el motor MDX los reconozca en tus archivos `.md`.
  </AccordionItem>
</Accordion>

### 2. Configuración Técnica Avanzada
Ideal para ocultar detalles que solo los usuarios avanzados necesitan ver, integrando otros componentes como pestañas de código.

<Accordion allowMultiple>
  <AccordionItem title="Configuración de Variables de Entorno">
    Asegúrate de tener estas variables en tu archivo `.env.local` antes de iniciar el servidor.
    
    <Terminal title=".env.local">
    GITHUB_TOKEN=your_token_here
    NEXT_PUBLIC_SITE_URL=http://localhost:3000
    </Terminal>
  </AccordionItem>
  <AccordionItem title="Estructura de Seguridad (RBAC)">
    <Alert variant="info" title="Nota de Seguridad">
      El acceso se gestiona mediante grupos definidos en el frontmatter de cada carpeta.
    </Alert>
  </AccordionItem>
</Accordion>

### 3. Listado de Versiones (Changelog)
Muestra el historial de cambios de forma jerárquica y legible.

<Accordion>
  <AccordionItem title="Versión 2.0.0 (Actual)">
    <div className="flex gap-2 mb-2">
      <Badge variant="success">Nueva</Badge>
      <Badge variant="purple">Breaking Change</Badge>
    </div>
    - Migración completa a **React 19**.
    - Soporte nativo para **Next.js 16** con componentes de caché.
    - Nuevo editor administrativo integrado.
  </AccordionItem>
  <AccordionItem title="Versión 1.5.0">
    <Badge variant="info">Mejora</Badge>
    - Optimización de carga de imágenes.
    - Soporte inicial para diagramas X6.
  </AccordionItem>
</Accordion>

---

## Referencia de API

### `<Accordion />`
El contenedor principal que gestiona el estado de sus hijos.

| Prop | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `allowMultiple` | `boolean` | `false` | Si es `true`, permite expandir varios items a la vez. |
| `children` | `ReactNode` | - | Lista de componentes `<AccordionItem />`. |

### `<AccordionItem />`
Representa cada bloque individual comprimible.

| Prop | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Sí** | El texto que se muestra en la cabecera del item. |
| `children` | `ReactNode` | **Sí** | El contenido que se revela al expandir. |
| `isOpen` | `boolean` | No | Controlado automáticamente por el padre. |

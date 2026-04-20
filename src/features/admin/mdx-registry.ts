import { 
  AlertCircle, 
  BadgeCheck, 
  Layout, 
  Terminal as TerminalIcon, 
  FileJson, 
  ChevronRight, 
  Info,
  Type,
  MousePointer2,
  Table as TableIcon,
  GitBranch,
  Image as ImageIcon,
  Columns,
  LayoutList
} from "lucide-react";

export type PropType = "text" | "number" | "boolean" | "select" | "icon" | "content" | "json";

export interface MdxComponentProp {
  name: string;
  label: string;
  type: PropType;
  default?: any;
  options?: { label: string; value: any }[];
  placeholder?: string;
  description?: string;
}

export interface MdxComponentConfig {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: "Base" | "Layout" | "Interactivos" | "Multimedia" | "Científico" | "Utilidades";
  props: MdxComponentProp[];
  template: (props: Record<string, any>) => string;
  helpMarkdown?: string;
}

export const MDX_REGISTRY: MdxComponentConfig[] = [
  // --- BASE ---
  {
    id: "Alert",
    title: "Alerta",
    category: "Base",
    description: "Muestra un mensaje destacado con diferentes niveles de severidad.",
    iconName: "AlertCircle",
    props: [
      { name: "variant", label: "Variante", type: "select", default: "info", options: [
        { label: "Información", value: "info" },
        { label: "Éxito", value: "success" },
        { label: "Advertencia", value: "warning" },
        { label: "Error", value: "error" },
      ], description: "Define el color y el icono del mensaje." },
      { name: "title", label: "Título", type: "text", placeholder: "Ej: ¡Importante!", description: "Título opcional en negrita." },
      { name: "children", label: "Contenido", type: "content", default: "Este es un mensaje de alerta informativo.", description: "El mensaje principal de la alerta." },
    ],
    template: (p) => `<Alert variant="${p.variant}"${p.title ? ` title="${p.title}"` : ""}>\n  ${p.children}\n</Alert>`,
    helpMarkdown: `### Componente Alert
Ideal para resaltar consejos, advertencias o errores.

**Ejemplos Reales:**
- **info**: "Nota: El sistema se reinicia automáticamente a las 3 AM."
- **warning**: "Cuidado: Esta acción es irreversible."
- **error**: "Crítico: Fallo en la conexión de base de datos."`
  },
  {
    id: "Badge",
    title: "Etiqueta (Badge)",
    category: "Base",
    description: "Pequeño indicador visual para estados o categorías.",
    iconName: "BadgeCheck",
    props: [
      { name: "variant", label: "Variante", type: "select", default: "default", options: [
        { label: "Default", value: "default" },
        { label: "Info", value: "info" },
        { label: "Success", value: "success" },
        { label: "Warning", value: "warning" },
        { label: "Error", value: "error" },
        { label: "Purple", value: "purple" },
        { label: "Outline", value: "outline" },
      ]},
      { name: "children", label: "Texto", type: "text", default: "Status", description: "El texto a mostrar dentro de la etiqueta." },
    ],
    template: (p) => `<Badge variant="${p.variant}">${p.children}</Badge>`,
    helpMarkdown: "Muestra etiquetas pequeñas. Útil para versiones, tags de API o estados de procesos."
  },
  {
    id: "Tooltip",
    title: "Información Extra (Tooltip)",
    category: "Base",
    description: "Muestra un mensaje al pasar el cursor sobre un texto.",
    iconName: "MousePointer2",
    props: [
      { name: "content", label: "Mensaje", type: "text", default: "Este es el mensaje del tooltip", description: "Lo que se verá al pasar el cursor." },
      { name: "children", label: "Texto Base", type: "text", default: "Pasa el mouse aquí", description: "El texto que el usuario ve inicialmente." },
    ],
    template: (p) => `<Tooltip content="${p.content}">${p.children}</Tooltip>`,
    helpMarkdown: "Encapsula un texto para mostrar información contextual sin ocupar espacio permanentemente."
  },

  // --- LAYOUT ---
  {
    id: "BentoGrid",
    title: "Cuadrícula Bento",
    category: "Layout",
    description: "Crea un layout moderno estilo Bento para mostrar características.",
    iconName: "Layout",
    props: [
      { name: "columns", label: "Columnas", type: "number", default: 3, description: "Número de columnas en escritorio (1-4)." },
    ],
    template: (p) => `<BentoGrid columns={${p.columns}}>
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
    title="Seguridad" 
    description="Protección total integrada."
    icon="Shield"
  />
  <BentoCard 
    title="Cloud" 
    description="Sincronización instantánea."
    icon="Cloud"
  />
</BentoGrid>`,
    helpMarkdown: `### Cuadrícula Bento (Premium)
Diseño asimétrico estilo Apple.

**Propiedades de BentoCard:**
- \`colSpan\`: Ancho (1-3).
- \`rowSpan\`: Alto (1-2).
- \`href\`: Enlace opcional.`
  },
  {
    id: "Hero",
    title: "Sección Hero",
    category: "Layout",
    description: "Banner principal impactante para inicios de sección.",
    iconName: "ImageIcon",
    props: [
      { name: "title", label: "Título", type: "text", default: "Título Impactante" },
      { name: "description", label: "Descripción", type: "text", default: "Descripción detallada del propósito de esta sección." },
      { name: "icon", label: "Icono", type: "icon", default: "Rocket" },
      { name: "align", label: "Alineación", type: "select", default: "center", options: [{label: "Centro", value:"center"}, {label:"Izquierda", value:"left"}]},
      { name: "variant", label: "Estilo", type: "select", default: "gradient", options: [{label:"Gradiente", value:"gradient"}, {label:"Cristal", value:"glass"}, {label:"Básico", value:"minimal"}]},
      { name: "backgroundImage", label: "Imagen Fondo", type: "text", placeholder: "URL de la imagen" },
      { name: "actions", label: "Acciones (JSON)", type: "json", default: [
        { label: "Comenzar", href: "#", variant: "primary", icon: "ArrowRight" },
        { label: "GitHub", href: "#", variant: "outline", icon: "Github" }
      ]},
    ],
    template: (p) => `<Hero 
  title="${p.title}" 
  description="${p.description}" 
  icon="${p.icon}" 
  align="${p.align}" 
  variant="${p.variant}" 
  ${p.backgroundImage ? `backgroundImage="${p.backgroundImage}"` : ""}
  actions={${JSON.stringify(p.actions)}}
/>`,
    helpMarkdown: `### Componente Hero
Sección de impacto para inicios de página.

**Consejos de Diseño:**
- **Alineación Centro**: Ideal para páginas principales (Landing).
- **Alineación Izquierda**: Mejor para guías técnicas internas.
- **Glass variant**: Úsala sobre fondos oscuros o con imágenes para un efecto premium.`
  },
  {
    id: "Roadmap",
    title: "Mapa de Ruta",
    category: "Layout",
    description: "Línea de tiempo interactiva para hitos y planes.",
    iconName: "Map",
    props: [],
    template: () => `<Roadmap>
  <RoadmapItem 
    title="Versión 1.0" 
    status="released" 
    date="Q4 2023" 
    description="Lanzamiento estable."
  />
  <RoadmapItem 
    title="IA Assistant" 
    status="in-progress" 
    date="Q1 2024" 
    description="Integración de modelos de lenguaje."
  />
  <RoadmapItem 
    title="Marketplace" 
    status="planned" 
    description="Plugins de terceros."
    isLast={true}
  />
</Roadmap>`,
    helpMarkdown: `### Componente Roadmap
Comunica el progreso de tu proyecto.

**Estados disponibles:**
- \`released\`: Verde / Cohete.
- \`beta\`: Púrpura / Estrella.
- \`in-progress\`: Azul / Círculo.
- \`planned\`: Gris / Reloj.

Usa \`isLast={true}\` en el último item para ocultar la línea conectora.`
  },
  {
    id: "FeatureGlow",
    title: "Tarjetas con Resplandor",
    category: "Layout",
    description: "Tarjetas premium con efecto spotlight que sigue el mouse.",
    iconName: "Sparkles",
    props: [
      { name: "columns", label: "Columnas", type: "number", default: 3 },
    ],
    template: (p) => `<FeatureGlowGrid columns={${p.columns}}>
  <FeatureGlowCard 
    title="Diseño Premium" 
    description="Efecto de luz dinámica que sigue tu cursor."
    icon="Zap"
    glowColor="rgba(var(--primary-rgb), 0.2)"
  />
  <FeatureGlowCard 
    title="Interactividad" 
    description="Animaciones suaves con Framer Motion."
    icon="MousePointer2"
  />
</FeatureGlowGrid>`,
    helpMarkdown: `### Feature Glow Cards
Añade un toque futurista y premium a tu documentación.

**Cómo funciona:**
El resplandor circular se genera dinámicamente en la posición del mouse del usuario. Puedes personalizar el color del resplandor (\`glowColor\`) en cada tarjeta individualmente en el código MDX.`
  },
  {
    id: "Steps",
    title: "Lista de Pasos",
    category: "Layout",
    description: "Guía paso a paso con numeración automática y línea lateral.",
    iconName: "ChevronRight",
    props: [],
    template: () => `<Steps>
  <Step title="Clonación del Repositorio">
    Obtén el código base desde GitHub.
    <Terminal title="bash" children="git clone https://github.com/tu-usuario/mi-proyecto.git" />
  </Step>
  <Step title="Instalación">
    Instala las dependencias necesarias.
    \`\`\`bash
    npm install
    \`\`\`
  </Step>
  <Step title="¡Listo!">
    Lanza el servidor y comienza a editar.
    <Alert variant="success">Servidor corriendo en localhost:3000</Alert>
  </Step>
</Steps>`,
    helpMarkdown: `### Componente Steps
Guía a tus usuarios paso a paso con numeración automática.

**Mejores Prácticas:**
- Usa títulos cortos y directos para cada \`<Step>\`.
- Puedes anidar componentes como \`<Terminal>\` o \`<Alert>\` dentro de un paso.
- La línea lateral conecta todos los pasos automáticamente.`
  },
  {
    id: "Timeline",
    title: "Línea de Tiempo",
    category: "Layout",
    description: "Visualiza eventos y cronologías de manera vertical y elegante.",
    iconName: "GitPullRequest",
    props: [],
    template: () => `<Timeline>
  <TimelineItem title="Fase 1: Diseño" date="Enero 2024" variant="success">
    Definición de la arquitectura base y guía de estilos.
  </TimelineItem>
  <TimelineItem title="Fase 2: Beta" date="Febrero 2024" variant="active">
    Integración de componentes interactivos y feedback.
  </TimelineItem>
</Timeline>`,
    helpMarkdown: `### Componente Timeline
Muestra la evolución cronológica de tu proyecto.

**Variantes de Item:**
- \`success\`: Finalizado.
- \`active\`: En curso (con pulso).
- \`warning\`: Requiere atención.
- \`info\`: Informativo.`
  },
  {
    id: "TimelineFlow",
    title: "Flujo Animado (TimelineFlow)",
    category: "Interactivos",
    description: "Timeline horizontal con animaciones cinemáticas mediante Anime.js.",
    iconName: "Play",
    props: [
      { name: "steps", label: "Pasos (JSON)", type: "json", default: [
        { title: "Inicio", description: "Configuración inicial." },
        { title: "Proceso", description: "Transformación de datos." },
        { title: "Fin", description: "Entrega del producto." }
      ]},
    ],
    template: (p) => `<TimelineFlow steps={${JSON.stringify(p.steps)}} />`,
    helpMarkdown: `### TimelineFlow
Un diseño horizontal premium para procesos clave.

**Efectos:**
- Animación dinámica al entrar en el viewport.
- Diseño responsivo (se vuelve vertical en móviles).`
  },
  {
    id: "Accordion",
    title: "Acordeón",
    category: "Layout",
    description: "Organiza contenido en bloques colapsables.",
    iconName: "LayoutList",
    props: [
      { name: "allowMultiple", label: "Permitir Múltiples", type: "boolean", default: false, description: "Permite abrir varios items a la vez." },
      { name: "items", label: "Items (JSON)", type: "json", default: [
        { title: "¿Cómo puedo desplegar FusionDoc?", content: "FusionDoc está optimizado para **Vercel** y **Netlify**. Simplemente conecta tu repositorio." },
        { title: "¿Es compatible con Tailwind CSS?", content: "Sí, utiliza **Tailwind CSS v4** por defecto." },
        { title: "¿Puedo usar mis propios componentes?", content: "Absolutamente, regístralos en `MarkdownRenderer.tsx`." }
      ], description: "Lista de items con título y contenido." }
    ],
    template: (p) => {
      const items = Array.isArray(p.items) ? p.items : [];
      const itemsHtml = items.map((item: any) => `  <AccordionItem title="${item.title}">\n    ${item.content}\n  </AccordionItem>`).join("\n");
      return `<Accordion${p.allowMultiple ? " allowMultiple" : ""}>\n${itemsHtml}\n</Accordion>`;
    },
    helpMarkdown: `### Componente Accordion
Organiza información secundaria o FAQs.

**Propiedades:**
- \`allowMultiple\`: Si es true, cerrar un item no cerrará los demás.

**Ejemplo de estructura:**
\`\`\`mdx
<Accordion>
  <AccordionItem title="Título">
    Contenido aquí.
  </AccordionItem>
</Accordion>
\`\`\``
  },
  {
    id: "Carousel",
    title: "Carrusel",
    category: "Layout",
    description: "Slider interactivo para imágenes o tarjetas.",
    iconName: "LayoutList",
    props: [
      { name: "autoPlay", label: "Auto Reproducción", type: "boolean", default: false },
      { name: "interval", label: "Intervalo (ms)", type: "number", default: 5000 },
    ],
    template: (p) => `<Carousel autoPlay={${p.autoPlay}} interval={${p.interval}}>
  <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop" alt="Slide 1" />
  <img src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop" alt="Slide 2" />
</Carousel>`,
    helpMarkdown: `### Componente Carousel
Presenta colecciones de imágenes o contenido MDX.

**Consejos:**
- Ideal para galerías, testimonios o tours de producto.
- Pausa automáticamente al pasar el mouse.`
  },
  {
    id: "CodeTabs",
    title: "Pestañas de Código",
    category: "Base",
    description: "Alterna entre diferentes lenguajes o versiones de código.",
    iconName: "Type",
    props: [],
    template: () => `<CodeTabs>
  <CodeTab title="JavaScript" icon="vscode-icons:file-type-js-official">
    \`\`\`js
    console.log("Hola");
    \`\`\`
  </CodeTab>
  <CodeTab title="Python" icon="vscode-icons:file-type-python">
    \`\`\`python
    print("Hola")
    \`\`\`
  </CodeTab>
</CodeTabs>`,
    helpMarkdown: `### Pestañas de Código
Ideal para ejemplos multi-lenguaje.

**Iconos Disponibles:**
Usa identificadores de **Iconify** (ej: \`vscode-icons:file-type-js\`).`
  },

  // --- INTERACTIVOS ---
  {
    id: "AlgoVisualizer",
    title: "Visualizador de Algoritmos",
    category: "Interactivos",
    description: "Simulación interactiva de algoritmos de búsqueda y ordenamiento.",
    iconName: "Binary",
    props: [
      { name: "algo", label: "Algoritmo", type: "select", default: "bubble-sort", options: [
        { label: "Bubble Sort", value: "bubble-sort" },
        { label: "Insertion Sort", value: "insertion-sort" },
        { label: "Selection Sort", value: "selection-sort" },
        { label: "Quick Sort", value: "quick-sort" },
        { label: "Binary Search", value: "binary-search" },
      ]},
      { name: "data", label: "Datos (JSON)", type: "json", default: [8, 3, 5, 1, 9, 2, 7, 4, 6] },
      { name: "target", label: "Target (Búsqueda)", type: "number", description: "Solo para Binary Search." },
      { name: "speed", label: "Velocidad", type: "number", default: 1 },
      { name: "height", label: "Altura", type: "number", default: 300 },
    ],
    template: (p) => `<AlgoVisualizer 
  algo="${p.algo}" 
  data="${JSON.stringify(p.data)}" 
  ${p.target ? `target={${p.target}}` : ""}
  speed={${p.speed}}
  height={${p.height}}
/>`,
    helpMarkdown: `### Visualizador de Algoritmos
Visualiza la lógica de ordenamiento y búsqueda.

- **Speed:** 1 es normal, 1.5-2 es recomendado para QuickSort.
- **Binary Search:** Asegúrate de incluir un \`target\` si usas este algoritmo.`
  },
  {
    id: "JSXGraphBoard",
    title: "Geometría Dinámica (JSXGraph)",
    category: "Científico",
    description: "Tablero interactivo para geometría y cálculo.",
    iconName: "LineChart",
    props: [
      { name: "title", label: "Título", type: "text", default: "Laboratorio de Geometría" },
      { name: "height", label: "Altura (px)", type: "number", default: 400 },
      { name: "code", label: "Código JS", type: "text", default: "var p1 = board.create('point', [-2, -2], {name: 'A', color: '#10b981'}); \\nvar p2 = board.create('point', [0, 2], {name: 'B', color: '#3b82f6'}); \\nvar poly = board.create('polygon', [p1, p2, p1], {fillColor: 'rgba(59, 130, 246, 0.1)'});" },
    ],
    template: (p) => `<JSXGraphBoard 
  title="${p.title}" 
  height={${p.height}} 
  code={\`${p.code}\`} 
/>`,
    helpMarkdown: `### Geometría con JSXGraph
Escribe código imperativo para crear construcciones.

**Variables inyectadas:**
- \`board\`: El objeto del tablero actual.
- \`JXG\`: La librería JSXGraph completa.`
  },
  {
    id: "MafsBoard",
    title: "Lienzo Matemático (Mafs)",
    category: "Científico",
    description: "Visualización matemática interactiva y KaTeX.",
    iconName: "Sigma",
    props: [
      { name: "expression", label: "Ecuación KaTeX", type: "text", default: "f(x) = \\sin(x)" },
      { name: "height", label: "Altura (px)", type: "number", default: 400 },
    ],
    template: (p) => `<MafsBoard expression="${p.expression}" height={${p.height}}>
  <MafsCoordinates subdivisions={4} />
  <MafsPlot y="Math.sin(x)" color="var(--primary)" weight={3} />
  <MafsPoint x={0} y={0} color="#ef4444" />
</MafsBoard>`,
    helpMarkdown: `### Visualización Matemática
Usa Mafs para gráficas interactivas.

**Sub-componentes:**
- \`<MafsCoordinates />\`: Dibuja el plano cartesiano.
- \`<MafsPlot y="Math.sin(x)" />\`: Dibuja una función.
- \`<MafsPoint x={0} y={0} />\`: Dibuja un punto.`
  },
  {
    id: "P5Sketch",
    title: "Sketch p5.js",
    category: "Interactivos",
    description: "Lienzo creativo para arte generativo y simulaciones.",
    iconName: "Palette",
    props: [
      { name: "title", label: "Título", type: "text", default: "Simulación de Partículas" },
      { name: "height", label: "Altura (px)", type: "number", default: 400 },
      { name: "code", label: "Código p5", type: "text", default: "function setup() { createCanvas(600, 400); }\\nfunction draw() { background(20); fill(255); circle(mouseX, mouseY, 50); }" },
    ],
    template: (p) => `<P5Sketch 
  title="${p.title}" 
  height={${p.height}} 
  code={\`${p.code}\`} 
/>`,
    helpMarkdown: `### Arte Generativo con p5.js
Escribe código estilo Processing.

**Cómo usar:**
- No necesitas declarar la instancia de p5.
- Usa \`setup()\` y \`draw()\` directamente.
- Tienes acceso a todas las variables globales de p5 (\`width\`, \`height\`, \`mouseX\`, etc.).`
  },
  {
    id: "X6Diagram",
    title: "Diagrama de Flujo (X6)",
    category: "Interactivos",
    description: "Diagramas técnicos e industriales basados en AntV X6.",
    iconName: "GitBranch",
    props: [
      { name: "height", label: "Altura (px)", type: "number", default: 300 },
      { name: "interactive", label: "Interactivo", type: "boolean", default: true },
      { name: "data", label: "Estructura (JSON)", type: "json", default: {
        nodes: [
          { id: 'user', label: 'Usuario', x: 40, y: 120, color: '#ec4899' },
          { id: 'api', label: 'API Gateway', x: 230, y: 120 },
          { id: 'db', label: 'Postgres', x: 460, y: 120, color: '#3b82f6' }
        ],
        edges: [
          { source: 'user', target: 'api', label: 'HTTPS', animated: true },
          { source: 'api', target: 'db', label: 'SQL' }
        ]
      }},
    ],
    template: (p) => `<X6Diagram 
  height={${p.height}} 
  interactive={${p.interactive}} 
  data={${p.data}} 
/>`,
    helpMarkdown: `### Diagramas Profesionales X6
Ideal para arquitecturas cloud, workflows BPMN y topologías.

**Tips de Edición:**
- **Nodos:** Define \`id\`, \`label\`, \`x\`, \`y\` y \`color\`.
- **Aristas:** Conecta usando \`source\` y \`target\`. Usa \`animated: true\` para flujos activos.
- **Interactividad:** El usuario puede arrastrar nodos y hacer zoom.`
  },
  {
    id: "CodeExplainer",
    title: "Explicador de Código",
    category: "Interactivos",
    description: "Anatomía de código con explicaciones línea por línea.",
    iconName: "Info",
    props: [],
    template: () => `<CodeExplainer>
  \`\`\`js
  function calculateTotal(price, tax) {
    const total = price + (price * tax);
    return total;
  }
  \`\`\`
  <CodeExplainerStep lines="1">
    **Firma de la función**: Definimos los parámetros de entrada.
  </CodeExplainerStep>
  <CodeExplainerStep lines="2">
    **Cálculo**: Aplicamos el impuesto al precio base.
  </CodeExplainerStep>
  <CodeExplainerStep lines="3">
    **Retorno**: Devolvemos el valor final calculado.
  </CodeExplainerStep>
</CodeExplainer>`,
    helpMarkdown: `### CodeExplainer
Desglosa código paso a paso.

**Cómo usar:**
1. Inserta un bloque de código estándar.
2. Añade componentes \`<CodeExplainerStep lines="1-2">\` para cada explicación.
3. El prop \`lines\` controla qué líneas se resaltan.`
  },
  {
    id: "PropertyTable",
    title: "Tabla de Propiedades",
    category: "Base",
    description: "Documenta APIs, props o configuraciones de forma estructurante.",
    iconName: "Table",
    props: [
      { name: "items", label: "Propiedades (JSON)", type: "json", default: [
        { name: "apiKey", type: "string", required: true, description: "Clave de acceso al servicio." },
        { name: "timeout", type: "number", default: 5000, description: "Tiempo de espera en ms." }
      ]},
    ],
    template: (p) => `<PropertyTable items={${JSON.stringify(p.items)}} />`,
    helpMarkdown: `### Tabla de Propiedades
Ideal para documentar Props de componentes o configuraciones.

**Estructura del JSON:**
- \`name\`: Nombre de la prop.
- \`type\`: Tipo de dato.
- \`required\`: Booleano para activar el pulso rojo.
- \`default\`: Valor por defecto.`
  },
  {
    id: "FileTree",
    title: "Árbol de Archivos",
    category: "Layout",
    description: "Visualiza la estructura de carpetas de un proyecto.",
    iconName: "FolderTree",
    props: [],
    template: () => `<FileTree>
  <Folder name="src">
    <Folder name="components">
      <File name="Button.tsx" label="Componente Base" />
    </Folder>
    <File name="index.ts" />
  </Folder>
  <File name="package.json" />
</FileTree>`,
    helpMarkdown: `### Estructura de Archivos
Muestra jerarquías de carpetas de forma interactiva.

**Iconos Automáticos:**
El componente detecta la extensión (.ts, .js, .json, .css) y asigna un icono automáticamente.`
  },

  // --- MULTIMEDIA ---
  {
    id: "Terminal",
    title: "Terminal",
    category: "Multimedia",
    description: "Simula una terminal con animaciones de escritura paso a paso.",
    iconName: "Terminal",
    props: [
      { name: "title", label: "Título", type: "text", default: "bash" },
      { name: "shell", label: "Shell", type: "select", default: "bash", options: [
        { label: "Bash", value: "bash" },
        { label: "Zsh", value: "zsh" },
        { label: "PowerShell", value: "powershell" },
        { label: "Command Prompt", value: "cmd" },
        { label: "Node.js", value: "node" },
        { label: "Python", value: "python" },
      ]},
      { name: "staticText", label: "Texto Estático", type: "text", default: "Iniciando proceso..." },
      { name: "commands", label: "Comandos (\\n)", type: "content", default: "npm install\nnpm run dev" },
    ],
    template: (p) => `<Terminal 
  title="${p.title}" 
  shell="${p.shell}" 
  staticText="${p.staticText}" 
  commands="${p.commands.replace(/\n/g, '\\n')}" 
/>`,
    helpMarkdown: `### Terminal Interactiva
Simula una consola real con animaciones.

**Tips:**
- Usa \`\\n\` para separar comandos.
- La animación comienza cuando el usuario ve el componente.
- Elige el \`shell\` adecuado para mayor fidelidad visual.`
  },
  {
    id: "GithubRepo",
    title: "Repositorio GitHub",
    category: "Utilidades",
    description: "Tarjeta premium con estadísticas en vivo de un repositorio.",
    iconName: "Github",
    props: [
      { name: "url", label: "URL del Repo", type: "text", default: "https://github.com/facebook/react" },
      { name: "title", label: "Título / Alias", type: "text", placeholder: "Opcional: usuario/repo" },
      { name: "description", label: "Descripción", type: "text", placeholder: "Opcional: Breve resumen..." },
      { name: "stars", label: "Estrellas (Cache)", type: "text", placeholder: "Ej: 150k" },
      { name: "forks", label: "Forks (Cache)", type: "text", placeholder: "Ej: 20k" },
    ],
    template: (p) => `<GithubRepo 
  url="${p.url}" 
  ${p.title ? `title="${p.title}"` : ""} 
  ${p.description ? `description="${p.description}"` : ""} 
  ${p.stars ? `stars="${p.stars}"` : ""} 
  ${p.forks ? `forks="${p.forks}"` : ""} 
/>`,
    helpMarkdown: `### GitHub Repo Card
Muestra una tarjeta elegante con información de GitHub.

**Nota:** Aunque intenta detectar datos, puedes forzar el conteo de estrellas y forks para evitar límites de API en el build.`
  },
  {
    id: "Kbd",
    title: "Tecla (Kbd)",
    category: "Utilidades",
    description: "Representa una tecla física o atajo de teclado.",
    iconName: "Keyboard",
    props: [
      { name: "key", label: "Tecla", type: "text", default: "Ctrl", placeholder: "Ej: Shift, Enter, A" },
    ],
    template: (p) => `<Kbd>${p.key}</Kbd>`,
    helpMarkdown: "Ideal para guías de software y atajos. Renderiza una tecla con estilo Apple/Moderno."
  },
  {
    id: "Image",
    title: "Imagen con Zoom",
    category: "Multimedia",
    description: "Imagen profesional con efectos de zoom y lightbox.",
    iconName: "Image",
    props: [
      { name: "src", label: "URL Imagen", type: "text", default: "/images/placeholder.jpg" },
      { name: "alt", label: "Texto Alternativo", type: "text", default: "Descripción de imagen" },
      { name: "caption", label: "Pie de Foto", type: "text", placeholder: "Ej: Vista aérea del proyecto" },
    ],
    template: (p) => `<ZoomImage 
  src="${p.src}" 
  alt="${p.alt}" 
  ${p.caption ? `caption="${p.caption}"` : ""} 
/>`,
    helpMarkdown: "Optimiza la experiencia visual. Al hacer clic, la imagen se expande en un lightbox premium."
  },
  {
    id: "Video",
    title: "Video / Streaming",
    category: "Multimedia",
    description: "Reproductor de video con soporte para YouTube, Vimeo y Local.",
    iconName: "Video",
    props: [
      { name: "src", label: "URL del Video", type: "text", default: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { name: "type", label: "Tipo de Host", type: "select", default: "local", options: [
        { label: "Local / Directo", value: "local" },
        { label: "YouTube", value: "youtube" },
        { label: "Vimeo", value: "vimeo" },
      ]},
      { name: "autoplay", label: "Auto-reproducción", type: "boolean", default: false },
      { name: "loop", label: "Bucle", type: "boolean", default: false },
    ],
    template: (p) => `<Video 
  src="${p.src}" 
  type="${p.type}" 
  ${p.autoplay ? "autoplay" : ""} 
  ${p.loop ? "loop" : ""} 
/>`,
    helpMarkdown: "Detección inteligente: Si pegas una URL de YouTube, el componente lo detectará automáticamente."
  },
  {
    id: "Audio",
    title: "Reproductor de Audio",
    category: "Multimedia",
    description: "Barra de reproducción de audio elegante.",
    iconName: "Music",
    props: [
      { name: "src", label: "URL Audio", type: "text", default: "/audio/sample.mp3" },
      { name: "title", label: "Título", type: "text", placeholder: "Ej: Podcast Episodio 1" },
    ],
    template: (p) => `<Audio src="${p.src}" ${p.title ? `title="${p.title}"` : ""} />`,
    helpMarkdown: "Renderiza un reproductor minimalista con controles de volumen y progreso."
  },

  // --- CIENTIFICO ---
  {
    id: "Mafs",
    title: "Gráfico Matemático (Mafs)",
    category: "Científico",
    description: "Visualización matemática de alta precisión (Mafs).",
    iconName: "Activity",
    props: [],
    template: () => `<MafsBoard height={400}>
  <MafsCoordinates />
  <MafsPlot 
    fn={(x) => Math.sin(x)} 
    color="#3b82f6" 
  />
  <MafsPoint x={0} y={0} label="Origen" />
</MafsBoard>`,
    helpMarkdown: "Biblioteca reactiva para matemáticas. Permite funciones, vectores e interactividad."
  },
  {
    id: "JSXGraph",
    title: "Geometría Dinámica (JSXGraph)",
    category: "Científico",
    description: "Tablero interactivo de geometría y análisis matemático.",
    iconName: "Binary",
    props: [
      { name: "logic", label: "Lógica JS", type: "content", default: "const p1 = board.create('point', [1, 1]);\nconst p2 = board.create('point', [4, 2]);\nboard.create('line', [p1, p2]);" },
    ],
    template: (p) => `<JSXGraphBoard logic={\`${p.logic}\`} />`,
    helpMarkdown: "Accede a la API completa de JSXGraph para crear construcciones geométricas dinámicas."
  }
];

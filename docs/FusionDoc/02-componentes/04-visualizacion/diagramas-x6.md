# Diagramas de Flujo Avanzados (X6Diagram)

El componente `<X6Diagram />` integra el motor industrial **AntV X6** para permitir la creación de diagramas técnicos, grafos de procesos y arquitecturas de sistemas directamente en el navegador. Proporciona una experiencia CAD interactiva con soporte nativo para zoom, pan, y animaciones de flujo en tiempo real.

## Características
- **Interactividad Total**: Soporta zoom (rueda del mouse), pan (arrastrar fondo) y movimiento de nodos individualmente.
- **Flujos Animados**: Conexiones que simulan el tráfico de datos mediante líneas punteadas en movimiento.
- **Modo Proyectista**: Botón de pantalla completa integrado para analizar diagramas complejos en todo el viewport.
- **Estética Sincronizada**: Se adapta automáticamente al tema claro/oscuro de FusionDoc, ajustando colores de rejilla, nodos y textos.

---

## Diseños de Alto Nivel

### 1. Arquitectura Cloud (Multi-Nodo)
Simula un flujo de tráfico desde el usuario hasta la base de datos a través de una pasarela.

<X6Diagram height={300} data="{
  nodes: [
    { id: 'user', label: 'Usuario Final', x: 40, y: 120, color: '#ec4899', width: 140 },
    { id: 'gateway', label: 'API Gateway', x: 260, y: 120, width: 140 },
    { id: 'worker', label: 'Microservicio', x: 480, y: 120, color: '#8b5cf6', width: 140 },
    { id: 'db', label: 'Postgres DB', x: 700, y: 120, color: '#3b82f6', width: 140 }
  ],
  edges: [
    { source: 'user', target: 'gateway', label: 'HTTPS/TLS', animated: true },
    { source: 'gateway', target: 'worker', label: 'gRPC', animated: true },
    { source: 'worker', target: 'db', label: 'SQL Query' }
  ]
}" />

### 2. Ciclo de Vida de Proceso (BPMN)
Ideal para documentar flujos de trabajo con bifurcaciones y estados de decisión.

<X6Diagram height={350} data="{
  nodes: [
    { id: 'start', label: 'Inicio Evento', x: 100, y: 200, width: 100 },
    { id: 'check', label: '¿Válido?', x: 280, y: 190, color: '#eab308', width: 120, height: 60 },
    { id: 'reject', label: 'Rechazado', x: 280, y: 40, color: '#ef4444', height: 40 },
    { id: 'process', label: 'Procesamiento', x: 480, y: 190, color: '#22c55e', width: 140 }
  ],
  edges: [
    { source: 'start', target: 'check' },
    { source: 'check', target: 'reject', label: 'No' },
    { source: 'check', target: 'process', label: 'Si', animated: true }
  ]
}" />

### 3. Stack de Monitoreo (Grafos)
Visualiza topologías de red o dependencias de software.

<X6Diagram height={300} data="{
  nodes: [
    { id: 'beats', label: 'Filebeat', x: 100, y: 50, width: 140 },
    { id: 'sc', label: 'Logstash', x: 100, y: 200, width: 140 },
    { id: 'es', label: 'Elasticsearch', x: 350, y: 125, color: '#10b981', width: 160 }
  ],
  edges: [
    { source: 'beats', target: 'sc', animated: true },
    { source: 'sc', target: 'es', animated: true }
  ]
}" />

---

## Referencia de API

### `<X6Diagram />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `data` | `string \| object` | **Sí** | Definición del diagrama (nodos y aristas). |
| `height` | `number` | `400` | Altura del contenedor en píxeles. |
| `interactive` | `boolean` | `true` | Permite zoom, pan y mover nodos manualmente. |

### Configuración del Nodo (`nodes`)

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `string` | Identificador único (usado como referencia para las aristas). |
| `label` | `string` | Texto de la etiqueta central. |
| `x`, `y` | `number` | Coordenadas espaciales (base 0). |
| `width`, `height` | `number` | Dimensiones del nodo. |
| `color` | `string` | Color HEX de fondo personalizado. |

### Configuración de Arista (`edges`)

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `source` | `string` | ID del nodo origen. |
| `target` | `string` | ID del nodo destino. |
| `label` | `string` | Texto opcional sobre la conexión. |
| `animated` | `boolean` | Activa la animación de flujo de datos. |

---

## Mejores Prácticas
- **Interactive Off**: Si el diagrama es puramente informativo y pequeño, usa `interactive={false}` para evitar que el scroll se "pegue" al componente.
- **IDs Semánticos**: Usa nombres descriptivos para los IDs (`auth-server`, `main-db`) en lugar de `n1`, `n2` para facilitar el mantenimiento del MDX.
- **Viewport**: Los diagramas de X6 se centran automáticamente al cargar. No te preocupes por valores de X e Y excesivamente grandes.

> [!TIP]
> Puedes usar el botón de pantalla completa en la esquina superior derecha para examinar diagramas arquitectónicos de gran escala con total libertad de movimiento.

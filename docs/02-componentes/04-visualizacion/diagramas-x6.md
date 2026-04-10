---
title: Diagramas X6 (AntV)
description: Crea diagramas técnicos, grafos y arquitecturas de sistemas interactivos directamente en tu documentación MDX.
icon: 'lucide:network'
order: 15
---

# Diagramas con AntV X6

El componente **X6Diagram** integra el potente motor gráfico de AntV para renderizar diagramas profesionales dentro de tu documentación. Soporta modo oscuro, zoom, desplazamiento y conexiones animadas.

---

## 🚀 Arquitectura de Microservicios

Un diagrama de flujo con conexiones animadas entre servicios.

<X6Diagram height={280} data="[{ nodes: [{ id: 'client', label: 'Web App', x: 40, y: 115, color: '#ec4899' }, { id: 'api', label: 'API Gateway', x: 230, y: 115 }, { id: 'db', label: 'PostgreSQL', x: 460, y: 115, color: '#3b82f6' }], edges: [{ source: 'client', target: 'api', label: 'HTTPS', animated: true }, { source: 'api', target: 'db', label: 'SQL' }] }][0]" />

```mdx
<X6Diagram height={280} data="[{ nodes: [
  { id: 'client', label: 'Web App',    x: 40,  y: 115, color: '#ec4899' },
  { id: 'api',    label: 'API Gateway',x: 230, y: 115 },
  { id: 'db',     label: 'PostgreSQL', x: 460, y: 115, color: '#3b82f6' }
], edges: [
  { source: 'client', target: 'api', label: 'HTTPS', animated: true },
  { source: 'api',    target: 'db',  label: 'SQL' }
] }][0]" />
```

---

## 🎨 Stack ELK (Elasticsearch, Logstash, Kibana)

<X6Diagram height={300} data="[{ nodes: [{ id: 'ls', label: 'Logstash', x: 50, y: 180 }, { id: 'es', label: 'Elasticsearch', x: 260, y: 60, color: '#10b981' }, { id: 'kb', label: 'Kibana', x: 260, y: 280, color: '#f59e0b' }, { id: 'beats', label: 'Filebeat', x: 30, y: 50 }], edges: [{ source: 'beats', target: 'ls', animated: true }, { source: 'ls', target: 'es', animated: true }, { source: 'es', target: 'kb' }] }][0]" />

```mdx
<X6Diagram height={300} data="[{ nodes: [
  { id: 'beats', label: 'Filebeat',       x:  30, y:  50 },
  { id: 'ls',    label: 'Logstash',       x:  50, y: 180 },
  { id: 'es',    label: 'Elasticsearch',  x: 260, y:  60, color: '#10b981' },
  { id: 'kb',    label: 'Kibana',         x: 260, y: 280, color: '#f59e0b' }
], edges: [
  { source: 'beats', target: 'ls', animated: true },
  { source: 'ls',    target: 'es', animated: true },
  { source: 'es',    target: 'kb' }
] }][0]" />
```

---

## ⚙️ Propiedades

| Propiedad | Tipo | Por Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `data` | `string \| object` | — | Definición del diagrama con `nodes` y `edges`. |
| `height` | `number` | `400` | Altura del lienzo en píxeles. |
| `interactive` | `boolean` | `true` | Habilita zoom, pan y movimiento de nodos. |

### Nodo (`node`)

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `id` | `string` | Identificador único del nodo. |
| `label` | `string` | Texto visible dentro del nodo. |
| `x`, `y` | `number` | Posición inicial del nodo. |
| `width`, `height` | `number` | Tamaño del nodo (opcional). |
| `color` | `string` | Color de fondo personalizado. |

### Conexión (`edge`)

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `source` | `string` | ID del nodo de origen. |
| `target` | `string` | ID del nodo de destino. |
| `label` | `string` | Texto descriptivo sobre la conexión (opcional). |
| `animated` | `boolean` | Activa el flujo animado de línea punteada. |

---

> [!TIP]
> Establece `interactive={false}` para crear diagramas de solo lectura que no interfieran con el scroll de la página.
>
> [!NOTE]
> El atributo `data` acepta tanto un objeto JavaScript directo como un string JSON. Usa el formato string cuando trabajes con la sintaxis de etiqueta `[X6]`.

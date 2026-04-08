---
title: Diagramas Mermaid
description: Cómo integrar flujogramas, diagramas de secuencia y gráficos de Gantt directamente en MDX.
icon: 'lucide:git-graph'
order: 11
---

# Diagramas Mermaid

El componente `Mermaid` permite renderizar gráficos técnicos utilizando la sintaxis de Mermaid.js. Es ideal para documentar flujos de trabajo, arquitecturas de sistemas y cronogramas.

## Flujograma (Flowchart)

Diagramas de decisión y procesos con estilos personalizados.

<Mermaid 
  title="Flujo de Autenticación"
  chart={`
    graph TD
      A[Inicio de Sesión] --> B{¿Tiene Token?}
      B -- No --> C[Redirigir a Login]
      B -- Sí --> D[Validar Token]
      D --> E{¿Es Válido?}
      E -- No --> C
      E -- Sí --> F[Acceso Autorizado]
      C --> A
  `}
/>

## Diagrama de Secuencia

Para documentar la comunicación entre servicios o componentes.

<Mermaid 
  title="Secuencia de Registro"
  chart={`
    sequenceDiagram
      vendedor->>servidor: Enviar datos
      servidor-->>base_de_datos: Guardar usuario
      base_de_datos-->>servidor: Confirmación
      servidor-->>vendedor: Éxito
  `}
/>

## Gráfico de Gantt

Útiles para cronogramas de proyectos y roadmaps.

<Mermaid 
  title="Hoja de Ruta Q2"
  chart={`
    gantt
      title Desarrollo de FusionDoc
      dateFormat  YYYY-MM-DD
      section Diseño
      Arquitectura      :2026-04-01, 30d
      Prototipado       :2026-04-10, 20d
      section Desarrollo
      Frontend Core     :2026-04-20, 60d
      API Integration   :2026-05-15, 45d
  `}
/>

## Uso en MDX

```mdx
<Mermaid 
  title="Título del Diagrama"
  chart={\`
    graph LR
      A[Lado Izquierdo] --> B[Lado Derecho]
  \`}
/>
```

> [!IMPORTANT]
> Los diagramas Mermaid se renderizan en el lado del cliente. Asegúrate de que la sintaxis dentro de `chart` sea válida, de lo contrario verás un mensaje de error detallado en el componente.

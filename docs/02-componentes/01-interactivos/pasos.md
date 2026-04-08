---
title: Pasos (Steps)
description: Guía paso a paso para procesos secuenciales.
order: 4
icon: 'lucide:list-ordered'
---

# Guía Paso a Paso

El componente `<Steps />` permite organizar instrucciones complejas de manera visual y estructurada, ideal para tutoriales o configuraciones guiadas.

## Uso Básico

Puedes utilizarlo para describir procesos numerados. Cada `<Step />` representa una etapa importante del proceso.

<Steps>
  <Step title="Instalar Dependencias">
    Asegúrate de tener todas las librerías necesarias ejecutando el siguiente comando:
    <Terminal 
      title="Instalación"
      commands="npm install"
    />
  </Step>
  <Step title="Configurar Entorno">
    Crea un archivo `.env` en la raíz de tu proyecto.
  </Step>
  <Step title="Ejecutar Proyecto">
    Lanza el servidor de desarrollo para ver los cambios.
    ```bash
    npm run dev
    ```
  </Step>
</Steps>

```mdx
<Steps>
  <Step title="Instalar Dependencias">
    Asegúrate de tener todas las librerías necesarias...
  </Step>
  <Step title="Configurar Entorno">
    Crea un archivo `.env` en la raíz de tu proyecto.
  </Step>
</Steps>
```

## Propiedades de Step

| Propiedad | Tipo | Descripción |
| :--- | :--- | :--- |
| `title` | `string` | El título descriptivo del paso actual. |
| `children` | `React.ReactNode` | El contenido detallado que puede incluir texto, código u otros componentes. |

> [!IMPORTANT]
> El componente Pasos es altamente efectivo para mejorar la tasa de éxito de tus tutoriales técnicos.

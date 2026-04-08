---
title: Crear tu primer Proyecto
description: Guía paso a paso para configurar tu primer sitio de documentación.
icon: mdi:format-list-numbered
---

# Guía de Inicio

Sigue estos pasos para poner en marcha tu primer proyecto con FusionDoc.

<Steps>
  <Step title="Crear Directorio">
    Primero, crea una carpeta para tu proyecto y entra en ella.
    <Terminal commands="mkdir mi-doc\ncd mi-doc" />
  </Step>

  <Step title="Inicializar FusionDoc">
    Ejecuta el asistente de configuración inicial.
    <Terminal commands="npx fusiondoc init" />
  </Step>

  <Step title="Crear Contenido">
    Crea tu primer archivo `.md` en la carpeta `docs/`.
    ```bash
    touch docs/hola.md
    ```
  </Step>

  <Step title="Lanzar Servidor">
    ¡Listo! Ahora puedes previsualizar tu sitio.
    <Terminal commands="npm run dev" />
  </Step>
</Steps>

## Próximos pasos

Una vez que tengas tu servidor funcionando, consulta la [guía de componentes](../02-componentes/uso-de-tabs.md) para enriquecer tu documentación.

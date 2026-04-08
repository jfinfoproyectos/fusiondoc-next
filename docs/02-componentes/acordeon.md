---
title: Acordeón
description: Cómo organizar información desplegable usando el componente Accordion.
icon: 'lucide:layout-list'
order: 3
---

# Acordeón

El componente `Accordion` permite agrupar contenido que el usuario puede expandir o contraer, ideal para FAQs o detalles técnicos opcionales.

## Uso Básico

Puedes usar etiquetas `<Accordion>` y `<AccordionItem>`. Por defecto, solo permite abrir un elemento a la vez.

<Accordion>
  <AccordionItem title="¿Qué es FusionDoc?">
    FusionDoc es un generador de documentación ultrarrápido construido con Next.js y MDX.
  </AccordionItem>
  <AccordionItem title="¿Soporta modo oscuro?">
    Sí, FusionDoc tiene soporte nativo para temas claro y oscuro con detección automática.
  </AccordionItem>
</Accordion>

## Múltiples Elementos Abiertos

Si quieres permitir que el usuario abra varios elementos simultáneamente, usa la propiedad `allowMultiple`.

<Accordion allowMultiple>
  <AccordionItem title="Instalación">
    Puedes instalarlo vía npm: `npm install fusiondoc`.
  </AccordionItem>
  <AccordionItem title="Configuración">
    Configura tu `LOCAL_DOCS_PATH` en el archivo `.env.local`.
  </AccordionItem>
</Accordion>

## Ejemplo en MDX

````mdx
<Accordion>
  <AccordionItem title="Mi Título">
    Este es el contenido desplegable.
  </AccordionItem>
</Accordion>
````

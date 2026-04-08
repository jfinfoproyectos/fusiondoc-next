---
title: Uso de CodeTabs
description: Cómo organizar varios fragmentos de código usando pestañas.
icon: mdi:tab
---

# Pestañas de Código

Las pestañas de código son ideales cuando quieres mostrar el mismo ejemplo en diferentes lenguajes de programación o con diferentes gestores de paquetes.

## Ejemplo de Gestores de Paquetes

Puedes agrupar comandos de instalación para diferentes herramientas:

<CodeTabs>
  <CodeTab title="npm" icon="logos:npm-icon">
    ```bash
    npm install fusiondoc
    ```
  </CodeTab>
  
  <CodeTab title="Yarn" icon="logos:yarn">
    ```bash
    yarn add fusiondoc
    ```
  </CodeTab>
  
  <CodeTab title="pnpm" icon="logos:pnpm">
    ```bash
    pnpm add fusiondoc
    ```
  </CodeTab>
</CodeTabs>

## Ejemplo de Lenguajes

También puedes comparar implementaciones:

<CodeTabs>
  <CodeTab title="JavaScript" icon="logos:javascript">
    ```javascript
    console.log("Hola desde FusionDoc");
    ```
  </CodeTab>
  
  <CodeTab title="TypeScript" icon="logos:typescript-icon">
    ```typescript
    const message: string = "Hola desde FusionDoc";
    console.log(message);
    ```
  </CodeTab>
</CodeTabs>

---
title: Repositorio Dual (Local / Remoto)
description: Aprende cómo FusionDoc alterna dinámicamente entre el sistema de archivos local y la API de GitHub.
order: 2
icon: 'lucide:git-compare'
---

# Repositorio Dual

FusionDoc está diseñado para ofrecer una flexibilidad total al manejar la fuente de tu documentación. El sistema puede detectar automáticamente si debe servir los archivos desde tu computadora (**Modo Local**) o directamente desde un repositorio en la nube (**Modo Remoto**).

## ¿Cómo funciona?

La lógica de conmutación se basa exclusivamente en interruptores booleanos ubicados en tu archivo `.env.local` (o tu administrador de contenedores).

### 1. Sistema Autónomo Integrado (LocalDocs)
Se activa mediante la bandera `USE_LOCAL_DOCS`.

*   **Uso:** Ideal para desplegar directamente en Vercel, o construir servidores Docker cerrados con la documentación incrustada desde adentro (sin volúmenes). También ideal para redactar en *localhost*.
*   **Configuración:**
    ```env
    USE_LOCAL_DOCS=true
    ```
*   **Prioridad:** Si esta bandera es `true`, FusionDoc ignorará masivamente la API de GitHub para cualquier despliegue web o contenedor. Next.js atrapará automáticamente tu carpeta `docs/` y la incrustará de por vida en la compilación.

### 2. Modo Remoto (Nube GitHub por defecto)
Es el estado base de funcionamiento de FusionDoc si la bandera local está apagada.

*   **Uso:** Ideal para separar la base de código Next.js del Repositorio de Escritores que solo alojan markdowns en línea.
*   **Configuración:** Se requieren las 3 credenciales de repositorio: `GITHUB_OWNER`, `GITHUB_REPO` y `GITHUB_BRANCH`.

## Cómo Alternar entre Modos Rápidamente

<Steps>
  <Step title="Panel .env">
    Abre tu archivo `.env.local` y dirígete al encabezado "ORIGEN DE LOS DOCUMENTOS".
  </Step>
  
  <Step title="Activar/Desactivar Interruptores">
    Controla el `true` o `false` para indicar el comportamiento de tu sistema de inmediato.

    <CodeTabs>
      <CodeTab title="💻 Origen Físico (Local)" icon="lucide:hard-drive">
        ```env
        # Prioriza la lectura de la carpeta 'docs' de este mismo proyecto. (Recomendado para Vercel)
        USE_LOCAL_DOCS=true
        ```
      </CodeTab>
      
      <CodeTab title="☁️ Origen Remoto (API)" icon="lucide:cloud">
        ```env
        # Desactivando la capa local, cediendo la autoridad de lectura de documentos a GitHub
        USE_LOCAL_DOCS=false
        
        GITHUB_OWNER=tu-usuario
        GITHUB_REPO=tu-repositorio
        GITHUB_BRANCH=main
        ```
      </CodeTab>
    </CodeTabs>
  </Step>
</Steps>

> [!IMPORTANT]
> En **Modo Remoto**, FusionDoc utiliza un sistema de caché por SHA. Si el archivo en GitHub no ha cambiado, se servirá desde la caché de memoria para ahorrar límites de API y mejorar la velocidad.

## Beneficios
- **Velocidad de Escritura:** Escribe localmente con previsualización inmediata.
- **Despliegue Desacoplado:** Tu documentación puede vivir en un repo privado o público separado del código principal.
- **Seguridad:** Puedes usar un `GITHUB_TOKEN` para manejar repositorios privados de forma segura.

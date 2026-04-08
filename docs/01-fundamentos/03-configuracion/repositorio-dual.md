---
title: Repositorio Dual (Local / Remoto)
description: Aprende cómo FusionDoc alterna dinámicamente entre el sistema de archivos local y la API de GitHub.
order: 2
icon: 'lucide:git-compare'
---

# Repositorio Dual

FusionDoc está diseñado para ofrecer una flexibilidad total al manejar la fuente de tu documentación. El sistema puede detectar automáticamente si debe servir los archivos desde tu computadora (**Modo Local**) o directamente desde un repositorio en la nube (**Modo Remoto**).

## ¿Cómo funciona?

La lógica de conmutación se basa exclusivamente en la presencia de la variable de entorno `LOCAL_DOCS_PATH` en tu archivo `.env.local`.

### 1. Modo Local (Desarrollo)
Se activa cuando `LOCAL_DOCS_PATH` tiene una ruta válida en tu sistema de archivos.

*   **Uso:** Ideal para redactar documentación y ver los cambios al instante (Hot Reload).
*   **Configuración:**
    ```env
    LOCAL_DOCS_PATH=C:\Ruta\A\Tu\Proyecto\docs
    ```
*   **Prioridad:** Si esta variable está definida y la carpeta existe, FusionDoc ignorará cualquier configuración de GitHub.

### 2. Modo Remoto (Producción / Despliegue)
Se activa cuando `LOCAL_DOCS_PATH` está comentada o ausente.

*   **Uso:** Ideal para el despliegue final en plataformas como Vercel o GitHub Pages.
*   **Configuración:** Utiliza las variables `GITHUB_OWNER`, `GITHUB_REPO` y `GITHUB_BRANCH`.
*   **Ventaja:** No necesitas subir los archivos Markdown al mismo repositorio del código; puedes tener un repositorio independiente solo para la documentación.

## Cómo Alternar entre Modos

Para cambiar de modo, simplementa edita tu archivo `.env.local`:

**Para activar Modo Remoto:**
```bash
# Comenta la línea de la ruta local
# LOCAL_DOCS_PATH=C:\Users\...
```

**Para activar Modo Local:**
```bash
# Descomenta la línea
LOCAL_DOCS_PATH=C:\Users\...
```

> [!IMPORTANT]
> En **Modo Remoto**, FusionDoc utiliza un sistema de caché por SHA. Si el archivo en GitHub no ha cambiado, se servirá desde la caché de memoria para ahorrar límites de API y mejorar la velocidad.

## Beneficios
- **Velocidad de Escritura:** Escribe localmente con previsualización inmediata.
- **Despliegue Desacoplado:** Tu documentación puede vivir en un repo privado o público separado del código principal.
- **Seguridad:** Puedes usar un `GITHUB_TOKEN` para manejar repositorios privados de forma segura.

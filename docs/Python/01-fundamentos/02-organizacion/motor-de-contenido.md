---
title: Motor de Contenido
description: Detalles técnicos sobre cómo FusionDoc procesa, cachea y sirve tu documentación.
order: 2
icon: 'lucide:cpu'
---

# Motor de Contenido (Core Logic)

El corazón de FusionDoc reside en `src/lib/github.ts`. A pesar de su nombre, este módulo es un motor híbrido que gestiona la extracción de archivos tanto para el **Modo Local** como para el **Modo Remoto (GitHub)**.

## 🚀 Arquitectura del Procesamiento

Cuando un usuario solicita una página, el motor ejecuta el siguiente flujo lógico:

### 1. Resolución de Ruta (Slug)
El sistema recibe un arreglo de strings (`slug`) desde la ruta dinámica de Next.js. 
- `/fundamentos/intro` se convierte en `['fundamentos', 'intro']`.

### 2. Prioridad de Fuente
El motor verifica la variable `LOCAL_DOCS_PATH`.
- **Si existe y el directorio es legible:** Se activa el sistema de archivos de Node.js (`fs`).
- **Si no existe:** Se inicia el cliente de la API de GitHub.

### 3. Sistema de Caché Inteligente (Modo Remoto)
Para evitar el "Rate Limiting" de GitHub y maximizar la velocidad, implementamos un **Caché en Memoria basado en SHA**:

- **Verificación de SHA:** Antes de descargar el contenido de un archivo, FusionDoc consulta el SHA del blob en GitHub.
- **Hit de Caché:** Si el SHA coincide con uno almacenado en nuestro `contentCache` (Map), devolvemos el contenido instantáneamente sin realizar una petición de red pesada.
- **Miss de Caché:** Solo si el SHA es nuevo, se descarga el contenido y se actualiza el mapa de memoria.

---

## 📂 Estructura de Navegación

El motor no solo sirve páginas, sino que construye todo el árbol de navegación (`getNavigation`).

### Detección de Hijos
Cuando el motor detecta que el `slug` apunta a una carpeta (Topic o Categoría), realiza un escaneo recursivo para identificar todos los archivos `.md` en su interior. 
- Filtra archivos con `draft: true`.
- Filtra archivos con fechas de publicación futuras (`date`).
- Ordena los resultados según la propiedad `order` del Frontmatter.

---

## 🛡️ Seguridad y Robustez

- **Validación de fechas:** El método `isFutureDate` asegura que ningún contenido se filtre antes de su fecha programada.
- **Sanitización de Slugs:** Se eliminan extensiones `.md` y se normalizan los nombres de archivos para generar URLs limpias.
- **Frontmatter Fail-safe:** Si un archivo Markdown tiene un Frontmatter corrupto, el motor utiliza valores por defecto (título basado en el nombre del archivo) para evitar que la aplicación colapse.

> [!TIP]
> **Rendimiento Tip:** En **Modo Local**, Next.js maneja su propia optimización de archivos, pero en **Modo Remoto**, nuestro sistema de caché SHA es vital para mantener tiempos de respuesta de milisegundos.

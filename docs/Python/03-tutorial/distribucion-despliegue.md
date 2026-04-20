---
title: "Distribución y Despliegue"
description: "Guía completa para desplegar FusionDoc en plataformas Nube (Vercel) y usar contenedores Docker para alojamiento privado."
---

# Estrategias de Distribución y Despliegue

FusionDoc está diseñado con una arquitectura moderna que soporta despliegues versátiles. Ya sea que desees lanzar tu sitio de documentación públicamente en minutos, o necesites alojarlo en un servidor empresarial cerrado que procese documentos en tiempo real de tu propio disco duro, nuestra infraestructura te tiene cubierto.

A continuación, se documentan las dos vías oficiales de distribución integradas en el proyecto.

---

## Método 1: Despliegue Nube Nativo (Vercel) - *Recomendado*

El proyecto está fuertemente acoplado a **Next.js 16**, lo que significa que su mayor potencial, velocidad de compilación (Turbopack) y alojamiento perimetral se despliega de manera nativa y gratuita a través de [Vercel](https://vercel.com). Esta es la ruta principal para sitios públicos de documentación.

### Pasos para Desplegar

1. **Sube tu código a GitHub:** Asegúrate de que el código fuente de FusionDoc esté alojado en un repositorio repositorio limpio.
2. **Importa en Vercel:** Inicia sesión en Vercel y haz clic en "Add New Project", selecciona tu repositorio.
3. **Variables de Entorno (Opcional):** Tienes dos rutas para configurar Vercel:
   - **Opción A (Docs en el Mismo Repositorio):** Ve a Enviroment Variables en Vercel, y crea la variable `USE_LOCAL_DOCS=true`. Vercel compilará silenciosamente la carpeta `docs` que subiste y prescindirá de cualquier conexión API.
   - **Opción B (Repositorio Separado vía API):** Define las 3 credenciales de repositorio: `GITHUB_OWNER`, `GITHUB_REPO` y `GITHUB_BRANCH`.
4. **Deploy:** Vercel instalará las dependencias y te entregará una URL global optimizada.

---

## Método 2: La Vía Docker (Self-Hosted)

Para distribuciones cerradas, empresariales, arquitecturas on-premise (como AWS, Render o tu propio VPS), utilizamos el estándar maestro de **Contenedores Docker**.

Nuestra configuración Docker se caracteriza por ser ultra-optimizada (implementa de forma obligatoria el modo *Standalone* de Next.js reduciendo el peso de la imagen bajo 200MB) y ejecutar **Pobreza de Privilegios** operando sin rol Root.

La imagen Docker de FusionDoc está **diseñada estrictamente para conectarse de manera remota a tus repositorios de GitHub** a través de variables de entorno. Esto aísla por completo el código fuente de tus documentos, facilitando actualizaciones y garantizando alta disponibilidad.

### 🐳 Despliegue desde una Imagen Precompilada (Recomendado)

Si ya subiste la imagen de FusionDoc a un registro como **Docker Hub** (o GitHub Container Registry), el usuario o servidor en producción **no necesita descargar el código fuente ni construir absolutamente nada**. Solo necesita el motor de Docker.

**Opción A: Comando Directo (`docker run`)**
```bash
docker run -d \
  --name fusiondoc-app \
  -p 3000:3000 \
  -e GITHUB_OWNER="tu-usuario" \
  -e GITHUB_REPO="tu-repo-docs" \
  -e GITHUB_BRANCH="main" \
  -e GITHUB_TOKEN="github_pat_XXXXX..." \
  tu-usuario-dockerhub/fusiondoc:latest
```

**Opción B: Archivo Estándar (`docker-compose.yml`)**
Para gestionar el reinicio automático del contenedor de una forma más profesional, simplemente crea un archivo `docker-compose.yml` en cualquier directorio vacío del servidor:

```yaml
version: '3.8'
services:
  fusiondoc:
    image: tu-usuario-dockerhub/fusiondoc:latest
    container_name: fusiondoc-app
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - GITHUB_OWNER=tu-usuario
      - GITHUB_REPO=tu-repo-docs
      - GITHUB_BRANCH=main
      - GITHUB_TOKEN=github_pat_XXXXX... # Opcional: Solo si el repositorio es privado
```

Luego, solo ejecuta `docker-compose up -d`. El servidor descargará la imagen, se conectará a la API de GitHub e instantáneamente servirá tu documentación.

### 🛠️ Compilar la Imagen Manualmente

Si nunca has subido la imagen a un registro y tienes el código fuente de FusionDoc en tu servidor:

1. **Construye la imagen originaria:**
   ```bash
   docker build -t fusiondoc-local .
   ```
2. **Despliégala** inyectando directamente tus variables:
   ```bash
   docker run -d -p 3000:3000 --env-file .env fusiondoc-local
   ```

---

## Método 3: Plataformas de Contenedores (Render, Railway, Fly.io)

Plataformas como [Render](https://render.com) o Railway no utilizan tu archivo `docker-compose.yml`, sino que detectan y compilan directamente tu `Dockerfile` para lanzarlo a la nube. FusionDoc está perfectamente adaptado para este esquema.

### Pasos para Desplegar en Render:

1. **Sube tu código a GitHub** y crea una cuenta en Render.
2. Crea un nuevo **"Web Service"** y conecta el repositorio de tu proyecto FusionDoc.
3. **Punto Crucial:** Render detectará automáticamente el archivo `Dockerfile` y seleccionará "Docker" como tu entorno de ejecución. No necesitas configurar comandos de construcción (`build`).
4. **Environment Variables (Variables de Entorno):** En la sección de configuración de Render, inyecta las variables de tu ecosistema.
   - Si tienes tu carpeta `docs/` en tu repositorio y quieres que esa sea tu fuente de lectura principal, crea:
     `USE_LOCAL_DOCS = true`
   - Si por el contrario quieres separar tu código de tus documentos (modo API clásico), no pongas la variable local y simplemente declara:
     `GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`.
5. **Autocarga en Producción:** Haz clic en *Deploy Web Service*. Render creará la cápsula cerrada de Next.js, inyectará en la memoria las variables que llenaste en su página, y desplegará tu app al mundo.

> [!IMPORTANT]
> Next.js requiere que ciertas variables de entorno se inyecten **durante el tiempo de compilación**. Asegúrate de llenar todas las variables necesarias en la plataforma en la nube _antes_ de darle al botón de compilar para que FusionDoc las integre correctamente.

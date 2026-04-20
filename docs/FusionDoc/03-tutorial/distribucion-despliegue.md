---
title: "Distribución y Despliegue"
description: "Guía completa para desplegar FusionDoc en plataformas Nube (Vercel) y usar contenedores Docker para alojamiento privado."
---

# Estrategias de Distribución y Despliegue

FusionDoc está diseñado con una arquitectura moderna que soporta despliegues versátiles. Ya sea que desees lanzar tu sitio de documentación públicamente en minutos, o necesites alojarlo en un servidor empresarial cerrado que procese documentos en tiempo real de tu propio repositorio, nuestra infraestructura te tiene cubierto.

A continuación, se documentan las dos vías oficiales de distribución integradas en el proyecto.

---

## Método 1: Despliegue Nube Nativo (Vercel) - *Recomendado*

El proyecto está fuertemente acoplado a **Next.js 16**, lo que significa que su mayor potencial, velocidad de compilación (Turbopack) y alojamiento perimetral se despliega de manera nativa a través de [Vercel](https://vercel.com). Esta es la ruta principal para sitios públicos de documentación.

### Pasos para Desplegar

1. **Sube tu código a GitHub:** Asegúrate de que el código fuente de FusionDoc esté alojado en un repositorio limpio.
2. **Importa en Vercel:** Inicia sesión en Vercel y haz clic en "Add New Project", selecciona tu repositorio.
3. **Variables de Entorno:** Define las credenciales en la pestaña de Environment Variables:
   - **Modo Público (Recomendado)**: Crea `ENABLE_AUTH_DB=false`. No necesitas configurar nada de base de datos.
   - **Modo Gestionado**: Crea `ENABLE_AUTH_DB=true` y define tu `DATABASE_URL`.
4. **Deploy:** Vercel instalará las dependencias y te entregará una URL global optimizada.

---

## 🔄 Sincronización de Base de Datos (Managed Mode)

Si decides usar el **Modo Gestionado**, FusionDoc incluye herramientas para facilitar la conexión con diferentes motores de base de datos (Postgres, SQLite, MySQL) sin cambiar manualmente el código del esquema.

### Script de Sincronización Automática
Antes de generar el cliente de Prisma, debes sincronizar el proveedor:

```bash
# 1. Configura tu DATABASE_PROVIDER="sqlite" (por ejemplo) en el .env
# 2. Ejecuta la sincronización
npm run prisma:sync
```

Este comando leerá tu variable de entorno y modificará automáticamente el archivo `schema.prisma` para usar el motor correcto.

### Generación y Migración
Una vez sincronizado, puedes preparar la base de datos:

```bash
# Generar el cliente de Prisma
npx prisma generate

# Empujar el esquema a la base de datos (desarrollo/producción)
npx prisma db push
```

---

## Método 2: La Vía Docker (Self-Hosted)

Para distribuciones cerradas, empresariales o arquitecturas on-premise, utilizamos el estándar de **Contenedores Docker**. Esta vía es ideal para garantizar que el entorno de ejecución sea idéntico al de desarrollo.

### 🐳 Despliegue con Docker Compose

FusionDoc utiliza un `Dockerfile` multietapa optimizado. Debido a que Next.js 16 realiza optimizaciones durante la compilación, es **crítico** pasar las variables de entorno tanto en la fase de construcción (`build args`) como en la de ejecución.

#### Ejemplo Completo de `docker-compose.yml`

```yaml
services:
  fusiondoc:
    image: fusiondoc-app
    container_name: fusiondoc-container
    ports:
      - "3000:3000"
    # Variables disponibles mientras la App está corriendo (Server Side)
    environment:
      - GITHUB_TOKEN=${GITHUB_TOKEN}
      - GITHUB_OWNER=${GITHUB_OWNER}
      - GITHUB_REPO=${GITHUB_REPO}
      - GITHUB_BRANCH=${GITHUB_BRANCH}
      - SITE_TITLE=${SITE_TITLE}
      - SITE_LOGO=${SITE_LOGO}
      - SOCIAL_LINKS=${SOCIAL_LINKS}
      - ENABLE_AUTH_DB=${ENABLE_AUTH_DB}
      - DATABASE_URL=${DATABASE_URL}
    # Variables inyectadas en la compilación (Client Side / Static Generation)
    build: 
      context: .
      args:
        - GITHUB_TOKEN=${GITHUB_TOKEN}
        - GITHUB_OWNER=${GITHUB_OWNER}
        - GITHUB_REPO=${GITHUB_REPO}
        - GITHUB_BRANCH=${GITHUB_BRANCH}
        - SITE_TITLE=${SITE_TITLE}
        - SITE_LOGO=${SITE_LOGO}
        - SOCIAL_LINKS=${SOCIAL_LINKS}
        - ENABLE_AUTH_DB=${ENABLE_AUTH_DB}
```

### 🛠️ Comandos de Despliegue

Para poner en marcha tu instancia de FusionDoc con Docker, sigue estos pasos:

1.  **Configura tu `.env`**: Asegúrate de tener todas las variables necesarias en la raíz del proyecto.
2.  **Compila e Inicia**:
    ```bash
    # Construye la imagen inyectando las variables del .env
    docker-compose up --build -d
    ```
3.  **Verificación**: Accede a `http://localhost:3000`.

> [!IMPORTANT]
> Si cambias variables visuales como `SITE_TITLE` o `SITE_LOGO`, debes reconstruir la imagen (`--build`) para que Next.js regenere las páginas estáticas con los nuevos valores.

---

## Método 3: Plataformas de Contenedores (Render, Railway, Fly.io)

Plataformas como [Render](https://render.com) detectan y compilan directamente tu `Dockerfile`. 

### Pasos para Desplegar:

1. **Sube tu código a GitHub** y conecta el repositorio en la plataforma elegida.
2. **Variables de Entorno:** Inyecta las variables de tu ecosistema *antes* de la compilación.
3. **Modo Público (Zero-DB):** Para un despliegue rápido y gratuito, recuerda configurar `ENABLE_AUTH_DB = false`.
4. **Autocarga en Producción:** Haz clic en *Deploy Web Service*. Render creará la cápsula cerrada de Next.js, inyectará en la memoria las variables que llenaste en su página, y desplegará tu app al mundo.

> [!IMPORTANT]
> Next.js 16 y Prisma requieren que ciertas variables de entorno se inyecten **durante el tiempo de compilación**. Asegúrate de llenar todas las variables necesarias en la plataforma en la nube _antes_ de darle al botón de compilar para que FusionDoc las integre correctamente.

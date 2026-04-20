# FusionDoc Next

FusionDoc es un entorno avanzado y dinámico para visualización de documentación de proyectos, construido sobre **Next.js 16 (Turbopack)**. El sistema extrae, categoriza y renderiza automáticamente archivos Markdown (MD/MDX) provenientes de repositorios GitHub, proporcionando una interfaz rica en componentes, rápida e inmersiva.

## 🚀 Características Principales
- **Conectividad Git:** Obtención dinámica de documentos MD y MDX desde repositorios.
- **Rendimiento Next.js 16:** Aprovechando SSG/SSR y Turbopack para compilación rápida.
- **Auto-Despliegue y Distribución Cerrada:** Empaquetado disponible en Docker y distribuible de manera segura por NPM.
- **Estilos Premium:** Integración nativa con TailwindCSS v4 y Shadcn UI.

---

## 💻 Desarrollo Local (Para Autores)

Para modificar el código fuente de FusionDoc, sigue estos pasos:

1. **Clona y Configura el `.env`**
   Copia el archivo `.env.example` y renómbralo a `.env.local`
   Añade la información obligatoria de tu repositorio (Dueño, Repo, Rama).

2. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
3. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📦 Despliegue en la Nube (Vercel)

El proyecto está 100% optimizado para ser desplegado nativamente en Vercel.

1. Sube este proyecto a tu repositorio de GitHub.
2. Inicia sesión en [Vercel](https://vercel.com).
3. Importa tu repositorio.
4. Configura las variables de entorno (`GITHUB_OWNER`, `GITHUB_REPO`, `GITHUB_BRANCH`) en la configuración del proyecto en Vercel.
5. Vercel compilará mágicamente tu sitio y te dará tu URL optimizada.
6. (Opcional): Si usas Docker en otra plataforma, usa el `Dockerfile` incluido.

---

## 📄 Licencia y Uso

Este proyecto se distribuye bajo la **Licencia MIT**.
Se permite el **libre uso, modificación, distribución y uso comercial**, siempre y cuando se **reconozca al creador original** incluyendo una copia de la licencia y los derechos de autor en las copias sustanciales del software.

Dicho de forma simple: Eres libre de usar el proyecto como gustes, pero debes mantener visible el crédito al autor original. Revisa el archivo `LICENSE` adjunto para más detalles técnicos.

> Creado por: **Jhon F** (FusionDoc Architecture)

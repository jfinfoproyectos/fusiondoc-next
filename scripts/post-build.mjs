import fs from 'fs';
import path from 'path';

/**
 * Script to automate the setup of the Next.js standalone build for professional distribution.
 * It copies static assets, environment templates, and generates a distribution README.
 */

async function main() {
  if (process.env.BUILD_STANDALONE !== 'true') {
    console.log('BUILD_STANDALONE is not true. Skipping standalone assets copy.');
    return;
  }

  const rootDir = process.cwd();
  const standaloneDir = path.join(rootDir, '.next', 'standalone');

  if (!fs.existsSync(standaloneDir)) {
    console.warn('Standalone directory not found at .next/standalone. Ensure "output: standalone" is in next.config.ts');
    return;
  }

  console.log('🚀 Finalizing professional standalone package...');

  // 0. Sanitize server.js — remove hardcoded absolute build-machine paths
  //    Next.js embeds the absolute path of the build machine in server.js inside the
  //    nextConfig JSON blob (outputFileTracingRoot and turbopack loader paths).
  //    These break portability when the standalone folder is copied to another machine or Docker.
  const serverJsPath = path.join(standaloneDir, 'server.js');
  if (fs.existsSync(serverJsPath)) {
    console.log('  - Sanitizing server.js (removing hardcoded build-machine paths)...');
    let serverJs = fs.readFileSync(serverJsPath, 'utf8');

    // Parse out the embedded nextConfig JSON from the server.js file
    const configMatch = serverJs.match(/const nextConfig = (\{[\s\S]*?\})\n/);
    if (configMatch) {
      try {
        const config = JSON.parse(configMatch[1]);

        // 1. Remove outputFileTracingRoot (absolute path to build dir, not needed at runtime)
        delete config.outputFileTracingRoot;

        // 2. Sanitize turbopack loader paths — replace absolute paths with __dirname-relative
        if (config.turbopack?.rules) {
          const rulesStr = JSON.stringify(config.turbopack.rules);
          // Detect and strip any OS path that precedes /node_modules/
          const sanitized = rulesStr.replace(
            /"loader"\s*:\s*"[^"]*[/\\\\]node_modules([^"]*)"/g,
            (_, rest) => `"loader": require.resolve('.' + ${JSON.stringify('/node_modules' + rest.replace(/\\\\/g, '/'))})`
          );
          // Re-embed as sanitized string (loaders are only used by dev/turbopack, not prod server)
          // Safest: just remove turbopack config entirely from the prod server bundle
          delete config.turbopack;
        }

        // 3. Replace config in server.js
        const newConfigLine = `const nextConfig = ${JSON.stringify(config)}\n`;
        serverJs = serverJs.replace(/const nextConfig = \{[\s\S]*?\}\n/, newConfigLine);
        fs.writeFileSync(serverJsPath, serverJs, 'utf8');
        console.log('  ✓ server.js sanitized successfully.');
      } catch (e) {
        console.warn('  ⚠ Could not parse nextConfig in server.js — skipping sanitization.', e.message);
      }
    } else {
      console.warn('  ⚠ Could not locate nextConfig in server.js — skipping sanitization.');
    }
  }

  // 1. Copy mandatory Next.js static assets
  const staticTasks = [
    { src: path.join(rootDir, 'public'), dest: path.join(standaloneDir, 'public') },
    { src: path.join(rootDir, '.next', 'static'), dest: path.join(standaloneDir, '.next', 'static') }
  ];

  for (const task of staticTasks) {
    if (fs.existsSync(task.src)) {
      console.log(`  - Copying assets: ${path.basename(task.src)}`);
      fs.cpSync(task.src, task.dest, { recursive: true, force: true });
    }
  }

  // 2. Copy distribution templates (Optional but recommended)
  const distTemplates = [
    { src: path.join(rootDir, '.env.example'), dest: path.join(standaloneDir, '.env.example') },
    { src: path.join(rootDir, 'prisma', 'schema.prisma'), dest: path.join(standaloneDir, 'prisma', 'schema.prisma') }
  ];

  for (const template of distTemplates) {
    if (fs.existsSync(template.src)) {
      const parentDest = path.dirname(template.dest);
      if (!fs.existsSync(parentDest)) fs.mkdirSync(parentDest, { recursive: true });

      console.log(`  - Including template: ${path.basename(template.src)}`);
      fs.copyFileSync(template.src, template.dest);
    }
  }

  // 3. Generate Distribution READMEs
  const getReadmeContent = (lang = 'en') => {
    const isEs = lang === 'es';

    if (isEs) {
      return `# FusionDoc - Build de Producción

Esta es una compilación de producción auto-contenida de FusionDoc. Incluye todas las dependencias necesarias y la lógica compilada lista para ser desplegada.

## Instrucciones de Despliegue

### 1. Configuración de Entorno
Copia el archivo \`.env.example\` a un nuevo archivo llamado \`.env\` y completa los valores requeridos:
\`\`\`bash
cp .env.example .env
# Edita .env con los detalles de tu base de datos y autenticación
\`\`\`

### 2. Configuración de Base de Datos (Si usas Prisma)
Si tienes migraciones de Prisma que ejecutar, asegúrate de tener \`prisma\` instalado o usa el esquema proporcionado:
\`\`\`bash
npx prisma migrate deploy
\`\`\`

### 3. Iniciar el Servidor (Node.js)
Ejecuta la aplicación usando Node.js (se recomienda v18+):
\`\`\`bash
node server.js
\`\`\`
La aplicación estará disponible en http://localhost:3000.

---

## Opciones de Despliegue Profesional

### 🐳 Despliegue con Docker
Para desplegar usando Docker, puedes usar el \`Dockerfile\` ubicado en la raíz del proyecto original. Si deseas crear una imagen rápida desde este paquete standalone, usa:

1. Crea un archivo \`Dockerfile\` en esta carpeta:
\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`
2. Construye y ejecuta:
\`\`\`bash
docker build -t fusiondoc-app .
docker run -p 3000:3000 fusiondoc-app
\`\`\`

### ▲ Despliegue en Vercel
Vercel es la plataforma recomendada para Next.js.
1. Conecta tu repositorio de GitHub/GitLab/Bitbucket a Vercel.
2. Vercel detectará automáticamente Next.js y configurará el build.
3. Asegúrate de configurar las variables de entorno (\`ENV\`) en el panel de Vercel.

*Nota: Vercel no utiliza este paquete standalone directamente, sino que construye desde el código fuente.*

---
[View English Version](README.md)
*Generado por el Sistema de Build de FusionDoc*
`;
    }

    return `# FusionDoc - Production Build

This is a self-contained production build of FusionDoc. It includes all necessary dependencies and compiled logic ready for deployment.

## Deployment Instructions

### 1. Environment Configuration
Copy the \`.env.example\` file to a new file named \`.env\` and fill in the required values:
\`\`\`bash
cp .env.example .env
# Edit .env with your database and authentication details
\`\`\`

### 2. Database Setup (If using Prisma)
If you have Prisma migrations to run, ensure you have \`prisma\` installed or use the provided schema:
\`\`\`bash
npx prisma migrate deploy
\`\`\`

### 3. Start the Server (Node.js)
Run the application using Node.js (v18+ recommended):
\`\`\`bash
node server.js
\`\`\`
The application will be available at http://localhost:3000.

---

## Professional Deployment Options

### 🐳 Docker Deployment
To deploy using Docker, you can use the \`Dockerfile\` located in the original project root. If you want to create a quick image from this standalone package, use:

1. Create a \`Dockerfile\` in this folder:
\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`
2. Build and run:
\`\`\`bash
docker build -t fusiondoc-app .
docker run -p 3000:3000 fusiondoc-app
\`\`\`

### ▲ Vercel Deployment
Vercel is the recommended platform for Next.js.
1. Connect your GitHub/GitLab/Bitbucket repository to Vercel.
2. Vercel will automatically detect Next.js and configure the build.
3. Make sure to configure the Environment Variables in the Vercel dashboard.

*Note: Vercel does not use this standalone package directly; it builds from source code.*

---
[Ver Versión en Español](README.es.md)
*Generated by FusionDoc Build System*
`;
  };

  fs.writeFileSync(path.join(standaloneDir, 'README.md'), getReadmeContent('en'));
  fs.writeFileSync(path.join(standaloneDir, 'README.es.md'), getReadmeContent('es'));
  console.log('  - Generated README.md and README.es.md for distribution.');

  console.log('✅ Standalone package is now 100% ready for distribution.');
}

main().catch((err) => {
  console.error('❌ Error during post-build script:', err);
  process.exit(1);
});

# Etapa 1: Constructor (Builder)
FROM node:20-alpine AS builder
# Instala compatibilidad con librerías nativas ligeras
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Forzamos la variable de entorno responsable de activar "output: standalone"
ENV BUILD_STANDALONE=true

# ARGUMENTOS DE CONSTRUCCIÓN (Para Next.js Static Generation)
ARG GITHUB_TOKEN
ARG GITHUB_OWNER
ARG GITHUB_REPO
ARG GITHUB_BRANCH
ARG GITHUB_DOCS_PATH
ARG SITE_TITLE
ARG SITE_LOGO
ARG FOOTER
ARG SOCIAL_LINKS
ARG ENABLE_AUTH_DB
ARG DATABASE_PROVIDER
ARG DATABASE_URL
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET

# MAPEO DE ARGS A ENV (Disponibles durante npm run build)
ENV GITHUB_TOKEN=$GITHUB_TOKEN
ENV GITHUB_OWNER=$GITHUB_OWNER
ENV GITHUB_REPO=$GITHUB_REPO
ENV GITHUB_BRANCH=$GITHUB_BRANCH
ENV GITHUB_DOCS_PATH=$GITHUB_DOCS_PATH
ENV SITE_TITLE=$SITE_TITLE
ENV SITE_LOGO=$SITE_LOGO
ENV FOOTER=$FOOTER
ENV SOCIAL_LINKS=$SOCIAL_LINKS
ENV ENABLE_AUTH_DB=$ENABLE_AUTH_DB
ENV DATABASE_PROVIDER=$DATABASE_PROVIDER
ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

# Instalación de dependencias (cache de capas de Docker)
COPY package.json package-lock.json* ./
RUN npm ci

# Copiamos el resto del código
COPY . .

# Sincronizamos el proveedor de Prisma y generamos el cliente
RUN npx tsx src/scripts/sync-prisma.ts && npx prisma generate

RUN npm run build

# Etapa 2: Ejecutor (Runner) - Imagen productiva y ultra-ligera
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV IS_DOCKER=true

# VARIABLES DE ENTORNO EN TIEMPO DE EJECUCIÓN
ENV GITHUB_TOKEN=$GITHUB_TOKEN
ENV GITHUB_OWNER=$GITHUB_OWNER
ENV GITHUB_REPO=$GITHUB_REPO
ENV GITHUB_BRANCH=$GITHUB_BRANCH
ENV GITHUB_DOCS_PATH=$GITHUB_DOCS_PATH
ENV SITE_TITLE=$SITE_TITLE
ENV SITE_LOGO=$SITE_LOGO
ENV FOOTER=$FOOTER
ENV SOCIAL_LINKS=$SOCIAL_LINKS
ENV ENABLE_AUTH_DB=$ENABLE_AUTH_DB
ENV DATABASE_PROVIDER=$DATABASE_PROVIDER
ENV DATABASE_URL=$DATABASE_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET

# Crea un usuario no root por seguridad extrema
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Solo copiamos de la 'Etapa 1' los directorios de estáticos y standalone
COPY --from=builder /app/public ./public

# Crear directorio oculto de Next con permisos correctos
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copiamos la compilación aislada con permisos de usuario seguro
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Puerto interno al contenedor
EXPOSE 3000

ENV PORT=3000

# Se delega la ejecución al comando binario empacado
CMD ["node", "server.js"]

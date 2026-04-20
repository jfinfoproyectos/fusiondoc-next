---
title: Bienvenido a FusionDoc
description: La plataforma de documentación moderna para tus proyectos, impulsada por Next.js 16 y MDX Interactivo.
icon: mdi:home
---

# Bienvenido a FusionDoc

Esta es la página de inicio de tu documentación. Desde aquí puedes navegar por todas las secciones disponibles usando el menú lateral dinámico y el potente motor de búsqueda Orama.

La arquitectura de **FusionDoc** utiliza [Next.js 16](https://nextjs.org/) con el App Router, lo que permite aprovechar perfiles de **Exportación Estática Completa (SSG)** o un **Modo Gestionado** con base de datos y autenticación según tus necesidades.

## ✨ Características Clave

- **Modo Público (Zero-DB)**: Despliega un portal abierto sin dependencias de base de datos ni login.
- **Modo Gestionado**: Protege tus documentos con **Better-Auth**, Grupos de Usuario y Panel de Control.
- **Administración Dinámica**: Organiza tus contenidos con **Drag & Drop** y utiliza el **Omni Assistant** como guía técnica integral.
- **Visualización Avanzada**: Biblioteca integrada de componentes interactivos con **Mafs, KaTeX, P5.js y Diagramas X6**.

## Secciones Principales

### 🚀 Fundamentos
Aprende los conceptos básicos, cómo configurar el `ENABLE_AUTH_DB` y cómo organizar tus carpetas en 3 niveles.
[Ir a Arquitectura y Estructura](./01-fundamentos/02-organizacion/estructura)

### ⚙️ Administración
Domina el Dashboard, el sistema de Drag & Drop y el uso del Omni Assistant.
[Guía de Administración](./04-administracion)

### 🧱 Componentes y Matemáticas 
Explora nuestra exclusiva biblioteca de componentes interactivos y visualizaciones técnicas.
[Ver Visualizaciones](./02-componentes/04-visualizacion/mafs-katex)

## Empezando

Si eres nuevo, te recomendamos seguir nuestro [Tutorial de Despliegue](/03-tutorial/distribucion-despliegue) para configurar tu sitio con Docker o Vercel. Si prefieres un portal abierto al mundo, configura el modo público en las [Variables de Entorno](/01-fundamentos/03-configuracion/variables-de-entorno).

---

> [!TIP]
> Puedes editar este archivo principal en `docs/index.md` para personalizar tu página de inicio con los componentes React que prefieras.

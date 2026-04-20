---
title: Panel de Administración
description: Guía completa sobre el uso del Dashboard de FusionDoc, gestión de archivos y herramientas de asistencia.
order: 4
icon: 'lucide:settings-2'
---

# Panel de Administración

El Dashboard de **FusionDoc** es un centro de control profesional diseñado para agilizar la creación y organización de documentación técnica sin salir del navegador.

## 🚀 Acceso y Seguridad

El panel es accesible a través de la ruta `/dashboard`.
- **Autenticación**: Impulsada por **Better-Auth** con soporte para Google OAuth.
- **Modo Gestionado**: Estas funciones solo están disponibles si `ENABLE_AUTH_DB="true"` está configurado en tu archivo `.env`.

---

## 📚 Omni Assistant: Tu Guía Técnica

Dentro del editor de documentos, encontrarás el botón **"Asistente"**. Este panel centraliza todo el conocimiento técnico del proyecto:

1.  **Guía de Estructura**: Tutorial interactivo sobre los 3 niveles de navegación.
2.  **Diccionario de Frontmatter**: Lista completa de campos (`title`, `icon`, `order`, etc.) con ejemplos listos para usar.
3.  **Biblioteca de Componentes**: Catálogo de todos los componentes MDX disponibles con previsualización técnica y códigos de inserción rápida.

---

## 🖱️ Organización Interactiva (Drag & Drop)

El explorador de archivos soporta manipulación directa para reorganizar el árbol de navegación:

- **Mover Archivos**: Simplemente arrastra un archivo y suéltalo dentro de otra carpeta. El sistema actualizará automáticamente el repositorio en GitHub.
- **Feedback Visual**: Las carpetas se resaltarán en violeta cuando pases un archivo sobre ellas, indicando que son destinos válidos.
- **Sincronización Atómica**: Cada movimiento es una operación segura que revalida automáticamente el sitio público.

---

## ✍️ Editor MDX Avanzado

El editor está basado en **Monaco** (el motor de VS Code) y ofrece:
- **Resaltado de Sintaxis**: Soporte completo para MDX, código embebido y Frontmatter.
- **Vista Previa en Tiempo Real**: Visualiza cómo se verá el componente final (Alertas, Terminales, Mafs) mientras escribes.
- **Barra de Formato Dinámica**: Acceso rápido a estilos de texto, listas y bloques de código.

---

> [!IMPORTANT]
> **Sincronización con GitHub**: Todas las acciones realizadas en el panel (crear, renombrar, mover o borrar) se ejecutan directamente sobre la API de GitHub utilizando tu `GITHUB_TOKEN`. Asegúrate de que el token tenga permisos de escritura (`repo`).

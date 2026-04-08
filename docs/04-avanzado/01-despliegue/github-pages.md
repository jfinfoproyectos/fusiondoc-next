---
title: GitHub Pages
description: Despliegue continuo con GitHub Actions.
order: 1
icon: 'mdi:github'
---

# Despliegue en GitHub Pages

FusionDoc está listo para publicarse en GitHub Pages de forma gratuita. 

## Pasos para el despliegue
1. Configura `output: 'export'` en tu `next.config.ts`.
2. Crea un workflow de GitHub Actions en `.github/workflows/deploy.yml`.
3. Activa los permisos de escritura en la configuración del repositorio.

> [!NOTE]
> No olvides configurar el `basePath` si tu repositorio no está en la raíz del dominio.

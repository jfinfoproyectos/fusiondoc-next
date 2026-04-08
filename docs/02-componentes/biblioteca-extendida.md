---
title: Biblioteca Extendida
description: Descubre los nuevos componentes premium añadidos a FusionDoc para una documentación de siguiente nivel.
icon: 'lucide:box'
order: 8
---

# Biblioteca Extendida

Hemos añadido 6 nuevos componentes diseñados para transformar cómo presentas información técnica y visual en tus documentos.

## 1. FileTree (Árbol de Archivos)
Visualiza la estructura de tu proyecto de forma interactiva. Soporta iconos automáticos por extensión.

<FileTree>
  <Folder name="src" defaultOpen={true}>
    <Folder name="components">
      <File name="Header.tsx" label="Componente Principal" />
      <File name="Sidebar.tsx" />
    </Folder>
    <File name="App.tsx" />
    <File name="globals.css" />
  </Folder>
  <File name="package.json" label="Dependencias" />
</FileTree>

## 2. PropertyTable (Tabla de API)
Tablas especializadas para documentar props, configuraciones o parámetros de API. Identifica tipos de datos automáticamente.

<PropertyTable items={[
  { name: 'url', type: 'string', required: true, description: 'La URL del repositorio de GitHub.' },
  { name: 'stars', type: 'number', default: '0', description: 'Número de estrellas a mostrar.' },
  { name: 'showLanguage', type: 'boolean', default: 'true', description: 'Si se debe mostrar el lenguaje principal.' }
]} />

## 3. BentoGrid (Cuadrícula de Características)
Un layout moderno para presentar características o servicios de forma visualmente atractiva.

<BentoGrid>
  <BentoCard 
    title="Rendimiento Extreme" 
    description="Optimizado con Next.js 16 para cargas instantáneas." 
    icon={<icon icon="lucide:zap" />}
    className="md:col-span-2"
  />
  <BentoCard 
    title="Seguridad" 
    description="Validación completa." 
    icon={<icon icon="lucide:shield" />}
  />
</BentoGrid>

## 4. Timeline (Línea de Tiempo)
Ideal para historiales de versiones, hojas de ruta o registros de cambios.

<Timeline>
  <TimelineItem title="Versión 1.2.0" date="Abrid 2026" variant="success">
    Añadimos soporte para componentes interactivos premium y mejoras en el buscador.
  </TimelineItem>
  <TimelineItem title="Beta Pública" date="Marzo 2026">
    Lanzamiento inicial de la plataforma FusionDoc.
  </TimelineItem>
</Timeline>

## 5. Badge (Etiquetas de Estado)
Etiquetas compactas con estilo "Glassmorphism" para marcar estados.

<div className="flex gap-2 flex-wrap my-4">
  <Badge variant="purple">Nuevo</Badge>
  <Badge variant="success">Estable</Badge>
  <Badge variant="info">Beta</Badge>
  <Badge variant="warning">Experimental</Badge>
  <Badge variant="error">Depreciado</Badge>
</div>


> [!TIP]
> Todos estos componentes han sido registrados con **alias en minúsculas** (`filetree`, `badge`, `props`, etc.) para que puedas usarlos de forma más rápida en tus archivos Markdown.

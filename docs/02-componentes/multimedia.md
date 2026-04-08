---
title: Multimedia (Video/Audio)
description: Cómo incrustar videos de YouTube, Vimeo y audio local en tu documentación.
icon: 'lucide:film'
order: 6
---

# Multimedia

FusionDoc proporciona componentes fáciles de usar para integrar contenido de video y audio.

## Video

El componente `<Video />` detecta automáticamente si estás usando una URL de YouTube, Vimeo o un archivo local.

### YouTube
Simplemente pega la URL del video.

<Video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />

### Vimeo
Igual que con YouTube.

<Video src="https://vimeo.com/76979871" />

## Audio

El componente `<Audio />` es un reproductor de audio con estilo personalizado que se integra perfectamente con el tema.

<Audio 
  src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
  title="Ejemplo de Audio" 
/>

## Uso en MDX

### Sintaxis de Video
````mdx
<Video src="URL_DEL_VIDEO" />
````

### Sintaxis de Audio
````mdx
<Audio src="URL_DEL_AUDIO" title="Título Opcional" />
````

> [!TIP]
> Puedes usar archivos multimedia locales guardándolos en la carpeta `public/` y referenciándolas como `/videos/tutorial.mp4` o `/audio/demo.mp3`.

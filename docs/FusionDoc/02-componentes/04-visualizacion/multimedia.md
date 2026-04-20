---
title: Multimedia
description: Componentes para incrustar Video (YouTube, Vimeo, Local) y Audio de forma elegante y responsiva.
icon: 'lucide:play-circle'
order: 3
---

# Multimedia

FusionDoc ofrece componentes estandarizados para manejar archivos multimedia sin romper la estética de la documentación.

## Video

El componente `<Video />` detecta automáticamente si el origen es una plataforma externa o un archivo local.

### YouTube / Vimeo
Simplemente pega el enlace del video.

```jsx
<Video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />
```

<Video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />

### Archivos Locales
Para archivos `.mp4` o `.webm`, puedes añadir un poster y configurar el autoplay.

```jsx
<Video 
  src="/videos/demo.mp4" 
  poster="/images/poster.jpg"
  autoplay={false}
  loop={true}
/>
```

---

## Audio

El componente `<Audio />` es ideal para podcasts, explicaciones por voz o ejemplos sonoros.

```jsx
<Audio 
  src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
  title="Podcast: Introducción a la IA"
/>
```

<Audio 
  src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
  title="Podcast: Introducción a la IA"
/>

---

## Propiedades

### Video
| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `src` | `string` | **Requerido** | URL del video (YT, Vimeo o local). |
| `type` | `"youtube" \| "vimeo" \| "local"` | `"local"` | Tipo de origen (detección automática). |
| `poster` | `string` | - | Imagen de previsualización para videos locales. |
| `autoplay` | `boolean` | `false` | Iniciar reproducción automáticamente. |
| `loop` | `boolean` | `false` | Repetir video infinitamente. |

### Audio
| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `src` | `string` | **Requerido** | URL del archivo de audio. |
| `title` | `string` | - | Título descriptivo para el reproductor. |

> [!CAUTION]
> Ten cuidado con el uso de `autoplay` en video y audio, ya que muchos navegadores bloquean el sonido de forma predeterminada si no hay interacción del usuario.

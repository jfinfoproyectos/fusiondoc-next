# Multimedia (Video y Audio)

FusionDoc proporciona contenedores premium para integrar contenido multimedia sin romper la estética del sitio. Los componentes `<Video />` y `<Audio />` están optimizados para carga rápida y visualización fluida.

## Video

El componente de video es inteligente. Puede detectar automáticamente si la URL es de **YouTube**, **Vimeo** o un **archivo local** (mp4, webm).

### Video de YouTube

Solo pega el enlace y el componente se encargará de crear el `iframe` seguro y responsive.

<Video src="https://www.youtube.com/watch?v=dQw4w9WgXcQ" />

### Video Local con Controles

Puedes subir tus propios clips y servirlos directamente.

<Video 
  src="/videos/demo-feature.mp4" 
  autoplay={false} 
  loop={true} 
/>

### Referencia de Props (Video)

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `src` | `string` | **Requerido**. URL del video (Local, YouTube o Vimeo). |
| `type` | `select` | `local` \| `youtube` \| `vimeo`. Auto-detectado si se omite. |
| `poster` | `string` | Imagen de portada para videos locales. |
| `autoplay`| `boolean` | Inicia el video automáticamente (silenciado). |
| `loop` | `boolean` | Reinicia el video automáticamente al finalizar. |

---

## Audio

El componente `<Audio />` ofrece una barra de reproducción minimalista y elegante para podcasts, demos de voz o efectos de sonido.

### Ejemplo de Audio

<Audio 
  src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" 
  title="Entrevista con el Desarrollador Principal"
/>

### Referencia de Props (Audio)

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `src` | `string` | **Requerido**. URL del archivo de audio (mp3, wav). |
| `title` | `string` | Título que aparecerá sobre la barra de reproducción. |

---

<Alert variant="warning">
  **Importante:** Para videos locales, asegúrate de que el servidor tenga configurados los encabezados de rango (Range Headers) para permitir el scroll temporal (seeking) correctamente.
</Alert>

# Repositorios GitHub

El componente `<GithubRepo />` permite integrar tarjetas elegantes y dinámicas que muestran información en tiempo real (o prefijada) de repositorios de GitHub. Es ideal para documentar dependencias, proyectos relacionados o dar crédito a herramientas de código abierto.

## Características
- **Detección Automática**: Intenta extraer el nombre del repo de la URL si no se provee un título.
- **Micro-interacciones**: Efectos de elevación y resaltado al pasar el cursor.
- **Estadísticas**: Visualización de estrellas, forks y lenguaje principal.
- **Optimización**: Permite definir valores constantes de estrellas/forks para evitar límites de API de GitHub en entornos de CI/CD.

## Ejemplo Básico

Muestra un repositorio usando solo la URL. El componente intentará inferir el resto.

<GithubRepo url="https://github.com/facebook/react" />

## Ejemplo Personalizado

Puedes personalizar el título, la descripción y forzar las métricas para un control total del diseño.

<GithubRepo 
  url="https://github.com/lucide-react/lucide" 
  title="Lucide Icons"
  description="Hermosos y consistentes iconos SVG para React, Vue y Svelte."
  stars="45k"
  forks="1.2k"
/>

## Referencia de Props

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `url` | `string` | **Requerido**. Enlace completo al repositorio de GitHub. |
| `title` | `string` | Título personalizado. Si se omite, se usa `usuario/repo`. |
| `description` | `string` | Breve descripción del proyecto. |
| `stars` | `string \| number` | Cantidad de estrellas a mostrar (útil para caché). |
| `forks` | `string \| number` | Cantidad de forks a mostrar. |
| `language` | `string` | Nombre del lenguaje (default: `TypeScript`). |
| `languageColor` | `string` | Color hexadecimal para el indicador de lenguaje. |

---

<Alert variant="info">
  **Tip:** Si estás desplegando tu documentación como sitio estático, te recomendamos pasar las `stars` y `forks` como props fijas para asegurar que el diseño sea consistente sin depender de llamadas externas en tiempo de ejecución.
</Alert>

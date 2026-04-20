---
title: Guía de Uso
description: Guía completa sobre cómo integrar y usar íconos de Iconify en FusionDoc.
order: 1
icon: 'lucide:file-text'
---

# Sistema de Íconos (Iconify)

<Hero
  title="Más de 200,000 íconos"
  subtitle="A diferencia de las librerías tradicionales que inflan el peso de tu página, FusionDoc utiliza un motor Iconify asíncrono para descargar bajo demanda vectores de Material Design, Tabler, Lucide y cientos de colecciones más."
/>

Usar un ícono en FusionDoc es tan sencillo como conocer su código identificador o _identificador corto de colección_.

## 🔍 Entendiendo el formato

Cualquier ícono en Iconify se llama usando una convención de texto estricta separada por dos puntos:

`coleccion` **:** `nombre-icono`

### ¿Dónde encuentro qué código utilizar?
Debes navegar al mega buscador gratuito de Iconify:  
👉 **[[Explorar Íconos en Iconify / Icônes]](https://icones.js.org/)**

Allí podrás escribir cualquier cosa (como *React*, *Settings*, *Arrow*, etc.), seleccionar el ícono exacto que te gusta y copiar su nombre.

Algunos ejemplos comunes:
*   `mdi:github` (De la colección Material Design Icons)
*   `logos:npm-icon` (De la colección de Logos SVG)
*   `lucide:check-circle` (De la famosa colección Lucide)
*   `solar:bomb-bold` (De Solar Icons)

---

## 🛠️ Dónde utilizarlos en FusionDoc

Tu proyecto ya tiene Iconify nativamente configurado. Existen varias secciones de la documentación donde puedes pasar un ícono simplemente escribiendo un string en su propiedad.

### 1. Variables de Entorno (Redes Sociales)
Como se definió en las configuraciones iniciales, los accesos directos sociales del `<Header>` se inyectan a partir de un JSON. Fíjate cómo la clave `"icon"` utiliza la nomenclatura pura de Iconify.

```json
[
  {
    "name": "GitHub",
    "url": "https://github.com/",
    "icon": "mdi:github"
  },
  {
    "name": "Comunidad",
    "url": "https://discord.com",
    "icon": "logos:discord-icon"
  }
]
```

### 2. Pestañas de Código Interactivas (`<CodeTabs>`)

El caso de uso más extendido y visualmente atractivo en tus archivos Markdown son los `CodeTabs`.  Al documentar ejemplos multilingüísticos, añadir íconos mejora masivamente el escaneo visual del desarrollador.

Para incluir un ícono representativo al lado del nombre de tu pestaña, usa la propiedad `icon` en la etiqueta `<CodeTab>`:

````mdx
<CodeTabs>

  <CodeTab title="npm" icon="logos:npm-icon">
    ```bash
    npm install fusiondoc
    ```
  </CodeTab>
  
  <CodeTab title="Yarn" icon="logos:yarn">
    ```bash
    yarn add fusiondoc
    ```
  </CodeTab>

</CodeTabs>
````

#### Ejemplos para entornos populares
Te dejamos atajos y strings de los logos más usados en programación, listos para copiar y pegar en tus pestañas:
- **NPM:** `logos:npm-icon`
- **Yarn:** `logos:yarn`
- **TypeScript:** `logos:typescript-icon`
- **JavaScript:** `logos:javascript`
- **Python:** `logos:python`
- **React:** `logos:react`
- **Go:** `logos:go`

### 3. Íconos integrados en Texto MDX (`<Icon>`)

Además del frontmatter o props, FusionDoc te permite inyectar **íconos en línea** en medio de cualquier párrafo o título MDX gracias al componente personalizado `<Icon>`. Puede recibir color, tamaño y clases personalizadas de Tailwind CSS.

**Ejemplo de uso:**
```mdx
¿Sabías que puedes poner un ícono de advertencia <Icon name="lucide:alert-triangle" color="orange" /> directo en el texto? O uno animado <Icon name="lucide:loader" className="animate-spin text-blue-500" /> para estados de carga.
```

<Icon name="lucide:loader" className="animate-spin text-blue-500" />

**Propiedades soportadas en `<Icon />`:**
*   `name`: (Obligatorio) El string con la nomenclatura `coleccion:nombre`.
*   `size`: (Opcional) Un número que define los px de ancho y alto (Por defecto es 24).
*   `color`: (Opcional) Código CSS válido (`#ff0000`, `orange`, etc.). Alternativamente puedes usar `className="text-red-500"` de Tailwind.
*   `className`: (Opcional) Clases extra de Tailwind para alinear, marginar o animar.

---

> [!TIP]
> **Compatibilidad:**
> Dado que Iconify carga la data del SVG en caliente de modo asíncrono, no necesitas instalar nada manualmente al importar una marca nueva. ¡Pon el string y el sistema se encargará el resto!

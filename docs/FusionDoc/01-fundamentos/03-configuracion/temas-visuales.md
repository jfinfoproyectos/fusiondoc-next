---
title: Temas Visuales
description: Guía sobre cómo personalizar la estética de FusionDoc mediante el sistema de temas dinámicos.
order: 3
icon: 'lucide:palette'
---

# Sistema de Temas Dinámicos

FusionDoc cuenta con un motor de personalización visual que permite alternar entre diferentes esquemas de colores y estéticas de forma instantánea. A diferencia de las configuraciones estáticas, nuestro sistema escanea y carga temas dinámicamente desde el código fuente.

## 🌈 ¿Cómo funcionan los temas?

El sistema se apoya en tres pilares:

1.  **Directorio de Temas:** Todos los archivos `.css` dentro de `src/app/themes/` son detectados automáticamente por la acción del servidor `getAvailableThemes`.
2.  **Variables CSS (Tokens):** Cada archivo de tema debe sobrescribir un conjunto estándar de variables de Tailwind CSS (v4) integradas bajo el selector `:root`.
3.  **Selector de Usuario:** El componente `ThemeSelector` en la barra lateral permite al usuario final previsualizar y aplicar estos temas, persistiendo la selección mediante cookies.

---

## 🛠️ Crear un Tema Personalizado

Para añadir un nuevo estilo visual a tu documentación, solo necesitas seguir estos dos pasos:

### 1. Crear el archivo CSS
Crea un archivo con el nombre de tu tema en `src/app/themes/mi-nuevo-tema.css`. 

### 2. Definir las variables base
Como mínimo, tu tema debe definir la variable `--primary` para que el sistema pueda identificar su color representativo en el selector.

```css
:root {
  /* Color de acento principal (usado en links, botones y bordes) */
  --primary: hsl(210 100% 50%);
  --primary-foreground: hsl(0 0% 100%);

  /* Fondo y texto general */
  --background: hsl(210 20% 98%);
  --foreground: hsl(210 10% 10%);

  /* Otros tokens opcionales */
  --card: hsl(0 0% 100%);
  --border: hsl(210 15% 90%);
  --radius: 0.75rem;
}

/* Soporte para Modo Oscuro en el mismo archivo */
.dark {
  --background: hsl(210 20% 5%);
  --foreground: hsl(210 10% 95%);
  --primary: hsl(210 100% 60%);
  --border: hsl(210 15% 15%);
}
```

---

## 🖼️ Lista de Temas Disponibles

### Temas Visuales
Estos temas modifican la interfaz de usuario completa. Puedes forzar uno de estos usando `DEFAULT_THEME` en tu `.env.local`.

- `caffeine`
- `claude`
- `clean-slate`
- `corporate`
- `cyberpunk`
- `elegant-luxury`
- `marshmallow`
- `nature`
- `notebook`
- `ocean-breeze`
- `perplexity`
- `slack`
- `summer`
- `supabase`
- `vs-code`

### Temas de Código (Resaltado Shiki)
Estos afectan únicamente a los bloques de código. Puedes forzar uno de estos usando `DEFAULT_CODE_THEME`.

- `github-dark`
- `github-light`
- `nord`
- `dracula`
- `monokai`
- `vesper`
- `rose-pine`
- `one-dark-pro`
- `min-dark`
- `min-light`

---

## 🔒 Bloqueo de Temas (Modo Administrador)

Si deseas que tu documentación tenga una identidad visual fija y que los usuarios no puedan cambiarla, puedes configurar "Temas por Defecto". 

Al definir estas variables, los selectores correspondientes **desaparecerán de la interfaz**, forzando la estética elegida:

- `DEFAULT_THEME`: Elige el nombre técnico del tema visual (ej. `cyberpunk`).
- `DEFAULT_CODE_THEME`: Elige el ID del tema de Shiki (ej. `dracula`).

> [!NOTE]
> Al añadir un nuevo archivo `.css` a la carpeta de temas, el sistema le asignará un nombre legible automáticamente (ej: `midnight-blue.css` se convertirá en `Midnight Blue`).

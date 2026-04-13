---
title: LaTeX y KaTeX
description: Componentes dedicados para renderizar expresiones matemáticas utilizando tipografía LaTeX en tu documentación.
icon: 'lucide:binary'
order: 15
---

# Fórmulas y Matemáticas en texto plano

La plataforma incluye soporte completo y de alta eficiencia para renderizar expresiones matemáticas mediante **KaTeX**. A diferencia de las previsualizaciones pesadas en imágenes, KaTeX renderiza todo como HTML/CSS optimizado para máxima nitidez y accesibilidad.

Puedes utilizar estos componentes en cualquier archivo `.mdx` usando `<Latex>` o `<MathInline>`.

---

## 📐 Matemáticas en formato de Tarjeta (Bloque)

Para fórmulas principales que deben resaltar, utiliza `<Latex>` con la propiedad `math`.

<Latex title="Teorema de Pitágoras" math="a^2 + b^2 = c^2" />

También puedes usar funciones polinómicas complejas y fracciones. Ten en cuenta de usar el soporte estándar de lenguaje de KaTeX:

<Latex title="Fórmula Cuadrática" math="x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}" />

### Código

```mdx
<Latex title="Fórmula Cuadrática" math="x = \frac{-b \pm \sqrt{b^2-4ac}}{2a}" />
```

*(Opcional)*: Puedes prescindir del `title`:

```mdx
<Latex math="\int_a^b f(x)dx = F(b) - F(a)" />
```

---

## 🔤 Matemática en Línea (In-line text)

Añade variables o símbolos algebraicos dentro de tus explicaciones. Para evitar advertencias del navegador, utiliza siempre nombres en **PascalCase** como `<MathInline />`.

Por ejemplo, aquí indicamos la equivalencia masiva: <MathInline math="E = mc^2" />. Y aquí incluimos derivadas locales: <MathInline math="\frac{\partial f}{\partial x}" /> directamente escritas dentro del texto!

### Código

```mdx
Aquí indicamos la equivalencia masiva: <MathInline math="E = mc^2" />. Y aquí incluimos derivadas locales: <MathInline math="\frac{\partial f}{\partial x}" /> directamente escritas dentro del texto.
```

> [!IMPORTANT]
> **Nota sobre sintaxis**: MDX requiere que los componentes personalizados comiencen con **letra mayúscula** (PascalCase) para no confundirlos con etiquetas HTML nativas. Usa siempre `<Latex />` o `<MathInline />`. 

> [!TIP]
> Dado que MDX interpreta las llaves `{` y `}` como variables de JavaScript, la forma más segura de incluir LaTeX en FusionDoc es mediante la propiedad `math="..."`. Esto evita cualquier error de sintaxis y renderiza tu fórmula limpiamente.



---
title: Explicador de Código (CodeExplainer)
description: Un componente interactivo para desglosar y explicar bloques de código paso a paso mediante resaltado dinámico.
icon: mdi:code-tags-check
---

El componente `CodeExplainer` permite presentar fragmentos de código de manera interactiva. Muestra el código en el panel izquierdo y una serie de explicaciones paso a paso en el panel derecho. A medida que el usuario navega por las explicaciones, las líneas de código relevantes se resaltan automáticamente.

Ahora también soporta **múltiples archivos mediante pestañas**, permitiendo explicar sistemas de archivos completos en un solo componente.

## Ejemplo de un solo archivo

Aquí tienes un ejemplo de cómo se usa el componente interactivo para explicar un hook personalizado en React:

<CodeExplainer>

```javascript
import { useState, useEffect } from 'react';

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    
    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
}
```

<CodeExplainerStep lines="3">
  **Declaración del Hook:** Comenzamos definiendo nuestro hook personalizado llamado `useWindowSize`.
</CodeExplainerStep>

<CodeExplainerStep lines="4-7">
  **Estado Inicial:** Utilizamos `useState` para guardar las dimensiones de la ventana. Inicializamos en `undefined` para evitar errores durante la hidratación rápida en frameworks como Next.js (SSR).
</CodeExplainerStep>

<CodeExplainerStep lines="9,21">
  **Efecto Secundario:** Usamos `useEffect` para enlazar la lógica al ciclo de vida del componente una vez que este se monta.
</CodeExplainerStep>

<CodeExplainerStep lines="23">
  **Retorno:** Finalmente devolvemos el estado con las dimensiones calculadas para que cualquier componente pueda aprovecharlas.
</CodeExplainerStep>

</CodeExplainer>

## Ejemplo Multi-archivo Completo

A continuación, un ejemplo que desglosa un componente de tarjeta interactiva compuesto por tres archivos relacionados:

<CodeExplainer>
  <CodeExplainerFile title="Card.jsx">
    ```jsx
    import React from 'react';
    import './Card.css';

    export const Card = ({ title, category, image }) => {
      return (
        <div className="card-container">
          <div className="card-image">
            <img src={image} alt={title} />
            <span className="card-badge">{category}</span>
          </div>
          <div className="card-content">
            <h3>{title}</h3>
            <button className="card-btn">Ver más</button>
          </div>
        </div>
      );
    };
    ```
    <CodeExplainerStep lines="1-2">
      **Importaciones:** Cargamos los módulos básicos de React y el archivo de estilos local.
    </CodeExplainerStep>
    <CodeExplainerStep lines="4">
      **Parámetros (Props):** Desestructuramos las propiedades necesarias para alimentar la tarjeta dinámicamente.
    </CodeExplainerStep>
    <CodeExplainerStep lines="7-11">
      **Layout de Imagen:** Definimos el contenedor de la imagen junto con una etiqueta de categoría superpuesta.
    </CodeExplainerStep>
    <CodeExplainerStep lines="13-14">
      **Detalles:** Renderizamos el encabezado y el botón de acción principal del componente.
    </CodeExplainerStep>
  </CodeExplainerFile>

  <CodeExplainerFile title="Card.css">
    ```css
    .card-container {
      border-radius: 12px;
      overflow: hidden;
      background: #1a1a1a;
      transition: transform 0.3s ease;
    }

    .card-container:hover {
      transform: translateY(-8px);
    }

    .card-image img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }

    .card-badge {
      position: absolute;
      top: 1rem;
      background: var(--primary);
    }
    ```
    <CodeExplainerStep lines="1-6">
      **Estructura Base:** Definimos el radio de borde y la transición para animaciones suaves.
    </CodeExplainerStep>
    <CodeExplainerStep lines="8-10">
      **Interacción:** Agregamos una elevación visual (`translateY`) al interactuar con la tarjeta.
    </CodeExplainerStep>
    <CodeExplainerStep lines="12-16">
      **Control de Imagen:** Aseguramos que la imagen ocupe todo el ancho y mantenga su proporción.
    </CodeExplainerStep>
    <CodeExplainerStep lines="18-22">
      **Etiquetas Dinámicas:** Posicionamos el "badge" de forma absoluta usando el color primario del tema.
    </CodeExplainerStep>
  </CodeExplainerFile>

  <CodeExplainerFile title="App.jsx">
    ```jsx
    import { Card } from './Card';

    export default function App() {
      return (
        <div className="page-wrapper">
          <nav className="navbar">Nav</nav>
          <div className="grid">
            <Card 
              title="Producto A" 
              category="Tech"
              image="/a.jpg"
            />
          </div>
          <footer className="footer" />
        </div>
      );
    }
    ```
    <CodeExplainerStep lines="1">
      **Registro:** Importamos el componente `Card` para poder instanciarlo en nuestra aplicación.
    </CodeExplainerStep>
    <CodeExplainerStep lines="5-6">
      **Contenedores:** Envolvemos el contenido en un wrapper principal y añadimos una navegación básica.
    </CodeExplainerStep>
    <CodeExplainerStep lines="8-12">
      **Componente Vivo:** Pasamos la metadata específica (título, categoría, ruta de imagen) a la tarjeta.
    </CodeExplainerStep>
    <CodeExplainerStep lines="14">
      **Cierre:** Incluimos un pie de página para completar la estructura visual de la página.
    </CodeExplainerStep>
  </CodeExplainerFile>
</CodeExplainer>

## Uso en MDX

### Un solo archivo (Modo Legacy)
Simplemente envuelve el bloque de código y los pasos:

````mdx
<CodeExplainer>
  ```javascript
  function hello() { console.log("world"); }
  ```
  <CodeExplainerStep lines="1">Explicación</CodeExplainerStep>
</CodeExplainer>
````

### Múltiples archivos
Usa etiquetas `<CodeExplainerFile>` para cada pestaña:

````mdx
<CodeExplainer>
  <CodeExplainerFile title="index.js">
    ```javascript
    console.log("File 1");
    ```
    <CodeExplainerStep lines="1">Paso archivo 1</CodeExplainerStep>
  </CodeExplainerFile>

  <CodeExplainerFile title="utils.js">
    ```javascript
    console.log("File 2");
    ```
    <CodeExplainerStep lines="1">Paso archivo 2</CodeExplainerStep>
  </CodeExplainerFile>
</CodeExplainer>
````

## Propiedades

### CodeExplainerFile
| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `title` | `string` | El nombre que aparecerá en la pestaña del archivo. |

### CodeExplainerStep
| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `lines` | `string` | Define las filas a resaltar (Ej. `"1"`, `"2-5"`, `"1,4,7-9"`). |

## Mejores Prácticas

- **Consistencia:** Si usas multi-archivo, intenta que todos los archivos tengan al menos un paso explicativo.
- **Títulos cortos:** Mantén los títulos de los archivos breves para que las pestañas quepan bien en pantallas móviles.
- **Navegación:** Recuerda que el progreso se guarda por archivo; si el usuario vuelve a una pestaña, estará en el paso donde lo dejó.


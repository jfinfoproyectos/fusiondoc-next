# Código y Pestañas (Tabs)

La presentación del código es el corazón de cualquier documentación técnica. FusionDoc utiliza un sistema avanzado de resaltado sintáctico combinado con `<CodeTabs />` para ofrecer una experiencia de lectura fluida, permitiendo a los desarrolladores alternar entre lenguajes, configuraciones o capas de abstracción sin perder el contexto.

## Características
- **Sincronización Sintáctica**: Integración nativa con `rehype-pretty-code` para un resaltado de alta fidelidad.
- **Botón de Copiado Inteligente**: Cada bloque incluye un botón de copiado rápido con feedback visual.
- **Soporte Multi-Icono**: Identificación visual inmediata mediante iconos de tecnología en cada pestaña.
- **Nesting de Bloques**: Soporta múltiples bloques de código, texto o alertas dentro de cada pestaña.

---

## Diseños de Alto Nivel

### 1. Stack Multi-Lenguaje (Clásico)
Ideal para SDKs o liberías que ofrecen soporte nativo en múltiples ecosistemas.

<CodeTabs>
  <CodeTab title="JavaScript" icon="vscode-icons:file-type-js-official">
    ```js
    // Cliente nativo en JS
    const client = new FusionClient({
      apiKey: process.env.API_KEY
    });
    
    await client.connect();
    ```
  </CodeTab>
  <CodeTab title="Python" icon="vscode-icons:file-type-python">
    ```python
    # Cliente nativo en Python
    client = FusionClient(
        api_key=os.getenv('API_KEY')
    )
    
    client.connect()
    ```
  </CodeTab>
  <CodeTab title="Go" icon="vscode-icons:file-type-go">
    ```go
    // Cliente nativo en Go
    client, err := fusion.NewClient(
        fusion.WithAPIKey(os.Getenv("API_KEY")),
    )
    
    err = client.Connect()
    ```
  </CodeTab>
</CodeTabs>

### 2. Comparativa de Configuración
Utiliza pestañas para mostrar cómo cambia un archivo de configuración según el entorno.

<CodeTabs>
  <CodeTab title="Desarrollo (Local)" icon="vscode-icons:file-type-env">
    ```bash
    DATABASE_URL="postgresql://localhost:5432/db"
    DEBUG=true
    LOG_LEVEL="debug"
    ```
  </CodeTab>
  <CodeTab title="Producción (Cloud)" icon="vscode-icons:file-type-env">
    ```bash
    DATABASE_URL="postgresql://db.prod.internal:5432/main"
    DEBUG=false
    LOG_LEVEL="error"
    ```
  </CodeTab>
</CodeTabs>

### 3. Lógica vs Estilo (Arquitectura)
Muestra la separación de conceptos entre el código funcional y la capa visual.

<CodeTabs>
  <CodeTab title="Logica (React)" icon="vscode-icons:file-type-reactts">
    ```tsx
    export function Button({ label }) {
      return <button className="btn-primary">{label}</button>
    }
    ```
  </CodeTab>
  <CodeTab title="Estilos (CSS)" icon="vscode-icons:file-type-css">
    ```css
    .btn-primary {
      @apply bg-blue-600 px-4 py-2 rounded-xl text-white;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    ```
  </CodeTab>
</CodeTabs>

---

## Referencia de API

### `<CodeTabs />`
Contenedor principal que gestiona el estado de las pestañas.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | - | Lista de componentes `<CodeTab />`. |

### `<CodeTab />`
Una pestaña individual de contenido.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Sí** | El nombre que aparecerá en la pestaña. |
| `icon` | `string` | - | Identificador de Iconify (ej: `vscode-icons:file-type-js`). |
| `value` | `string` | - | ID único (se genera del título si se omite). |

> [!IMPORTANT]
> FusionDoc utiliza **Rehype-Pretty-Code** para el renderizado. Esto significa que puedes usar anotaciones de resaltado de líneas como \`{1-3}\` o \`// [!code focus]\` dentro de los bloques de código contenidos en las pestañas.

# Terminal Interactiva (Terminal)

El componente `<Terminal />` es una herramienta de narrativa técnica que simula una consola real con animaciones de escritura paso a paso. Proporciona una estética de alta fidelidad con controles de ventana, múltiples tipos de shell y disparadores de animación basados en el scroll.

## Características
- **Múltiples Shells**: Soporte nativo para `bash`, `zsh`, `powershell`, `cmd`, `node` y `python` con iconos y prompts específicos.
- **Animación Inteligente**: La escritura se inicia automáticamente cuando el componente entra en el viewport del usuario.
- **Controles Premium**: Incluye botones de ventana funcionales (decorativos) y un botón de reinicio para volver a ejecutar la secuencia.
- **Feedback de Proceso**: Muestra un estado de "Proceso Finalizado" al completar la secuencia de comandos.

---

## Diseños de Alto Nivel

### 1. Despliegue FullStack (Bash)
Ideal para guías de inicio rápido que requieren clonar, instalar y ejecutar un proyecto.

<Terminal 
  title="Setup Inicial"
  shell="bash"
  staticText="Iniciando entorno de desarrollo..."
  commands="git clone https://github.com/fusiondoc/starter.git\ncd starter\nnpm install\nnpm run dev"
/>

### 2. Flujo DevOps (PowerShell)
Demuestra el uso de la terminal en entornos de infraestructura o despliegue en la nube.

<Terminal 
  title="Infraestructura Docker"
  shell="powershell"
  staticText="Levantando contenedores de base de datos..."
  commands="docker-compose up -d\ndocker ps --format 'table {{.Names}}\t{{.Status}}'\ndocker logs fusion-db"
/>

### 3. REPL Interactivo (Node.js)
Muestra cómo interactuar con lenguajes de programación directamente desde la consola.

<Terminal 
  title="Node.js Playground"
  shell="node"
  staticText="FusionDoc Runtime v1.0.0"
  commands="const doc = new FusionDoc();\ndoc.initialize();\ndoc.render('index.md');"
/>

---

## Referencia de API

### `<Terminal />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | Shell Name | Título que aparece en la barra superior del componente. |
| `shell` | `string` | `bash` | Tipo de shell: `bash`, `zsh`, `powershell`, `cmd`, `node`, `python`. |
| `commands` | `string` | - | Comandos a ejecutar. Usa `\n` para separar múltiples comandos. |
| `commandList` | `string[]` | - | Alternativa a `commands` usando un array de strings. |
| `staticText` | `string` | - | Comentario inicial que aparece en color tenue antes de los comandos. |

---

## Mejores Prácticas
- **Concisión**: No pongas listas interminables de comandos; divide los procesos largos en varias terminales o usa el componente `Steps`.
- **Contexto**: Usa `staticText` para describir qué está pasando ("Descargando activos...", "Verificando conexión...").
- **Shell Correcto**: Asegúrate de usar `powershell` si tus ejemplos son específicos de Windows para mantener la fidelidad visual.

> [!TIP]
> Puedes anidar el componente `Terminal` dentro de un `Step` para crear tutoriales técnicos ultra-profesionales que se sienten "vivos".

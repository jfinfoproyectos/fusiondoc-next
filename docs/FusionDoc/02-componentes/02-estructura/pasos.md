# Guía de Pasos (Steps)

El componente `<Steps />` es la herramienta definitiva para guiar a los usuarios a través de procesos lineales complejos. Proporciona una estructura visual conectada mediante una línea vertical dinámica y numeración automática, asegurando que el lector nunca pierda el hilo de la ejecución.

## Características
- **Numeración Automática**: Los números se calculan mediante CSS Counters, eliminando la necesidad de gestionar índices manualmente.
- **Conectividad Visual**: Una línea lateral unifica los pasos, reflejando continuidad en el proceso.
- **Nesting de Componentes**: Soporta cualquier otro componente MDX dentro de cada paso (Terminal, Alertas, Vídeos, etc.).
- **Micro-animaciones**: Cada paso entra con un sutil efecto de fade-in y slide desde la izquierda para una lectura fluida.

---

## Diseños de Alto Nivel

### 1. Onboarding del Desarrollador (Clásico)
Ideal para guías de "Primeros Pasos" que requieren comandos de terminal y explicaciones concisas.

<Steps>
  <Step title="Clonación del Repositorio">
    Obtén el código base directamente desde GitHub para comenzar a trabajar localmente.
    <Terminal title="bash" children="git clone https://github.com/tu-usuario/mi-proyecto.git" />
  </Step>
  <Step title="Configuración del Ecosistema">
    Instala las dependencias y prepara las variables de entorno necesarias para que el motor de renderizado funcione.
    ```bash
    npm install
    cp .env.example .env.local
    ```
  </Step>
  <Step title="Lanzamiento en Desarrollo">
    Inicia el servidor local y verifica que todo esté funcionando en `localhost:3000`.
    <Alert variant="success">
      ¡Felicidades! Ahora tienes una copia funcional de FusionDoc lista para editar.
    </Alert>
  </Step>
</Steps>

### 2. Protocolo de Seguridad (Complejo)
Usa pasos para detallar procesos críticos que requieren atención y advertencias constantes.

<Steps>
  <Step title="Auditoría de Acceso">
    Revisa los logs de acceso en el panel administrativo antes de realizar cualquier cambio de permisos.
  </Step>
  <Step title="Rotación de Secretos">
    Genera nuevas llaves de API. **Asegúrate de no compartir estas llaves en canales públicos.**
    <Alert variant="warning" title="Seguridad Crítica">
      Al rotar las llaves, las conexiones antiguas dejarán de funcionar inmediatamente.
    </Alert>
  </Step>
  <Step title="Verificación de Firma">
    Confirma la validez de los certificados SSL instalados en el balanceador de carga.
  </Step>
</Steps>

### 3. Workflow Multi-Etapa (Multimedia)
Demuestra cómo integrar recursos visuales dentro de una secuencia lógica.

<Steps>
  <Step title="Planificación de Layout">
    Define las zonas de contenido utilizando nuestro sistema de **Bento Grid**.
  </Step>
  <Step title="Selección de Activos">
    Elige imágenes de alta resolución. Puedes usar componentes de multimedia para previsualizarlas.
    <Alert variant="info">
      Recomendamos usar el componente `ZoomImage` para detalles técnicos.
    </Alert>
  </Step>
  <Step title="Publicación Final">
    Sube tus cambios y espera a que el sistema de CI/CD genere el sitio estático.
  </Step>
</Steps>

---

## Referencia de API

### `<Steps />`
Contenedor principal que inicializa el contador de pasos.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | - | Lista de componentes `<Step />`. |

### `<Step />`
Un hito individual dentro de la secuencia.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Sí** | El encabezado destacado del paso. |
| `children` | `ReactNode` | - | Contenido enriquecido del paso. |

> [!TIP]
> Puedes anidar el componente `Terminal` dentro de un `Step` para que los comandos de instalación se vean integrados en el proceso.

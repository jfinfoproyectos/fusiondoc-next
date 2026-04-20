# Tabla de Propiedades (PropertyTable)

El componente `<PropertyTable />` (o su alias `props`) es el estándar de FusionDoc para documentar interfaces, APIs y esquemas de configuración. A diferencia de las tablas Markdown convencionales, este componente ofrece una jerarquía visual clara, resaltado semántico de tipos y alertas visuales para campos obligatorios.

## Características
- **Identificación de Tipos**: Etiquetas de color automáticas según el lenguaje (Ej: `boolean` en verde, `number` en ámbar).
- **Indicador de Relevancia**: Las propiedades requeridas incluyen un indicador de "pulso" animado en rojo para captar la atención.
- **Micro-interacciones**: Efectos de hover que resaltan las filas para facilitar el seguimiento visual en tablas extensas.
- **Formatos Flexibles**: Soporta definiciones en formato JSON relajado (no requiere comillas en las llaves) para una edición más cómoda en MDX.

---

## Diseños de Alto Nivel

### 1. Interfaz de Componente UI (React)
Documenta las propiedades de un componente de diseño como un Botón o una Tarjeta.

<PropertyTable items="[
  {
    name: 'variant',
    type: 'primary | secondary | outline',
    default: 'primary',
    description: 'Define el estilo visual del componente según la jerarquía de la acción.'
  },
  {
    name: 'onAction',
    type: 'function',
    required: true,
    description: 'Callback ejecutado al hacer clic. Vital para la interacción del usuario.'
  },
  {
    name: 'isLoading',
    type: 'boolean',
    default: 'false',
    description: 'Muestra un spinner y deshabilita la interacción durante procesos asíncronos.'
  }
]" />

### 2. Configuración de API Gateway (Backend)
Especifica parámetros técnicos para servicios de infraestructura o middlewares.

<PropertyTable items="[
  {
    name: 'endpoint',
    type: 'string (URL)',
    required: true,
    description: 'Dirección absoluta del microservicio de autenticación.'
  },
  {
    name: 'retryPolicy',
    type: 'object',
    default: '{ attempts: 3, delay: 1000 }',
    description: 'Política de reintentos en caso de fallo de red o timeout.'
  },
  {
    name: 'enabledCache',
    type: 'boolean',
    default: 'true',
    description: 'Habilita el almacenamiento local de tokens para reducir latencia.'
  }
]" />

### 3. Variables de Entorno (Docker/K8s)
Ideal para guías de despliegue que requieren configuración de entorno.

<PropertyTable items="[
  {
    name: 'DB_STRATEGY',
    type: 'string',
    default: 'postgres',
    description: 'Motor de base de datos a utilizar en el contenedor.'
  },
  {
    name: 'PORT',
    type: 'number',
    default: '3000',
    description: 'Puerto expuesto para las peticiones externas.'
  }
]" />

---

## Referencia de API

### `<PropertyTable />`

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `items` | `string` (JSON) | **Sí** | Un arreglo serializado de objetos de propiedad. |

### Estructura de un Item

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `name` | `string` | Nombre técnico de la propiedad. |
| `type` | `string` | El tipo esperado. Se colorea automáticamente si contiene: `string`, `number`, `boolean`, `function`. |
| `required` | `boolean` | Si es `true`, muestra el "pulso" rojo animado. |
| `default` | `string` | Valor predeterminado del sistema. |
| `description`| `string` | Explicación detallada de su comportamiento. |

> [!TIP]
> El componente intentará autodetectar el tipo. Por ejemplo, cualquier tipo que incluya la palabra "boolean" se marcará automáticamente en color verde (`success`).

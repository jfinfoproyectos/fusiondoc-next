---
title: Tabla de Propiedades
description: Cómo documentar APIs, props o configuraciones de forma estructurada y visual.
icon: 'lucide:table'
order: 9
---

# Tabla de Propiedades

El componente `PropertyTable` (o su alias `props`) permite presentar información técnica de una manera clara y profesional, ideal para componentes y librerías que requieren una especificación rigurosa.

## Ejemplo de API: Auth Config

Este ejemplo muestra un esquema de configuración para un servicio de autenticación.

<PropertyTable items="[
  {
    name: 'apiKey',
    type: 'string',
    required: true,
    description: 'La clave de API pública proporcionada en el panel de control del proyecto.'
  },
  {
    name: 'sessionTimeout',
    type: 'number',
    default: '3600',
    description: 'Tiempo de expiración de la sesión en segundos. El valor por defecto es 1 hora.'
  },
  {
    name: 'multiFactor',
    type: 'boolean',
    default: 'false',
    description: 'Habilita la verificación en dos pasos (MFA) para todos los usuarios.'
  },
  {
    name: 'onLoginSuccess',
    type: 'function',
    description: 'Callback ejecutado tras un inicio de sesión exitoso. Recibe el objeto del usuario.'
  },
  {
    name: 'debugMode',
    type: 'boolean',
    default: 'false',
    description: 'Habilita logs detallados en la consola del navegador durante el desarrollo.'
  }
]" />

## Uso en MDX

Pasa un arreglo de objetos a la propiedad `items`.

```mdx
<PropertyTable items="[
  { 
    name: 'miProp', 
    type: 'string', 
    default: 'valor', 
    description: 'Explicación detallada de para qué sirve esta propiedad.', 
    required: true 
  }
]" />
```

### Propiedades del objeto Item
| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `name` | `string` | **Requerido**. El nombre de la propiedad. |
| `type` | `string` | El tipo de dato (ej: string, number, function). |
| `default` | `string` | El valor por defecto (se muestra como 'none' si falta). |
| `description`| `string` | Explicación detallada de la propiedad. |
| `required` | `boolean` | Si es true, activa el indicador visual de pulso rojo. |

> [!TIP]
> Los tipos se identifican automáticamente por palabras clave. Los tipos como `string`, `number`, `boolean` y `function` reciben estilos visuales distintivos para facilitar el escaneo rápido de la tabla.

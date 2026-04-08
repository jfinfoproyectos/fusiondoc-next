---
title: Alertas
description: >-
  Componente para resaltar información importante con diferentes niveles de
  severidad.
order: 2
icon: 'lucide:alert-triangle'
---

# Alertas

El componente `<Alert />` te permite mostrar mensajes importantes, advertencias, errores o notificaciones de éxito de manera visualmente atractiva y fácil de leer.

## Uso Básico

Puedes usar el componente pasando el contenido como hijo. Por defecto, la variante es `info`.

<Alert title="Nota Importante">
  Este es un mensaje informativo básico para el usuario.
</Alert>

```mdx
<Alert title="Nota Importante">
  Este es un mensaje informativo básico para el usuario.
</Alert>
```

## Variantes

Existen 4 variantes disponibles que cambian el esquema de color y el icono automáticamente.

### Éxito (Success)
Usa esta variante para confirmar acciones realizadas correctamente.

<Alert variant="success" title="¡Operación Exitosa!">
  Los cambios se han guardado correctamente en el servidor.
</Alert>

```mdx
<Alert variant="success" title="¡Operación Exitosa!">
  Los cambios se han guardado correctamente en el servidor.
</Alert>
```

### Advertencia (Warning)
Ideal para avisos que requieren atención pero no son necesariamente errores críticos.

<Alert variant="warning" title="Atención Requerida">
  Tu suscripción vencerá en los próximos 3 días.
</Alert>

```mdx
<Alert variant="warning" title="Atención Requerida">
  Tu suscripción vencerá en los próximos 3 días.
</Alert>
```

### Error
Úsalo para comunicar fallos críticos o errores de validación.

<Alert variant="error" title="Error de Conexión">
  No se pudo establecer conexión con la base de datos.
</Alert>

```mdx
<Alert variant="error" title="Error de Conexión">
  No se pudo establecer conexión con la base de datos.
</Alert>
```

## Propiedades

| Propiedad | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `variant` | string | `info` | El estilo visual y el icono (info, success, warning, error). |
| `title` | string | - | Un encabezado opcional para la alerta. |
| `children` | node | - | El contenido principal del mensaje. |

# Explicador de Código (CodeExplainer)

El `CodeExplainer` es el componente insignia de FusionDoc para la enseñanza técnica. Permite realizar una "autopsia" interactiva del código, desglosando lógicas complejas mediante un sistema sincronizado de resaltado de líneas y narrativa lateral paso a paso.

## Características
- **Resaltado Dinámico**: Ilumina rangos de líneas (`1-5`), líneas individuales (`8`) o selecciones dispersas (`2,15,20`) con transiciones suaves.
- **Soporte Multi-archivo**: Gestiona sistemas completos mediante pestañas integradas que mantienen su propio progreso de lectura.
- **Foco Inteligente**: El panel de código se desplaza automáticamente para centrar las líneas resaltadas en cada paso.
- **Modo Inmersivo**: Incluye un modo de pantalla completa para sesiones de estudio profundo sin distracciones.

---

## Diseños de Alto Nivel

### 1. Desglose de Lógica de Negocio (Backend)
Analiza un middleware de autenticación complejo resaltando los puntos de decisión críticos.

<CodeExplainer>

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso Denegado' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Token Inválido' });
  }
};
```

<CodeExplainerStep lines="5">
  **Extracción de Token:** Utilizamos encadenamiento opcional para obtener el Bearer Token de los encabezados de autorización de la solicitud.
</CodeExplainerStep>

<CodeExplainerStep lines="7-9">
  **Validación de Existencia:** Si el token no está presente, cortamos el flujo inmediatamente con una respuesta 401 (Unauthorized).
</CodeExplainerStep>

<CodeExplainerStep lines="11-16">
  **Verificación Criptográfica:** Usamos la librería JWT para validar la firma. Si es exitosa, inyectamos la data del usuario en el objeto `req` para los siguientes middlewares.
</CodeExplainerStep>

</CodeExplainer>

### 2. Arquitectura de Componentes (Multi-Archivo)
Explica la relación entre un componente React, sus estilos y su lógica de negocio.

<CodeExplainer>
  <CodeExplainerFile title="UserCard.tsx">
    ```tsx
    export const UserCard = ({ user }) => (
      <div className="card-glass">
        <Avatar src={user.avatar} />
        <div className="info">
          <h3>{user.name}</h3>
          <p>{user.role}</p>
        </div>
      </div>
    );
    ```
    <CodeExplainerStep lines="2,4">
      **Layout Visual:** Aplicamos la clase `card-glass` que define el efecto de desenfoque de fondo.
    </CodeExplainerStep>
  </CodeExplainerFile>

  <CodeExplainerFile title="UserCard.css">
    ```css
    .card-glass {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
    }
    ```
    <CodeExplainerStep lines="1-6">
      **Efecto Glassmorphism:** La combinación de opacidad baja y `backdrop-filter` crea la sensación de cristal esmerilado premium.
    </CodeExplainerStep>
  </CodeExplainerFile>
</CodeExplainer>

---

## Referencia de API

### `<CodeExplainer />`
Contenedor principal con diseño de dos paneles.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `children` | `ReactNode` | **Sí** | Debe incluir un bloque de código y componentes de Step/File. |

### `<CodeExplainerFile />`
Define una pestaña de archivo dentro del explicador.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `title` | `string` | **Sí** | Nombre del archivo (ej: `auth.js`). |

### `<CodeExplainerStep />`
Define un punto de explicación con resaltado de líneas.

| Propiedad | Tipo | Defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `lines` | `string` | - | Rango(s) a iluminar. Ej: `1`, `3-8`, `12,15-18`. |

---

## Mejores Prácticas
- **Nivel de Detalle**: No expliques cada línea. Agrupa líneas que formen una "unidad de lógica" lógica.
- **Micro-Copy**: Mantén las explicaciones laterales breves y directas. Si necesitas más espacio, usa listas o negritas.
- **Orden Coherente**: Asegúrate de que los pasos sigan el flujo de ejecución lógica del código, no necesariamente el orden de arriba hacia abajo.

> [!IMPORTANT]
> El resaltado de líneas en `CodeExplainer` es visualmente distinto al resaltado estático de bloques de código. Está diseñado para guiar el ojo del usuario durante la lectura interactiva.
vuelve a una pestaña, estará en el paso donde lo dejó.


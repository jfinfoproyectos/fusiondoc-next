# Alertas

El componente `Alert` es fundamental para comunicar estados, advertencias y consejos críticos de una manera que destaque del flujo normal del texto. No es solo un cuadro de color; es un ancla visual que guía al usuario en momentos clave de su navegación o configuración.

## Características
- **Identidad Visual**: Cuatro variantes semánticas (`info`, `success`, `warning`, `error`) con iconos y colores coordinados.
- **Soporte MDX Completo**: Puedes incluir listas, enlaces, código y negritas dentro de una alerta.
- **Diseño Adaptativo**: Bordes suavizados y fondos semitransparentes que se integran perfectamente tanto en modo claro como oscuro.

---

## Ejemplos de Alto Impacto

### 1. Aviso de Seguridad Proactivo
Utiliza la variante `warning` para advertir sobre configuraciones que podrían comprometer el sistema si no se manejan con cuidado.

<Alert variant="warning" title="Acceso a Credenciales Sensibles">
  Nunca compartas tu archivo `.env.local` ni publiques el `GITHUB_TOKEN` en repositorios públicos.
  
  **Recomendaciones:**
  - Añade `.env*` a tu archivo `.ignore`.
  - Utiliza secretos de GitHub Actions para despliegues automatizados.
  - Rota tus tokens cada 90 días para máxima seguridad.
</Alert>

### 2. Diagnóstico de Error Crítico
La variante `error` debe usarse cuando una acción no puede completarse, proporcionando detalles técnicos claros.

<Alert variant="error" title="Fallo en la Sincronización de Contenido">
  No se pudo establecer conexión con el repositorio remoto. Esto suele ocurrir por:
  
  1. **Token Expirado**: Verifica la validez de tu PAT en la configuración de GitHub.
  2. **Permisos Insuficientes**: Asegúrate de que el token tiene el scope `repo`.
  3. **Límite de Rate Limit**: GitHub API ha limitado temporalmente tus peticiones.
  
  <div className="mt-2 font-mono text-[10px] opacity-70">
    Error Code: 403_FORBIDDEN_API_LIMIT
  </div>
</Alert>

### 3. Pro-Tip de Productividad
Usa la variante `info` para sugerir mejores prácticas o atajos que mejoren la experiencia del usuario.

<Alert variant="info" title="Truco de Editor: Edición Multi-línea">
  Puedes editar múltiples líneas simultáneamente en el editor administrativo manteniendo pulsada la tecla `Alt` y haciendo clic en diferentes posiciones del texto.
  
  <div className="mt-1">
    [Aprende más sobre atajos de teclado](/docs/FusionDoc/05-utilidades/kbd)
  </div>
</Alert>

---

## Referencia de API

### `<Alert />`

| Propiedad | Tipo | Por defecto | Descripción |
| :--- | :--- | :--- | :--- |
| `variant` | `info` \| `success` \| `warning` \| `error` | `info` | Define el color, el icono y el tono emocional del mensaje. |
| `title` | `string` | - | Un encabezado en negrita opcional que resume la alerta. |
| `children` | `ReactNode` | - | El cuerpo del mensaje. Soporta cualquier componente o elemento MDX. |
| `className` | `string` | - | Clases adicionales de CSS para ajustes finos de layout. |

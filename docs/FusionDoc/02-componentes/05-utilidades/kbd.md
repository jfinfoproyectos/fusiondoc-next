# Teclas (Kbd)

El componente `<Kbd />` (Keyboard) se utiliza para representar una tecla física o una combinación de atajos de teclado. A diferencia del código estándar, este componente tiene una estética que imita el hardware real (estilo Apple/Moderno), lo que facilita la lectura de guías de software.

## Características
- **Estética Hardware**: Sombras y bordes que dan profundidad a la tecla.
- **Tipografía Mono**: Utiliza una fuente monoespaciada en negrita para máxima claridad.
- **Inline**: Se integra perfectamente dentro de párrafos de texto.

## Ejemplos de Uso

### Tecla Individual
Para realizar esta acción, presiona la tecla <Kbd>Enter</Kbd>.

### Combinaciones (Atajos)
Puedes guardar los cambios presionando <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd>.

Para abrir el buscador global, utiliza <Kbd>⌘</Kbd> + <Kbd>K</Kbd> en tu Mac.

## Referencia de Props

| Prop | Tipo | Descripción |
| :--- | :--- | :--- |
| `children` | `ReactNode` | **Requerido**. El texto o icono que representa la tecla. |
| `className` | `string` | Clases de CSS adicionales para personalización. |

---

<Alert variant="info">
  **Accesibilidad:** Este componente utiliza la etiqueta semántica `<kbd>`, lo que permite que los lectores de pantalla identifiquen correctamente el texto como una entrada de teclado.
</Alert>

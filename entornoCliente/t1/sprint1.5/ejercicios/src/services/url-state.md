# URL y parámetros utilizados

## ConversationView
- **Ruta:** `/conversacion/:id`
- **Parámetro:** `id` → identificador de la conversación que se quiere mostrar.

## ConversationsView
- **Ruta:** `/conversaciones`
- **Query params:**
  - `q` → búsqueda por nombre de la conversación
  - `sort` → orden de la lista (`asc` o `desc`)

### Comportamiento
- Cambiar los controles actualiza la URL automáticamente.
- Abrir la URL directamente con parámetros restaura los valores y muestra la lista filtrada/ordenada.

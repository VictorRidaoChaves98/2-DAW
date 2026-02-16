
---

## **3️⃣ `convenciones.md`**

```markdown
# Convenciones de la API

## Versionado
- Todos los endpoints llevan el prefijo `/v1/`.

## Nombres
- Paths: `kebab-case` (`/user-goals`, `/daily-consumptions`)
- Base de datos: `snake_case` (`user_id`, `daily_calories`)

## Seguridad
- Todos los endpoints protegidos usan **JWT Bearer Token**.
- Roles: `admin`, `user` (cuando aplique)

## Respuesta de listados
- Todos los listados usan paginación:
```json
{
  "total": 100,
  "page": 1,
  "limit": 20,
  "items": [ ... ]
}

{
  "code": "ERROR_CODE",
  "message": "Mensaje legible",
  "details": []
}

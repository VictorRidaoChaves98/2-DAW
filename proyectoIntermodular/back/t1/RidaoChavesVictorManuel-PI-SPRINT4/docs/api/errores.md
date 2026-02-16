# Guía de errores de la API

Formato general de errores:

```json
{
  "code": "ERROR_CODE",
  "message": "Descripción del error",
  "details": []
}

{
  "code": "VALIDATION_ERROR",
  "message": "El campo 'email' es obligatorio",
  "details": ["email"]
}

{
  "code": "NOT_FOUND",
  "message": "Alimento con ID 12 no encontrado",
  "details": []
}

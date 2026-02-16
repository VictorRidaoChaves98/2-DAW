# Servicio SMTP con Mailhog y Nodemailer

Proyecto sencillo para enviar correos vía API Express usando Nodemailer y Mailhog como SMTP local de pruebas.

## Herramientas
- Node.js / Express
- Nodemailer
- Mailhog (Docker Compose)

## Estructura
```
src/
  app.js
  server.js
  routes/
    email.routes.js
  services/
    email.service.js
sdk/
  email/
    email.client.js
    index.js
examples/
  test-mailhog.js
  test-sdk.js
  test-api.js
.env.example
package.json
docker-compose.yml
test-email.js
```

## Comandos básicos
```bash
npm install               # instalar dependencias
npm run docker:up         # levantar Mailhog (SMTP 1025, UI 8025)


# prueba rápida de envío
node test-email.js

# detener Mailhog
npm run docker:down
```
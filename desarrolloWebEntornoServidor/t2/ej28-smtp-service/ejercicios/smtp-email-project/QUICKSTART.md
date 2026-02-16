# 🚀 Guía Rápida de Inicio

## Pasos para ejecutar el proyecto

### 1. Instalar dependencias (si es necesario)
```bash
npm install
```

### 2. Iniciar Docker Desktop
Asegúrate de que **Docker Desktop** esté ejecutándose en tu sistema.

### 3. Iniciar Mailhog
```bash
npm run docker:up
# o alternativamente:
docker-compose up -d
```

Esto iniciará el servidor SMTP de prueba Mailhog en:
- **SMTP Server:** `localhost:1025`
- **Web Interface:** `http://localhost:8025`

### 4. Iniciar el servidor API
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3000`

---

## 📝 Probar el servicio

### Opción 1: Usar la API REST con curl

```bash
curl -X POST http://localhost:3000/api/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "test@ejemplo.com",
    "subject": "Email de prueba",
    "text": "Este es un mensaje de prueba",
    "html": "<h1>Email de prueba</h1><p>Este es un mensaje de prueba</p>"
  }'
```

### Opción 2: Usar Postman o Thunder Client

**Endpoint:** `POST http://localhost:3000/api/email/send`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "to": "destinatario@ejemplo.com",
  "subject": "Mi primer email",
  "text": "Contenido en texto plano",
  "html": "<h1>Hola</h1><p>Este es mi primer email</p>"
}
```

### Opción 3: Ejecutar los scripts de ejemplo

```bash
# Probar con Mailhog directamente
node examples/test-mailhog.js

# Probar el SDK
node examples/test-sdk.js

# Probar la API (requiere que el servidor esté ejecutándose)
node examples/test-api.js
```

---

## 📬 Ver los emails enviados

Abre tu navegador en: **http://localhost:8025**

Ahí verás todos los emails capturados por Mailhog.

---

## 🛠️ Comandos útiles

```bash
# Iniciar el servidor
npm start

# Iniciar Mailhog
npm run docker:up

# Detener Mailhog
npm run docker:down

# Ver logs de Mailhog
npm run docker:logs

# Verificar estado del servicio
curl http://localhost:3000/api/email/status
```

---

## 📧 Configurar Gmail (Producción)

### Paso 1: Generar contraseña de aplicación
1. Ve a tu cuenta de Google
2. **Seguridad** → **Verificación en dos pasos** (debe estar activada)
3. **Contraseñas de aplicaciones**
4. Genera una nueva contraseña para "Correo"

### Paso 2: Actualizar .env
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu-email@gmail.com
SMTP_PASS=tu-contraseña-de-aplicación
```

### Paso 3: Reiniciar el servidor
```bash
npm start
```

---

## 🎯 Estructura del Proyecto

```
smtp-email-project/
├── src/
│   ├── app.js                    # App Express
│   ├── server.js                 # Servidor HTTP
│   ├── services/
│   │   └── email.service.js      # Servicio de email
│   └── routes/
│       └── email.routes.js       # Rutas de la API
├── sdk/
│   └── email/
│       ├── email.client.js       # Cliente SDK
│       └── index.js              # Exportación
├── examples/
│   ├── test-mailhog.js          # Ejemplo con Mailhog
│   ├── test-sdk.js              # Ejemplo con SDK
│   └── test-api.js              # Ejemplo con API
├── docker-compose.yml            # Config Mailhog
├── package.json
├── .env                         # Variables de entorno
└── README.md                    # Documentación completa
```

---

## ⚠️ Solución de problemas

### Error: "connect ECONNREFUSED 127.0.0.1:1025"
- **Causa:** Mailhog no está ejecutándose
- **Solución:** 
  1. Verifica que Docker Desktop esté ejecutándose
  2. Ejecuta `npm run docker:up`

### Error: "Docker not found"
- **Causa:** Docker no está instalado o no está en el PATH
- **Solución:** Instala Docker Desktop desde https://www.docker.com/products/docker-desktop

### Los emails no aparecen en Mailhog
- Verifica que Mailhog esté ejecutándose: `docker ps`
- Verifica que el puerto 8025 esté libre: `netstat -an | findstr 8025`
- Revisa los logs: `npm run docker:logs`

---

## ✅ Checklist de implementación

- [x] Nodemailer instalado y configurado
- [x] Mailhog configurado en Docker Compose
- [x] Servicio de email implementado
- [x] Rutas de API configuradas
- [x] SDK del cliente implementado
- [x] Variables de entorno configuradas
- [x] Ejemplos de uso creados
- [x] Documentación completa
- [x] Soporte para Gmail configurado

---

¡Todo está listo! 🎉

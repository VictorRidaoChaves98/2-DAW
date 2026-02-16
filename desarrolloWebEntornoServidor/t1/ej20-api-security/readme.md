# Se debe:

## 1. Realizar un middleware que valide el acceso a través de un token válido (desencriptar el token con bcrypt)

- Se tomará por acceso válido si el mensaje original es I know your secret.

---

## 2. Crear un servidor que tenga las siguientes rutas:

- '/public' Acceso público que permitirá el acceso a invitados
- '/vip' Acceso que dará acceso a usuarios registrados
- '/admin' Acceso exclusivo a usuarios con rol admin

---

## Trabajo 

Añadir seguridad al proyecto notas con un token encriptado y con el nombre de un usuario 'admin' dado por variable de entorno.

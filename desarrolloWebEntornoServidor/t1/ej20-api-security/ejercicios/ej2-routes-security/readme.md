# Ejercicio 2: Crear un servidor que tenga las siguientes rutas:

- '/public' Acceso público que permitirá el acceso a invitados
- '/vip' Acceso que dará acceso a usuarios registrados
- '/admin' Acceso exclusivo a usuarios con rol admin

## Estructura del proyecto
```
ej2-routes-security/
├── index.js
├── package.json
└── package-lock.json
```

## Funcionamiento

### 1. Iniciar el servidor
![server-init](./imagenes/ej2server.png)

### 2. Servidor público
![server-publico](./imagenes/ej2public.png)

### 3. Servidor administrador sin token
![server-admin-no-token](./imagenes/ej2adminnotoken.png)

### 4. Servidor administrador con token
![server-admin-token](./imagenes/ej2adminnormal.png)

### 5. Servidor administrador con rol admin
![server-admin-rol-admin](./imagenes/ej2adminroladmin.png)

### 6. Servidor VIP sin token
![server-vip-no-token](./imagenes/ej2vipnotoken.png)

### 7. Servidor VIP con token
![server-vip-token](./imagenes/ej2vip.png)

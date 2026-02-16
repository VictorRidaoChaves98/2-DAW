### 1. Realizar un servidor, aplicando el uso de buenas prácticas, que permita:
- Realizar el CRUD completo de una colección de usuarios bajo la ruta /users
* Listar todos los usuarios que existan
* Recoger un usuario concreto dado su ID
* Crear / Actualizar / Sobreescribir / Borrar usuarios
- Debe permitir el almacenamiento en memoria para mantener los ususarios creados y poder
recogerlos
* Para un uso práctico y no muy pesado, se puede precargar el contenido y tener usuarios
iniciados al cargar (integrar el lanzamiento en los loaders).
- Prestar atención a:
* Endpoints REST y métodos HTTP
* Control de errores
* Uso correcto de códigos HTTP
- Realización de los test unitarios

## Estructura del proyecto:
```
**ej1-server**
  **node_modules**
  **src**
   ┣ controllers
   ┃ ┗ users.controllers.js
   ┣ data
   ┃ ┗ users.data.js
   ┣ routes
   ┃ ┗ users.routes.js
   ┗ services
   ┃ ┗ users.services.js
  **test**
   ┗ users.test.js
    .gitignore
    app.js
    package-lock.json
    package.json
```
---
## Endpoints

| Método | Ruta           | Descripción                         |
|--------|----------------|-------------------------------------|
| GET    | /users         | Listar todos los usuarios           |
| GET    | /users/:id     | Obtener usuario por ID              |
| POST   | /users         | Crear un nuevo usuario              |
| PUT    | /users/:id     | Sobreescribir usuario existente     |
| PATCH  | /users/:id     | Actualizar parcialmente usuario     |
| DELETE | /users/:id     | Borrar usuario                      |
---
### Listar usuarios
```
curl http://localhost:3000/users
```
### Crear usuario
```
curl -X POST http://localhost:3000/users \
-H "Content-Type: application/json" \
-d '{"name":"Nuevo","email":"nuevo@test.com"}'
```
### Actualizar usuario
```
curl -X PATCH http://localhost:3000/users/1 \
-H "Content-Type: application/json" \
-d '{"name":"Actualizado"}'
```
### Eliminar usuario
```
curl -X DELETE http://localhost:3000/users/1
```
### Imagen con el resultado por consola:

![Resultado](./imagenes/ej1server.png)

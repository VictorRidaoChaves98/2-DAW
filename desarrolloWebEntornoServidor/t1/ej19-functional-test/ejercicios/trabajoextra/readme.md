# Gestor de Notas (se añaden imágenes al final con los resultados)

Este proyecto consiste en una API REST para gestionar notas. Está desarrollado siguiendo buenas prácticas, con estructura MVC, logger configurado, control de errores y tests automatizados con Jest y Supertest.

---

## Instalación

Se clona la carpeta con el trabajo desde el tema 17 y se añade a la carpeta del tema 19:

## Ejecución

Para levantar el servidor:

```
node src/server.js
```

El servidor se ejecutará en:

```
http://localhost:3000
```

---

## Rutas de la API

* `GET /api/notas` → Obtener todas las notas
* `POST /api/notas` → Crear una nueva nota
* `GET /api/notas/:id` → Obtener una nota por ID
* `PUT /api/notas/:id` → Actualizar una nota
* `DELETE /api/notas/:id` → Eliminar una nota

---

## Tests y Cobertura

Se utiliza Jest con Babel para ejecutar los tests.

Ejecutar tests:

```
npm test
```

Cobertura actual: **88.88%**

* Funciones: 94.44%
* Líneas: 94.54%
* Ramas: 42.85%

Todos los endpoints están cubiertos por tests automatizados.

---

## Colección Postman

Se ha creado una colección de Postman que incluye todos los endpoints de la API para facilitar pruebas manuales.

---

## Imágenes

### Conexión al puerto 3000

![Conexión al puerto 3000](./imagenes/trabajoservercorriendo.png)

---

### JSON de notas en el navegador

![Notas en navegador](./imagenes/trabajojsonweb.png)

---

### Notas en Postman

![Notas en Postman](./imagenes/trabajonotaspostman.png)

---

### Se prueba a lanzar error

![Lanzar error por consola](./imagenes/trabajoErrorTerminal.png)

---

### Se muestra el error en navegador

![No se encuentra la nota](./imagenes/trabajoTryError.png)

---

### Se realiza una petición con Winston + Morgan

![Peticion con w+m](./imagenes/trabajomorgan+winstonPeticion.png)

---

### Se muestra la cobertura de los tests >80%

![Cobertura de tests](./imagenes/trabajoLaunchTests.png)

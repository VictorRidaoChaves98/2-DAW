# Gestor de Notas

Proyecto desarrollado en la asignatura **DWES**, ampliado progresivamente con lo visto en el tema 23.

El objetivo del proyecto es implementar un **gestor de notas** con funcionalidades de gestión de ficheros y una **API REST documentada mediante OpenAPI (Swagger)**.

## Funcionalidades implementadas

* Importación (subida) de uno o varios ficheros con extensión `.note`.
* Exportación de notas para su descarga en formato fichero.
* Filtrado de notas para mejorar la usabilidad.
* Implementación de una API REST para la gestión de notas.
* Documentación técnica completa de la API utilizando **OpenAPI 3.x (Swagger)**.
* Integración de **Swagger UI** para la visualización y prueba de los endpoints.

---

## Instalación

Se parte del proyecto desarrollado en el **tema 21**, ampliado en el **tema 22**, y extendido en el **tema 23** con la documentación Swagger.

## Documentación de la API (OpenAPI / Swagger)

El proyecto incluye documentación técnica de la API REST conforme a la especificación **OpenAPI 3.x**.

### Contenido documentado

* Endpoints de la API para la gestión de notas.
* Métodos HTTP (`GET`, `POST`, `PUT`, `DELETE`).
* Parámetros de ruta, consulta y cuerpo de las peticiones.
* Definición de schemas de datos.
* Responses de éxito y error.
* Ejemplos de uso.
* Definición del sistema de seguridad.

### Acceso a Swagger UI

Una vez iniciado el servidor, la documentación interactiva está disponible en:

```
http://localhost:3000/api-docs
```

El puerto puede variar según la configuración definida en el archivo `.env`.

---

## Ejecución y resultados

### Arranque del servidor

El servidor se levanta correctamente desde la terminal de VS Code utilizando bash.

![server up](./images/ej23serverup.png)

---

### Visualización de la documentación Swagger

La interfaz Swagger UI permite consultar y probar los endpoints de la API de forma interactiva.

![swagger ui](./images/ej23swagger.png)

---

### Visualización de notas con extensión `.json`

Listado de notas almacenadas en el sistema.

![Todas las notas](./images/ej23notasJSON.png)

---

### Visualización de archivos de la carpeta 'files/'

Listado de archivos en formato note y pdf.

![notas note/pdf](./images/ej23notasfiles.png)

---

### Visualización de ejemplo de .note

Se muestra nota en formato json sobre videojuego Bioshock

![nota bioshock](./images/ej23bioshocknote.png)

### Visualización en Postman con las requests 'GET'

Se muestra interfaz de Postman con la lista de requests (temas pasados)

![requests postman](./images/ej23postmanlist.png)

### Visualización en Postman de la lista de archivos '/file'

Se muestra la interfaz de Postman con la lista de notas creadas con formato '.note'

![lista '.note' postman](./images/ej23postmannotes.png)

### Visualización del token obtenido en Postman

Se muestra el token junto con usuario y contraseña

![token postman](./images/ej23postmantoken.png)

---

# Tema 36 - Desarrollo Web Entorno Servidor (Mongoose Avanzado)

## Objetivos

El objetivo de este tema es **profundizar en la gestión de datos con Mongoose**, añadiendo funcionalidades avanzadas a los modelos:

* Herencia de modelos con **Discriminators**.
* Ejecución automática de código con **Hooks** (`pre` y `post`).
* Validaciones personalizadas en los campos del modelo.
* Uso avanzado de **tipos de schema** (arrays, mapas, objetos anidados, `ObjectId`, `Mixed`, etc.).

---

## 1. Preparación del entorno

### **1.1. Crear y levantar MongoDB en Docker**

1. Ejecuta MongoDB con Docker:

```
docker run -d -p 27017:27017 --name mongo mongo
```

2. Comprueba que el contenedor está activo:

```
docker ps
```

### **1.2. Descargar datasets de ejemplo**

Descarga los datasets de MongoDB Atlas para poder hacer los ejercicios:
Repositorio oficial: [https://github.com/neelabalan/mongodb-sample-dataset](https://github.com/neelabalan/mongodb-sample-dataset)

### **1.3. Copiar archivos JSON dentro del contenedor**

```
docker cp <nombre_del_fichero>.json mongo:/<nombre_del_fichero>.json
```

Ejemplo:

```
docker cp comments.json mongo:/comments.json
docker cp movies.json mongo:/movies.json
docker cp grades.json mongo:/grades.json
docker cp data.json mongo:/data.json
```

### **1.4. Importar los datos en MongoDB**

```
docker exec -it mongo mongoimport --db <nombre_db> --collection <nombre_coleccion> --file /<nombre_fichero>.json
```

Ejemplo:

```
docker exec -it mongo mongoimport --db sample_mflix --collection movies --file /movies.json
docker exec -it mongo mongoimport --db sample_mflix --collection comments --file /comments.json
docker exec -it mongo mongoimport --db sample_training --collection grades --file /grades.json
docker exec -it mongo mongoimport --db sample_weatherdata --collection data --file /data.json
```

---

## 2. Estructura del proyecto

Se recomienda la siguiente estructura de carpetas para trabajar con NodeJS y Mongoose:

```
tema36-mongoose/
 ┣ bd/                  # Carpeta con las bases de datos JSON
 ┣ models/              # Schemas de Mongoose
 ┃ ┣ notification.js    # Ejemplo de discriminators
 ┃ ┣ user.js            # Ejemplo de hooks y validaciones
 ┣ node_modules/
 ┣ index.js             # Archivo principal para pruebas y consultas
 ┣ package.json
 ┣ package-lock.json
 ┗ README.md
```

---

## 3. Base de datos a utilizar

* `sample_mflix` → `movies` y `comments`
* `sample_training` → `grades`
* `sample_weatherdata` → `data`

---

## Ejecución del proyecto

### **Paso 1: Instalar dependencias**

```
npm install
```

### **Paso 2: Asegurar que MongoDB está corriendo**

```
docker run -d -p 27017:27017 --name mongo mongo
```

```
docker start mongo
```

---

## Estructura de carpetas generada

```
tema36-mongoose/
 ┣ bd/                          # Datasets JSON
 ┣ models/
 ┃ ┣ notification.js            # Discriminators (SMS y Email)
 ┃ ┣ user.js                    # Hooks (pre-save, post-save)
 ┃ ┣ color.js                   # Validaciones personalizadas
 ┃ ┗ complexSchema.js            # Tipos avanzados (Arrays, Maps, ObjectId, Mixed)
 ┣ node_modules/
 ┣ index.js                      # Archivo principal con todos los ejercicios
 ┣ package.json
 ┣ package-lock.json
 ┗ README.md
```

---

## Comandos útiles

### **Conectar a MongoDB desde la terminal**

```bash
docker exec -it mongo mongosh
```

### **Listar todas las bases de datos**

```bash
show dbs
```

### **Cambiar a la base de datos del proyecto**

```bash
use tema36-mongoose
```

### **Listar colecciones**

```bash
show collections
```

### **Ver documentos de una colección**

```
db.notifications.find()
db.users.find()
db.colors.find()
db.complexschemas.find()
```
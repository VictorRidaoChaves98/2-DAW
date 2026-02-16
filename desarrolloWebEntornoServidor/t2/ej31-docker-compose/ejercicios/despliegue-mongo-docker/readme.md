# Despliegue de MongoDB con Docker Compose

## Descripción
Este proyecto consiste en el despliegue de una base de datos **MongoDB** utilizando **Docker Compose**, garantizando la **persistencia de datos**, el uso de **redes Docker** y la **automatización** del arranque y parada del servicio.

El objetivo es aprender a crear servicios con Docker Compose de forma sencilla y reproducible.

---

## Tecnologías utilizadas
- Docker
- Docker Compose
- MongoDB (imagen oficial)

---

## Estructura del proyecto

```
despliegue-mongo-docker/
│
├── docker-compose.yml
├── up.bat
├── down.bat
└── .gitignore
```
---

## Configuración del servicio

El servicio MongoDB se define en el fichero `docker-compose.yml` con las siguientes características:
- Imagen oficial de MongoDB
- Puerto expuesto: **27017**
- Volumen persistente para los datos
- Red Docker propia (`bridge`)
- Política de reinicio automática

---

## Uso del proyecto

### Arrancar el servicio
```
up.bat
```

O manualmente:

```
docker-compose up -d
```
---

### Parar el servicio

```
down.bat
```

O manualmente:

```bash
docker-compose down
```
---

## Persistencia de datos

El proyecto utiliza un **volumen Docker** para garantizar que los datos almacenados en MongoDB **no se pierdan** al detener o eliminar el contenedor.
La persistencia ha sido comprobada insertando datos, deteniendo el servicio y volviéndolo a levantar, verificando que los datos siguen disponibles.

---

## Redes Docker

Se ha configurado una red Docker de tipo `bridge` para el servicio MongoDB, lo que permite un mejor aislamiento y una futura ampliación del entorno con otros servicios.

---

## Control de versiones

Se incluye un archivo `.gitignore` para evitar subir al repositorio:

* Datos generados por Docker
* Volúmenes
* Archivos temporales
* Configuración local del sistema

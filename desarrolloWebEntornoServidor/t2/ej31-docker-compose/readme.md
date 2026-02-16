# Se debe:

## Despliegue de MongoDB con Docker Compose

El objetivo de este ejercicio es desplegar una base de datos **MongoDB** utilizando **Docker Compose**, aplicando los conceptos vistos en el tema sobre orquestación de contenedores.

Para ello, se deberá:

- Crear un fichero `docker-compose.yml` que despliegue un servicio MongoDB usando la imagen oficial.
- Exponer el puerto estándar de MongoDB para permitir la conexión desde el host.
- Configurar un volumen Docker para garantizar la persistencia de los datos.
- Definir una red Docker propia para el servicio.
- Automatizar el arranque y la parada del entorno mediante scripts.
- Verificar que los datos no se pierden al detener y volver a levantar el contenedor.
- Mantener el repositorio limpio mediante el uso de un archivo `.gitignore`.

El resultado final debe permitir levantar y detener el servicio MongoDB de forma sencilla y reproducible utilizando Docker Compose.

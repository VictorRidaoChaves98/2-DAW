### Se debe:

## 1. Realizar un servidor, aplicando el uso de buenas prácticas, que permita:
– Realizar el CRUD completo de una colección de usuarios bajo la ruta /users
* Listar todos los usuarios que existan
* Recoger un usuario concreto dado su ID
* Crear / Actualizar / Sobreescribir / Borrar usuarios
– Debe permitir el almacenamiento en memoria para mantener los ususarios creados y poder
recogerlos
* Para un uso práctico y no muy pesado, se puede precargar el contenido y tener usuarios
iniciados al cargar (integrar el lanzamiento en los loaders).
– Prestar atención a:
* Endpoints REST y métodos HTTP
* Control de errores
* Uso correcto de códigos HTTP
– Realización de los test unitarios

## 2. Trabajo
Investigación y comparativa de REST vs OData vs GraphQL
– Escribir documentación en Markdown (Readme.md)
– Seleccionar uno entre OData y GraphQL y realizar una puesta en práctica con Nodejs

# Comparativa de APIs: REST vs OData vs GraphQL

Este proyecto contiene implementaciones de una API de ejemplo usando tres tecnologías diferentes: **REST**, **OData** y **GraphQL**. El objetivo es comparar su estructura, ventajas y casos de uso.

---

## 1. Introducción

Las APIs son la columna vertebral de la comunicación entre aplicaciones. Existen varios estilos y estándares:

- ¿Qué es **REST**? Es un estilo de arquitectura para diseñar aplicaciones web distribuidas que utilizan el protocolo HTTP para la comunicación entre cliente y servidor.
- ¿Qué es **OData**? Es un protocolo que usa HTTP para permitir que diferentes aplicaciones se comuniquen entre sí a través de APIs web de manera sencilla y uniforme.
- ¿Qué es **GraphQL**? Es un lenguaje de consulta para APIs que permite a los clientes pedir exactamente los datos que necesitan en una sola solicitud.

---

## 2. Comparativa de tecnologías

| Característica          | REST                          | OData                                      | GraphQL                       |
|-------------------------|-------------------------------|--------------------------------------------|-------------------------------|
| Paradigma               | Recursos + HTTP verbs         | Recursos + OData queries                   | Consultas y esquemas          |
| Flexibilidad de datos   | Fija por endpoint             | Media (query options `$filter`, `$expand`) | Alta (cliente define la forma)|
| Sobrecarga de endpoints | Puede requerir muchos         | Similar a REST                             | Un único endpoint             |
| Soporte de filtrado     | Manual o query params         | Nativo (`$filter`, `$orderby`, `$top`)     | Nativo en la consulta         |
| Curva de aprendizaje    | Baja                          | Media                                      | Media-Alta                    |
| Uso típico              | APIs simples y microservicios | APIs empresariales y datos estructurados   | Apps modernas y móviles       |

---

## 3. Resumen

- **Rest** es más fácil de usar además de ser un estándar ya que se usa mucho
- **GraphQL** le dá más control al cliente y es más flexible
- **OData** se parece a REST pero con queries más avanzadas





# FitFood – Proyecto Final 2º DAW

## 1. Información General

**Nombre del proyecto:** FitFood

**Motivo de elección:**
El proyecto FitFood surge a partir de la creciente necesidad de las personas de llevar un control preciso, accesible y digitalizado de su alimentación diaria. La aplicación facilita el seguimiento de la ingesta calórica y permite a los usuarios conocer de forma inmediata cuántas calorías consumen, ayudándoles a mejorar sus hábitos alimenticios.

**Descripción del proyecto:**
FitFood es una aplicación multiplataforma, disponible tanto para ordenadores de escritorio como para dispositivos Android. Su función principal es permitir al usuario registrar los alimentos consumidos y calcular automáticamente las calorías en función de la cantidad introducida y los datos almacenados en la base de datos.

La aplicación permite gestionar alimentos individuales y platos combinados, así como crear recetas personalizadas. El objetivo final es ofrecer un registro claro de la alimentación diaria y facilitar la planificación de dietas adaptadas al estilo de vida de cada usuario.

**Características principales:**

* Cálculo automático de calorías mediante base de datos de alimentos y cantidades.
* Compatibilidad multiplataforma (escritorio y Android).
* Seguimiento en tiempo real de la ingesta calórica diaria.
* Creación y gestión de dietas personalizadas.
* Red social interna para compartir recetas y platos.
* Sistema de valoraciones y favoritos.
* Expansión progresiva del catálogo de alimentos.

**Repositorios:**

* Backend: VMRC-PI-BACK
* Frontend: VMRC-PI-FRONT

---

## 2. Frontend

### Diseño y prototipado

* Uso de **Figma** para el diseño de pantallas, flujos de usuario y prototipos visuales.
* Implementación de la interfaz mediante **React**, adaptando los diseños realizados en Figma.

### Lenguajes y tecnologías

* **HTML5** para la estructura de las vistas.
* **CSS3** para los estilos, diseño responsive y adaptación multiplataforma.
* **JavaScript** para la lógica del frontend, gestión de estados y eventos.

### Comunicación con el backend

* Uso de **Fetch API** para las peticiones HTTP (GET, POST, PUT, DELETE).
* Autenticación basada en **JSON Web Token (JWT)** para el control de sesiones y acceso a rutas protegidas.

---

## 3. Backend (provisional)

### Estructura de carpetas

El backend del proyecto FitFood se organiza siguiendo una estructura clara basada en el patrón MVC, facilitando la mantenibilidad y escalabilidad del código:

```
backend/
 ├── controllers/
 │    ├── userController.js
 │    ├── recipeController.js
 │    ├── historyController.js
 │    ├── favoriteController.js
 │    └── ratingController.js
 │
 ├── models/
 │    ├── User.js
 │    ├── Recipe.js
 │    ├── Ingredient.js
 │    ├── Favorite.js
 │    ├── LookingFor.js
 │    ├── Plan.js
 │    ├── History.js
 │    ├── Favorite.js
 │    └── Rating.js
 │
 ├── routes/
 │    ├── userRoutes.js
 │    ├── recipeRoutes.js
 │    ├── historyRoutes.js
 │    ├── favoriteRoutes.js
 │    └── ratingRoutes.js
 │
 ├── middlewares/
 │    └── authMiddleware.js
 │
 ├── config/
 │    └── db.js
 │
 ├── app.js
 └── server.js
```

Esta estructura permite separar claramente la lógica de negocio, el acceso a datos y la definición de rutas.

### Arquitectura MVC

El backend del proyecto sigue estrictamente el patrón **MVC (Modelo – Vista – Controlador)**, donde cada capa cumple una función específica:

* **Modelo (Model):**
  Encargado del acceso a la base de datos MySQL. Define la estructura de las entidades y contiene las consultas necesarias para crear, leer, actualizar y eliminar datos.

* **Controlador (Controller):**
  Contiene la lógica de negocio del sistema. Recibe las peticiones HTTP desde las rutas, valida los datos, aplica las reglas del dominio y se comunica con los modelos.

* **Vista (View):**
  En este proyecto, las vistas no se gestionan directamente desde el backend, ya que la aplicación sigue un enfoque API REST. El frontend en React actúa como consumidor de la API y se encarga de la presentación de la información.

Esta separación de responsabilidades mejora la organización del código y facilita su mantenimiento y ampliación.

### Autenticación

### Tecnologías utilizadas

* **Node.js** como entorno de ejecución de JavaScript en el servidor.
* **Express.js** para la creación de la API REST, definición de rutas y controladores.
* **JavaScript** para la implementación de la lógica del servidor y las reglas de negocio.

### Arquitectura

El backend del proyecto sigue el patrón **MVC (Modelo – Vista – Controlador)**:

* **Modelos:** acceso y gestión de la base de datos.
* **Controladores:** aplicación de la lógica de negocio y validaciones.
* **Rutas:** definición de los endpoints de la API REST.

### Autenticación

* Implementación de **JWT (JSON Web Token)** para el registro, login y protección de rutas privadas.

---

## 4. Controladores (Lógica del Sistema)

Esta sección describe la lógica principal implementada en los controladores del backend. Los controladores se encargan de gestionar las peticiones recibidas desde el frontend, aplicar las reglas de negocio y comunicarse con los modelos para acceder a la base de datos.

### 4.1 Controlador de Usuarios (UserController)

**Responsabilidad:**

* Registro de nuevos usuarios.
* Inicio de sesión.
* Gestión básica de datos del usuario.

**Lógica aplicada:**

* Validación de campos obligatorios (email, contraseña).
* Comprobación de emails duplicados.
* Encriptación de contraseñas.
* Generación de tokens JWT.

**Reglas de negocio:**

* Cada usuario debe estar registrado para utilizar la aplicación.

---

### 4.2 Controlador de Recetas (RecipeController)

**Responsabilidad:**

* Creación y gestión de recetas.
* Asociación de ingredientes a las recetas.
* Cálculo automático de calorías.

**Lógica aplicada:**

* Verificación del tipo de usuario (solo nutricionistas pueden crear recetas oficiales).
* Cálculo de las calorías totales a partir de los ingredientes y cantidades.
* Almacenamiento de recetas e ингредиientes asociados.

**Reglas de negocio:**

* Solo los nutricionistas pueden crear recetas oficiales.
* Las calorías no se introducen manualmente, se calculan automáticamente.

---

### 4.3 Controlador de Historial Nutricional (HistoryController)

**Responsabilidad:**

* Registro del consumo diario de alimentos.
* Consulta del historial nutricional del usuario.

**Lógica aplicada:**

* Comprobación de la existencia de un historial para una fecha concreta.
* Cálculo del total de calorías diarias.

**Reglas de negocio:**

* Un usuario no puede tener más de un historial nutricional por fecha.

---

### 4.4 Controlador de Favoritos (FavoriteController)

**Responsabilidad:**

* Gestión de recetas favoritas de los usuarios.

**Lógica aplicada:**

* Verificación de favoritos duplicados antes de insertar un nuevo registro.

**Reglas de negocio:**

* No se permiten recetas duplicadas en favoritos.

---

### 4.5 Controlador de Valoraciones (RatingController)

**Responsabilidad:**

* Valoración de recetas por parte de los usuarios.

**Lógica aplicada:**

* Comprobación de si el usuario ya ha valorado una receta.
* Registro de la puntuación.

**Reglas de negocio:**

* Un usuario solo puede puntuar una receta una vez.

---

## 5. Base de Datos

### Tecnología de base de datos

Se utiliza una base de datos **relacional MySQL**, gestionada mediante **HeidiSQL** durante las fases de diseño, desarrollo y pruebas.

La elección de SQL se debe a la gran cantidad de relaciones entre entidades y a la necesidad de garantizar la integridad referencial y la aplicación de reglas de negocio.

### Tablas principales

* usuarios
* recetas
* ingredientes
* receta_ingrediente
* planes_alimentacion
* plan_receta
* historial_nutricional
* favoritos
* valoraciones

---

## 6. Despliegue y Entorno

### Control de versiones

* **GitHub** para la gestión del código.
* **SourceTree** como cliente gráfico para el control de versiones.

### Despliegue

* Uso de **Docker** de forma opcional para la contenerización del backend y la base de datos.

**Alternativa sin Docker:**

* Backend desplegado en un servicio cloud (Render, Railway, etc.).
* Base de datos MySQL externa.
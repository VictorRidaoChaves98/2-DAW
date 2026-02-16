# FitFood - Proyecto Final 2º DAW

## 1. Información General

**Nombre de la empresa (provisional):** FitFood

**Motivo de elección:**
La escogí debido a la creciente necesidad de las personas de llevar un control preciso y accesible de la ingesta de comidas diarias. La digitalización de este proceso facilita su seguimiento y lo hace accesible a todo tipo de usuarios de una forma fácil e intuitiva. La aplicación permitirá crear recetas y saber al instante cuántas calorías se consumen.

**Descripción del Proyecto:**
FitFood desarrollará una aplicación multiplataforma disponible tanto para ordenadores de escritorio como para dispositivos Android. Su función principal es permitir al usuario realizar un seguimiento en tiempo real de las calorías que consume diariamente. El usuario solo deberá introducir el alimento y la cantidad; el sistema calculará automáticamente las calorías mediante una calculadora integrada.

La aplicación permitirá gestionar tanto platos combinados (hamburguesas, filetes con guarnición, pescado con acompañamiento, etc.) como alimentos individuales (por ejemplo, 7 arándanos, 10 almendras, 1 plátano). El objetivo final es ayudar al usuario a mantener un registro claro de su alimentación y facilitar la planificación de dietas adaptadas a su estilo de vida.

**Características principales:**

* Cálculo automático de calorías mediante base de datos de alimentos y cantidades.
* Compatibilidad multiplataforma: escritorio y Android.
* Seguimiento en tiempo real de la ingesta calórica diaria.
* Sistema para crear y gestionar dietas personalizadas.
* Red social interna para compartir platos, recetas e ideas alimenticias.
* Los usuarios pueden puntuar recetas de otros y guardarlas en favoritos.
* Expansión progresiva del catálogo de alimentos.

**Logotipo provisional:**

> No será el logo final para la web, pero se utilizará en Mock-ups y prototipo.

**Enlaces de repositorios:**

* Backend: [VMRC-PI-BACK](https://github.com/victormanuel-98/VMRC-PI-BACK)
* Frontend: [VMRC-PI-FRONT](https://github.com/victormanuel-98/VMRC-PI-FRONT)

---

## 2. Modelado de la Base de Datos

### Tecnología de Base de Datos

Para el desarrollo del backend de FitFood se ha optado por una **base de datos relacional SQL**, concretamente **MySQL**, gestionada mediante **HeidiSQL** durante las fases de diseño, desarrollo y pruebas.

La elección de SQL se debe a la gran cantidad de **relaciones entre entidades** (usuarios, recetas, ingredientes, planes, favoritos y valoraciones), así como a la necesidad de aplicar **reglas de negocio estrictas**, integridad referencial y restricciones que garanticen la coherencia de los datos.

---

### Índice

1. Introducción
2. Entidades del sistema
   2.1 Usuarios
   2.2 Recetas
   2.3 Ingredientes
   2.4 Planes de Alimentación
   2.5 Historial Nutricional
   2.6 Blog y Favoritos
3. Reglas de negocio soportadas
4. Esquema y Diagrama Entidad–Relación

---

### 1. Introducción

La base de datos del proyecto FitFood ha sido diseñada utilizando un **modelo relacional implementado en MySQL**, con el objetivo de soportar una aplicación de control nutricional, planificación de dietas y red social de recetas.

El modelo prioriza la **integridad de los datos**, la coherencia entre entidades y la correcta aplicación de las reglas de negocio mediante el uso de **claves primarias (PK)** y **claves foráneas (FK)**.
El diseño se representa mediante un **Diagrama Entidad–Relación (ER)** que define el núcleo del sistema.

---

### 2. Entidades del sistema

#### 2.1 Usuarios

Representa a los usuarios registrados en la aplicación.
**Atributos:**

* id (PK)
* nombre
* email
* contraseña_hash
* fecha_registro
* tipo_usuario (cliente, nutricionista, administrador)

**Relaciones:**

* Un usuario puede crear múltiples recetas.
* Un usuario puede crear múltiples planes de alimentación.
* Un usuario puede registrar su historial nutricional diario.
* Un usuario puede puntuar recetas de otros usuarios.
* Un usuario puede guardar recetas de otros usuarios en favoritos.

---

#### 2.2 Recetas

Representa las recetas disponibles en la aplicación.
**Atributos:**

* id (PK)
* nombre
* descripción
* instrucciones
* tiempo_preparacion
* calorias
* usuario_id (FK → Usuarios)

**Relaciones:**

* Una receta pertenece a un usuario.
* Una receta puede incluir múltiples ingredientes.
* Una receta puede formar parte de múltiples planes de alimentación.
* Una receta puede recibir múltiples puntuaciones.
* Una receta puede ser guardada en favoritos por varios usuarios.

---

#### 2.3 Ingredientes

Representa los ingredientes que componen las recetas.
**Atributos:**

* id (PK)
* nombre
* calorias_por_unidad
* unidad_medida

**Relaciones:**

* Un ingrediente puede formar parte de muchas recetas.
* La relación receta–ingrediente se gestiona mediante una tabla intermedia que almacena la cantidad usada.

---

#### 2.4 Planes de Alimentación

Representa los planes de dieta personalizados.
**Atributos:**

* id (PK)
* nombre
* duracion_dias
* descripcion
* usuario_id (FK → Usuarios)

**Relaciones:**

* Un plan puede incluir múltiples recetas.
* Un plan pertenece a un usuario o nutricionista.

---

#### 2.5 Historial Nutricional

Registra la ingesta diaria de alimentos de los usuarios.
**Atributos:**

* id (PK)
* usuario_id (FK → Usuarios)
* fecha
* calorias_total

**Relaciones:**

* Un historial pertenece a un usuario.
* Un usuario no puede tener más de un historial por fecha.

---

#### 2.6 Blog y Favoritos

Gestiona la interacción social dentro de la aplicación.

**Favoritos:**

* id (PK)
* usuario_id (FK → Usuarios)
* receta_id (FK → Recetas)
* fecha_guardado

**Valoraciones:**

* id (PK)
* usuario_id (FK → Usuarios)
* receta_id (FK → Recetas)
* puntuacion

**Relaciones:**

* Un usuario puede puntuar una receta una sola vez.
* Un usuario puede guardar varias recetas en favoritos.

---

### 3. Reglas de negocio soportadas

* Cada usuario debe estar registrado para usar la aplicación.
* Solo los nutricionistas pueden crear recetas y planes oficiales.
* Las calorías se calculan automáticamente según ingredientes y cantidades.
* Un usuario no puede duplicar registros de historial para la misma fecha.
* Un usuario no puede puntuar la misma receta más de una vez.
* No se permiten favoritos duplicados.

---

### 4. Esquema y Diagrama Entidad–Relación

```
USUARIOS
  ├──< RECETAS >──< INGREDIENTES
  │        │
  │        ├──< FAVORITOS >── USUARIOS
  │        └──< VALORACIONES >── USUARIOS
  │
  ├──< PLANES >──< PLAN_RECETAS >── RECETAS
  │
  └──< HISTORIAL_NUTRICIONAL
```

Este esquema refleja la estructura relacional del sistema y las principales relaciones entre entidades.

---

### 5. Conclusión

El modelo de datos de FitFood presenta una arquitectura relacional sólida, coherente y escalable, alineada con los requisitos funcionales de la aplicación.
El uso de MySQL permite garantizar integridad referencial, control de reglas de negocio y facilidad de mantenimiento, sentando una base robusta para futuras ampliaciones del sistema.

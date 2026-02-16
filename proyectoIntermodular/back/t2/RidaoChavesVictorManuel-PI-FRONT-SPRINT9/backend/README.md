# FitFood Backend

Backend API REST para la aplicación FitFood - Sistema de gestión nutricional y recetas.

## 🚀 Características

- ✅ Autenticación con JWT
- ✅ Gestión de usuarios (3 roles: usuario, nutricionista, admin)
- ✅ Creación y gestión de recetas
- ✅ Cálculo automático de calorías
- ✅ Historial nutricional diario
- ✅ Sistema de favoritos
- ✅ Valoraciones y comentarios en recetas
- ✅ Base de datos MongoDB
- ✅ Validaciones de seguridad (contraseña fuerte, email válido)

## 📋 Requisitos Previos

- Node.js 16+
- MongoDB Atlas (o MongoDB local)
- Cloudinary (para subida de imágenes)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone <URL-del-repositorio>
cd backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Completa las variables:

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/fitfood

# Servidor
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura_aqui
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173

# Cloudinary (opcional para subida de imágenes)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### 4. Ejecutar el servidor

**Modo desarrollo (con nodemon):**

```bash
npm run dev
```

**Modo producción:**

```bash
npm start
```

El servidor estará disponible en `http://localhost:5000`

## 📚 Endpoints Principales

### Autenticación

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/registro` | Registrar nuevo usuario |
| POST | `/api/auth/login` | Iniciar sesión |
| GET | `/api/auth/verificar` | Verificar token (requiere auth) |

**Ejemplo de registro:**

```json
{
  "usuario": "victor_98",
  "email": "victor@example.com",
  "nombre": "Víctor",
  "apellidos": "Ridao Chaves",
  "contrasena": "Admin123!",
  "rol": "usuario"
}
```

**Respuesta:**

```json
{
  "mensaje": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "...",
    "usuario": "victor_98",
    "email": "victor@example.com",
    "nombre": "Víctor",
    "rol": "usuario"
  }
}
```

### Recetas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/recetas` | Crear receta (requiere auth) |
| GET | `/api/recetas` | Obtener todas las recetas |
| GET | `/api/recetas/:id` | Obtener detalle de receta |
| GET | `/api/recetas/usuario/:usuarioId` | Obtener recetas de un usuario |
| PUT | `/api/recetas/:id` | Actualizar receta (requiere auth) |
| DELETE | `/api/recetas/:id` | Eliminar receta (requiere auth) |

**Ejemplo de crear receta:**

```json
{
  "nombre": "Ensalada César",
  "descripcionCorta": "Ensalada fresca con pollo y aderezo César",
  "descripcionLarga": "Una deliciosa ensalada con lechuga romana, pollo a la parrilla...",
  "dificultad": "facil",
  "categoria": "almuerzo",
  "tiempoPreparacion": 15,
  "ingredientes": [
    {
      "ingrediente": "507f1f77bcf86cd799439011",
      "cantidad": 200
    }
  ]
}
```

### Favoritos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/favoritos` | Agregar a favoritos (requiere auth) |
| GET | `/api/favoritos` | Obtener mis favoritos (requiere auth) |
| DELETE | `/api/favoritos/:recetaId` | Eliminar de favoritos (requiere auth) |

### Valoraciones

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/valoraciones` | Valorar receta (requiere auth) |
| GET | `/api/valoraciones/:recetaId` | Obtener valoraciones de una receta |
| GET | `/api/valoraciones/:recetaId/usuario` | Mi valoración (requiere auth) |
| PUT | `/api/valoraciones/:id` | Actualizar valoración (requiere auth) |
| DELETE | `/api/valoraciones/:id` | Eliminar valoración (requiere auth) |

**Ejemplo de valoración:**

```json
{
  "recetaId": "507f1f77bcf86cd799439011",
  "puntuacion": 5,
  "comentario": "¡Excelente receta, muy fácil de hacer!"
}
```

### Historial Nutricional

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/historial` | Crear/actualizar historial (requiere auth) |
| GET | `/api/historial` | Obtener historial de una fecha (requiere auth) |
| GET | `/api/historial/rango` | Obtener historial de un rango (requiere auth) |
| DELETE | `/api/historial/:historialId/alimento/:alimentoIndex` | Eliminar alimento (requiere auth) |

## 🔐 Seguridad

### Autenticación

- Se utiliza **JWT** para la autenticación
- El token se envía en el header: `Authorization: Bearer <token>`
- Token válido por 7 días

### Contraseña

Requisitos de contraseña fuerte:
- Mínimo 8 caracteres
- Incluir mayúscula (A-Z)
- Incluir minúscula (a-z)
- Incluir número (0-9)
- Incluir carácter especial (@$!%*?&)

**Ejemplo válido:** `Admin123!`

### Roles

- **usuario**: Usuario estándar
- **nutricionista**: Puede crear recetas oficiales
- **admin**: Acceso total al sistema

## 🗄️ Modelos de Datos

### User

```javascript
{
  usuario: String (unique),
  email: String (unique),
  nombre: String,
  apellidos: String,
  contrasena: String (hasheada),
  foto: String,
  biografia: String,
  rol: 'usuario' | 'nutricionista' | 'admin',
  activo: Boolean,
  timestamps
}
```

### Recipe

```javascript
{
  nombre: String,
  autor: ObjectId (ref User),
  descripcionCorta: String,
  descripcionLarga: String,
  dificultad: 'facil' | 'medio' | 'dificil',
  imagen: String,
  ingredientes: [{
    ingrediente: ObjectId (ref Ingredient),
    cantidad: Number
  }],
  categoria: 'desayuno' | 'almuerzo' | 'cena' | 'snack' | 'postre',
  tiempoPreparacion: Number,
  calorias: Number (auto),
  proteinas: Number (auto),
  grasas: Number (auto),
  carbohidratos: Number (auto),
  esOficial: Boolean,
  puntuacionPromedio: Number,
  totalValorations: Number,
  timestamps
}
```

### Ingredient

```javascript
{
  nombre: String (unique),
  calorias: Number (por 100g),
  unidad: 'g' | 'ml' | 'unidad',
  proteinas: Number,
  grasas: Number,
  carbohidratos: Number,
  descripcion: String,
  timestamps
}
```

### Favorite

```javascript
{
  usuario: ObjectId (ref User),
  receta: ObjectId (ref Recipe),
  timestamps
}
```

### Rating

```javascript
{
  usuario: ObjectId (ref User),
  receta: ObjectId (ref Recipe),
  puntuacion: Number (1-5),
  comentario: String,
  timestamps
}
```

### History

```javascript
{
  usuario: ObjectId (ref User),
  fecha: Date,
  alimentos: [{
    receta: ObjectId (ref Recipe),
    ingrediente: ObjectId (ref Ingredient),
    cantidad: Number,
    calorias: Number,
    hora: String
  }],
  totalCalorias: Number (auto),
  totalProteinas: Number (auto),
  totalGrasas: Number (auto),
  totalCarbohidratos: Number (auto),
  timestamps
}
```

## 📦 Dependencias

- **express**: Framework web
- **mongoose**: ODM para MongoDB
- **bcryptjs**: Encriptación de contraseñas
- **jsonwebtoken**: Autenticación JWT
- **cors**: Control de CORS
- **dotenv**: Variables de entorno
- **validator**: Validación de datos
- **cloudinary**: Almacenamiento de imágenes
- **multer**: Carga de archivos
- **express-async-errors**: Manejo de errores async/await

## 🚀 Despliegue en Render

1. Crear cuenta en [Render](https://render.com)
2. Conectar repositorio GitHub
3. Crear nuevo Web Service
4. Seleccionar rama `main`
5. Configurar variables de entorno
6. Deploy automático

## 📝 Notas

- Las calorías se calculan automáticamente basándose en los ingredientes
- Solo un usuario puede tener un historial por fecha
- Un usuario solo puede valorar una receta una vez
- Las contraseñas se encriptan con bcryptjs
- CORS configurado solo desde Vercel en producción

## 👨‍💻 Autor

Victor Manuel Ridao Chaves

## 📄 Licencia

MIT

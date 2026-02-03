# Gestor de Notas - React

## Descripción

Aplicación web de una sola página (SPA) desarrollada en **React** que permite crear, visualizar y eliminar notas de forma sencilla. La aplicación ha sido desplegada en **Vercel** para demostrar el proceso completo de desarrollo y despliegue.

## Despliegue en Vercel

**URL Pública:** [https://gestor-notas-despliegue.vercel.app](https://gestor-notas-despliegue.vercel.app)

## Instalación y Ejecución Local

### Requisitos previos
- Node.js 16 o superior
- npm o yarn

### Pasos de instalación

```
# 1. Clonar el repositorio (si aún no lo has hecho)
git clone https://github.com/victormanuel-98/2-DAW.git
cd 2-DAW/despliegue/t2/tareaDespliegueVercel/react-api-app

# 2. Instalar dependencias
npm install

# 3. Ejecutar en modo desarrollo
npm run dev

# 4. Abrir en el navegador
# La aplicación estará disponible en http://localhost:5173/
```

### Compilar para producción

```
npm run build

# Los archivos compilados estarán en la carpeta "dist"
```

## Funcionalidades

### 1. Añadir Notas
- Escribe tu nota en el campo de texto
- Haz clic en el botón "Añadir Nota"
- La nota se añade a la lista con fecha y hora automáticas

### 2. Ver Notas Creadas
- Las notas se muestran en una lista ordenada
- Cada nota muestra el texto y la fecha/hora de creación
- Se actualiza automáticamente al añadir nuevas notas

### 3. Eliminar Notas
- Cada nota tiene un botón "Eliminar"
- Al hacer clic, se elimina instantáneamente de la lista

## Estructura del Proyecto

```
react-api-app/
├── src/
│   ├── App.jsx           # Componente principal con la lógica
│   ├── App.css           # Estilos de la aplicación
│   ├── main.jsx          # Punto de entrada
│   └── index.css         # Estilos globales
├── public/               # Archivos estáticos
├── index.html            # Archivo HTML principal
├── package.json          # Dependencias y scripts
├── vite.config.js        # Configuración de Vite
├── vercel.json           # Configuración de Vercel
└── README.md             # Este archivo
```

## Despliegue en Vercel

### Proceso realizado:

1. **Crear proyecto React** con Vite
2. **Desarrollar la aplicación** con funcionalidades básicas
3. **Subir código a GitHub** en el repositorio existente
4. **Conectar con Vercel** importando el repositorio de GitHub
5. **Especificar Root Directory** como `despliegue/t2/tareaDespliegueVercel/react-api-app`
6. **Vercel detecta automáticamente** que es un proyecto Vite
7. **Despliegue exitoso** con URL pública funcional

Cada vez que hagas un `git push` a GitHub, Vercel redespliega automáticamente la aplicación.

## 🔧 Configuración de Vercel

El archivo `vercel.json` contiene la configuración para Vercel:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
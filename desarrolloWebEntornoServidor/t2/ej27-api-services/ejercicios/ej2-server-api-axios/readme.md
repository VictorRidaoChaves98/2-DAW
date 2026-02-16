# Ejercicio 2: Crear un servicio que consuma una API (CRISIS CORE: FFVII API)

## Tecnologías utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Axios](https://axios-http.com/)
- JSON (formato de datos)

---

## Estructura del proyecto

```

tema27-crisis-core-api/
├── package.json
├── server.js
└── README.md

```

---

## Instalación y ejecución

1. Clonar o descargar el proyecto
2. Instalar dependencias:
```
npm install
````

3. Ejecutar servidor:

```
node server.js
```

4. Acceder desde el navegador:

* Ruta principal: `http://localhost:3000/api/materia`
* Ruta de estado: `http://localhost:3000/api/status`

---

## Rutas implementadas

1. http://localhost:3000/api/materia
```

{
  "page": 1,
  "limit": 5,
  "total": 144,
  "data": [
    {
      "name": "Fire",
      "type": "Magic",
      "description": "Shoots a fireball dealing fire damage."
    },
    {
      "name": "Fira",
      "type": "Magic",
      "description": "Shoots 2 fireballs dealing fire damage."
    },
    {
      "name": "Firaga",
      "type": "Magic",
      "description": "Shoots 3 fireballs dealing fire damage."
    },
    {
      "name": "Blizzard",
      "type": "Magic",
      "description": "Drops a block of ice dealing ice damage and inflicting Stun."
    },
    {
      "name": "Blizzara",
      "type": "Magic",
      "description": "Drops a block of ice dealing ice damage and inflicting Stun."
    }
  ]
}

```
   
3. http://localhost:3000/api/materia?name=fire
```

{
  "page": 1,
  "limit": 5,
  "total": 5,
  "data": [
    {
      "name": "Fire",
      "type": "Magic",
      "description": "Shoots a fireball dealing fire damage."
    },
    {
      "name": "Dark Fire",
      "type": "Magic",
      "description": "Shoots a fireball dealing fire damage and inflicting Poison and Silence."
    },
    {
      "name": "Tri-Fire",
      "type": "Magic",
      "description": "Shoots 3 fireballs dealing fire damage to targets."
    },
    {
      "name": "Fire Blade",
      "type": "Command",
      "description": "Deals fire damage to the target."
    },
    {
      "name": "Hellfire",
      "type": "Independent",
      "description": "Increases the chance of Ifrit appearance on the DMW."
    }
  ]
}

```
5. http://localhost:3000/api/materia?page=2&limit=3
```

{
  "page": 2,
  "limit": 3,
  "total": 144,
  "data": [
    {
      "name": "Blizzard",
      "type": "Magic",
      "description": "Drops a block of ice dealing ice damage and inflicting Stun."
    },
    {
      "name": "Blizzara",
      "type": "Magic",
      "description": "Drops a block of ice dealing ice damage and inflicting Stun."
    },
    {
      "name": "Blizzaga",
      "type": "Magic",
      "description": "Drops a block of ice dealing ice damage and inflicting Stun."
    }
  ]
}

```
7. http://localhost:3000/api/materia?name=fire&page=1&limit=2
```

{
  "page": 1,
  "limit": 2,
  "total": 5,
  "data": [
    {
      "name": "Fire",
      "type": "Magic",
      "description": "Shoots a fireball dealing fire damage."
    },
    {
      "name": "Dark Fire",
      "type": "Magic",
      "description": "Shoots a fireball dealing fire damage and inflicting Poison and Silence."
    }
  ]
}

```
9. http://localhost:3000/api/status
```

{
  "Status": "OK"
}

```

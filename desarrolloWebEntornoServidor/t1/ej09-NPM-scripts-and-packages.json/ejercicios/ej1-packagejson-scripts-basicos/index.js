// Realizar un package.json con los script básicos de los ejemplos

// 1. Ejemplo de package.json

/*{
    "name": "test",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "scripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
        "chalk": "^1.0.0"
    },
    "devDependencies": {
        "nodemon": "^1.0.0"
    }
}*/

// 2. Automatizar distintos tipos de arranque

/*{
    ...,
    "sripts": {
        "start": "node index.js",
        "dev": "nodemon index.js",
    },
    ...
}*/

// 3. Automatizar limpieza del proyecto

//{}
//    ...,
//    "scripts": {
//        "clear modules": "rimraf **/node_modules",
//        "clear:locks": "rimraf **/package-lock.json",
//        "clear": "npm run clear:modules && npm run clear:locks && npm run
//        clear:modules",
//    },
//    ...
//    }

// 4. Automatizar gestión de variables de entorno con .env

//{
//...,
//    "scripts": {
//        "clear:env": "rimraf **/.env",
//            "copy:env": "for d in workspaces/*; do cp ${d}/.env.template ${d}/.
//
//        env; done",
//
//    },
//...
//}



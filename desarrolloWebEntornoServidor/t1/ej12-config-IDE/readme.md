## Enlace de interés

https://lenguajejs.com/javascript/calidad-de-codigo/eslint/

## Se pide:

### Ejercicio 1

Configurar un proyecto Node.js para que **detecte los errores de estilo de código** utilizando ESLint.

### Ejercicio 2

Detectar y **arreglar malas prácticas y estilos** en el código con ESLint, aplicando la guía de Airbnb.

### Ejercicio 3

Analizar el siguiente código con ESLint y observar los errores detectados:

```js
const chalk = require('chalk'); 

var youShouldNeverUseVar = "This is my very long line that eslint should check as an error ............................................";

function myFunction(used, nonUsed){ 
  if(used){ 
    console.log(used) 
    return 
  } 
} 

module.exports = nonExistingVar; 
```

### Ejercicio 4

**Corrección del código** según la guía de estilo de Airbnb:

```js
const chalk = require('chalk');

const message = 'This is my very long line that eslint should check as an error.';

function myFunction(used) {
  if (used) {
    console.log(chalk.green(used));
  }
}

module.exports = message;
```
## Proyecto adicional

Aplicar la configuración de **Nodemon**, **ESLint** y **VSCode** al proyecto de **gestor de notas**:

* Añadir el script `"dev": "nodemon index.js"` en `package.json`.
* Configurar `.eslintrc.json` con reglas personalizadas.
* Crear un archivo `.vscode/launch.json` para depuración.

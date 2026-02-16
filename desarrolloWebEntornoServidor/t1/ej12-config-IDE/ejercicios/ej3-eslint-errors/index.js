// simplemente es ver los errores de este código, lo siguiente viene en el ejercicio 4

const chalk = require('chalk');

var youShouldNeverUseVar = "This is my very long line that eslint 
should check as an error
............................................";

function myFunction(used, nonUsed) {
    if (used) {
        console.log(used)
        return
    }
}

module.exports = nonExistingVar;

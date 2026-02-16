/* eslint-disable no-unused-vars */
const chalk = require('chalk');

const youShouldNeverUseVar = 'This is my very long line that eslint '
    + 'should check as an error ............................................';

function myFunction(used, nonUsed) {
  if (used) {
    console.log(used);
  }
}

const nonExistingVar = 'Exported value';
module.exports = nonExistingVar;

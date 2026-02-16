const app = require('./app');

const PORT = process.env.PORT || 3000;

function start() {
  app.listen(PORT, () => {
    console.log(`Backend corriendo en http://localhost:${PORT}`);
  });
}

if (require.main === module) {
  start();
}

module.exports = { start };

const express = require("express");
const loadServer = require("./loaders/loadServer");

const app = express();
loadServer(app);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

const express = require("express");
const app = express();
const usersRouter = require("./src/routes/users.routes");

app.use(express.json());
app.use(require("helmet")());
app.use(require("morgan")("dev"));

app.set("json spaces", 2);
app.use("/users", usersRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

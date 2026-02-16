
import express from "express";
import path from "path";
import materiaRoutes from "./routes/materia.routes.js";
import morgan from "morgan";
import logger from "./utils/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";

const app = express();

// Serve static UI from ./public (moved into src/public)
const staticPath = path.join(process.cwd(), "src", "public");
app.use(express.static(staticPath));
app.get('/', (req, res) => res.sendFile(path.join(staticPath, "index.html")));

// Middlewares
app.use(express.json());
app.use(morgan("combined", {
    stream: {
        write: message => logger.info(message.trim())
    }
}));

// Rutas
app.use("/api/materia", materiaRoutes);

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware global de errores
app.use(errorHandler);

export default app;

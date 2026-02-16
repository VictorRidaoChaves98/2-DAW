import express from "express";
import notasRoutes from "./routes/notas.routes.js";
import morgan from "morgan";
import logger from "./utils/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(morgan("combined", {
    stream: {
        write: message => logger.info(message.trim())
    }
}));

// Rutas
app.use("/api/notas", notasRoutes);
app.use("/api/auth", authRoutes);

// Middleware global de errores
app.use(errorHandler);

export default app;

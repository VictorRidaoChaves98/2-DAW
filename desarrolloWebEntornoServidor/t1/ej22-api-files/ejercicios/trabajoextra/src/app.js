
import express from "express";
import path from "path";
import notasRoutes from "./routes/notas.routes.js";
import filesRoutes from "./routes/files.routes.js";
import morgan from "morgan";
import logger from "./utils/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";

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
app.use("/api/notas", notasRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/files", filesRoutes);

// Middleware global de errores
app.use(errorHandler);

export default app;

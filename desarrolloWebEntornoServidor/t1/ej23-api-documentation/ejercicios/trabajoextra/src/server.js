import { config } from './config/env.js';
import app from "./app.js";
import logger from "./utils/logger.js";

const PORT = config.PORT;

app.listen(PORT, () => {
    logger.info(`Servidor en http://localhost:${PORT}`);
});

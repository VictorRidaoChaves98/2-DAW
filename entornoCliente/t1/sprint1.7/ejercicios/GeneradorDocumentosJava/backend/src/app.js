const express = require("express");
const cors = require("cors");
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const analyzeRoutes = require("./routes/analyze.routes");
const historyRoutes = require("./routes/history.routes");
const docsRoutes = require("./routes/docs.routes");

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '5mb' }));

// Basic rate limiter
const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 60 });
app.use(limiter);

// Serve frontend static files if present
const path = require('path');
const frontendDir = path.join(__dirname, '..', 'frontend');
if (require('fs').existsSync(frontendDir)) {
	app.use(express.static(frontendDir));
	// fallback to index.html for SPA
	app.get('/', (req, res) => res.sendFile(path.join(frontendDir, 'index.html')));
} else {
	app.get('/', (req, res) => {
		res.send('API Generador de Documentación Java funcionando');
	});
}

app.use("/api/analyze", analyzeRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/docs", docsRoutes);

module.exports = app;






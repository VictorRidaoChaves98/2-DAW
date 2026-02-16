const express = require('express');
const emailRoutes = require('./routes/email.routes');

const app = express();
app.use(express.json());

// Rutas
app.use('/api/email', emailRoutes);

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ 
        message: 'API de Email SMTP',
        endpoints: {
            send: 'POST /api/email/send',
            status: 'GET /api/email/status'
        }
    });
});

module.exports = app;

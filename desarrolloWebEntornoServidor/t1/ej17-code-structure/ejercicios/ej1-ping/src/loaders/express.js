const express = require('express');
const pingRoutes = require('../routes/ping');

module.exports = (app) => {
    app.use(express.json());
    app.use('/api', pingRoutes);

    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ message: 'Not Found' });
    });
};

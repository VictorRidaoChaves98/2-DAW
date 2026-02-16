const express = require('express');
const expressLoader = require('./loaders/express');

function createApp() {
    const app = express();
    expressLoader(app);
    return app;
}

module.exports = createApp();

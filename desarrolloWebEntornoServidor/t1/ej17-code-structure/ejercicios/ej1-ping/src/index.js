const app = require('./app');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // Mensaje simple para saber que está funcionando
    console.log(`Server listening on port ${PORT}`);
});

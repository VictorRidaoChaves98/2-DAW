require('dotenv').config();
const app = require('./app');
const emailService = require('./services/email.service');

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, PORT = 3000 } = process.env;

emailService.createTransport({
    host: SMTP_HOST || '127.0.0.1',
    port: Number(SMTP_PORT) || 1025,
    user: SMTP_USER || 'test@example.com',
    pass: SMTP_PASS || ''
});

app.listen(PORT, () => {
    console.log(`API escuchando en http://localhost:${PORT}`);
});
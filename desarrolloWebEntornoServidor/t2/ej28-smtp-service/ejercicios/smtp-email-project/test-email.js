const http = require('http');

const emailData = {
    to: 'test@ejemplo.com',
    subject: 'Email de Prueba',
    text: 'Este es un email de prueba',
    html: '<h1>Email de prueba</h1><p>Funciona correctamente</p>'
};

const data = JSON.stringify(emailData);

console.log('Datos a enviar:', emailData);
console.log('Enviando email...');

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/email/send',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

const req = http.request(options, (res) => {
    let body = '';
    
    console.log('Status:', res.statusCode, res.statusMessage);
    
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('Respuesta del servidor:', body);
        
        try {
            const response = JSON.parse(body);
            if (response.success) {
                console.log('Email enviado. MessageId:', response.messageId);
                console.log('Ver en http://localhost:8025');
            } else {
                console.error('Error:', response.error);
            }
        } catch (e) {
            console.error('No se pudo parsear la respuesta JSON');
            console.error('Respuesta cruda:', body);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Error de conexión:', error.message);
});

req.write(data);
req.end();

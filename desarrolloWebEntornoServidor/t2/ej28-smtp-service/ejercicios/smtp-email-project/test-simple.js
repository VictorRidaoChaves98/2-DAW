const http = require('http');

const data = JSON.stringify({
    to: 'test@ejemplo.com',
    subject: 'Test Email',
    text: 'Este es un email de prueba',
    html: '<h1>Email de prueba</h1><p>¡Funciona correctamente!</p>'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/email/send',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('🚀 Enviando email de prueba...\n');

const req = http.request(options, (res) => {
    let body = '';

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('Status Code:', res.statusCode);
        console.log('Respuesta:', body);
        
        try {
            const response = JSON.parse(body);
            if (response.success) {
                console.log('\n✅ Email enviado exitosamente!');
                console.log('📧 Message ID:', response.messageId);
                console.log('\n📬 Abre Mailhog para ver el email:');
                console.log('   http://localhost:8025\n');
            } else {
                console.error('\n❌ Error:', response.error);
            }
        } catch (e) {
            console.error('Error parseando respuesta:', e.message);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Asegúrate de que:');
    console.log('   1. Mailhog esté ejecutándose: docker-compose up -d');
    console.log('   2. El servidor API esté ejecutándose: npm start\n');
});

req.write(data);
req.end();

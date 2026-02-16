const emailClient = require('../sdk/email');

async function main() {
    console.log('Probando el SDK de Email...');

    try {
        // Configurar el cliente para usar Mailhog
        emailClient.configureMailhog();

        const isValid = await emailClient.verify();
        
        if (!isValid) {
            throw new Error('La configuración del cliente no es válida');
        }
        console.log('Configuración válida');

        const result = await emailClient.send({
            from: 'sdk-test@ejemplo.com',
            to: 'destinatario@ejemplo.com',
            subject: 'Prueba del SDK de Email',
            text: 'Este es un email enviado usando el SDK',
            html: '<h1>SDK de Email</h1><p>Prueba de envío usando el SDK.</p>'
        });

        console.log('Email enviado. MessageId:', result.messageId);
        console.log('Ver en http://localhost:8025');

        console.log('Enviando múltiples emails...');
        const recipients = ['user1@test.com', 'user2@test.com', 'user3@test.com'];
        
        for (const recipient of recipients) {
            await emailClient.send({
                from: 'sdk-test@ejemplo.com',
                to: recipient,
                subject: `Email para ${recipient}`,
                text: `Hola ${recipient}, este es un email personalizado`,
                html: `<p>Hola <strong>${recipient}</strong>, este es un email personalizado</p>`
            });
            console.log(`Email enviado a ${recipient}`);
        }
        console.log('Todos los emails enviados.');

    } catch (error) {
        console.error('Error:', error.message);
        console.log('Asegúrate de que Mailhog esté ejecutándose (docker-compose up -d).');
    }
}

main().catch(console.error);

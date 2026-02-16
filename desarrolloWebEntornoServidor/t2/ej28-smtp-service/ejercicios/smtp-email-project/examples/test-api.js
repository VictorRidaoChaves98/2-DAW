async function testAPI() {
    const API_URL = 'http://localhost:3000';

    console.log('Probando la API REST de Email...');

    try {
        console.log('Verificando estado del servicio...');
        const statusResponse = await fetch(`${API_URL}/api/email/status`);
        const statusData = await statusResponse.json();
        console.log('Estado:', statusData);

        if (statusData.status !== 'OK') {
            throw new Error('El servicio de email no está listo');
        }

        console.log('Enviando email de prueba...');
        const emailData = {
            to: 'destinatario@ejemplo.com',
            subject: 'Prueba de la API REST',
            text: 'Este es un email de prueba enviado desde la API',
            html: '<h1>API REST de Email</h1><p>Prueba enviada desde la API.</p>'
        };

        const sendResponse = await fetch(`${API_URL}/api/email/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        });

        const sendData = await sendResponse.json();
        
        if (sendData.success) {
            console.log('Email enviado. MessageId:', sendData.messageId);
        } else {
            console.error('Error:', sendData.error);
        }

        console.log('Enviando múltiples emails...');
        const emails = [
            {
                to: 'admin@ejemplo.com',
                subject: 'Notificación para Admin',
                text: 'Este es un mensaje para el administrador',
                html: '<h2>Mensaje para Admin</h2><p>Este es un mensaje para el administrador</p>'
            },
            {
                to: 'user@ejemplo.com',
                subject: 'Bienvenido',
                text: 'Bienvenido a nuestra plataforma',
                html: '<h2>¡Bienvenido!</h2><p>Gracias por registrarte</p>'
            },
            {
                to: 'support@ejemplo.com',
                subject: 'Ticket de soporte',
                text: 'Nueva solicitud de soporte',
                html: '<h2>Nuevo Ticket</h2><p>Se ha creado una nueva solicitud</p>'
            }
        ];

        for (const email of emails) {
            const response = await fetch(`${API_URL}/api/email/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(email)
            });
            
            const data = await response.json();
            if (data.success) {
                console.log(`Email enviado a ${email.to}`);
            }
        }

        console.log('Pruebas completadas. Ver en http://localhost:8025');

    } catch (error) {
        console.error('Error:', error.message);
        console.log('Asegúrate de que Mailhog y la API estén ejecutándose.');
    }
}

testAPI().catch(console.error);

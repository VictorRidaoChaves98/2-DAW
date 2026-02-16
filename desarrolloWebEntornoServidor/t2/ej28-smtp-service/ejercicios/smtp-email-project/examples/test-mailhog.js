const nodemailer = require('nodemailer');

async function main() {
    console.log('Iniciando prueba de envío con Mailhog...');

    let transporter = nodemailer.createTransport({
        host: "127.0.0.1",
        port: 1025,
        secure: false,
    });

    const mailOptions = {
        from: 'its@me.com',
        to: "nose@cual.es",
        subject: "Mensaje de prueba desde Mailhog",
        text: "Este es el contenido en texto plano",
        html: '<h1>Hola desde Mailhog</h1><p>Prueba de envío con Nodemailer.</p>',
    };

    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Email enviado. MessageId:', info.messageId);
        console.log('Ver en http://localhost:8025');
    } catch (error) {
        console.error('Error enviando el email:', error.message);
        console.log('Asegúrate de que Mailhog esté ejecutándose (docker-compose up -d).');
    }
}

main().catch(console.error);

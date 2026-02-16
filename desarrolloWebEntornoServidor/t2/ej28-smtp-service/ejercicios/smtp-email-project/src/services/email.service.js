const nodemailer = require('nodemailer');

let configGlobalSMTP = null;
let transporter = null;

function createTransport(configSMTP) {
    configGlobalSMTP = configSMTP;

    const config = {
        host: configSMTP.host,
        port: configSMTP.port,
        secure: false
    };

    if (configSMTP.user && configSMTP.pass) {
        config.auth = { user: configSMTP.user, pass: configSMTP.pass };
    }

    transporter = nodemailer.createTransport(config);
    transporter.verify((err) => {
        if (err) console.error('Error verificando SMTP:', err.message);
        else console.log('SMTP listo para enviar');
    });

    return transporter;
}

async function send({ message }) {
    if (!transporter || !configGlobalSMTP) {
        const err = new Error('Servicio SMTP no configurado');
        err.responseCode = 500;
        throw err;
    }

    const info = await transporter.sendMail({
        from: configGlobalSMTP.user,
        ...message
    });

    console.log('Mensaje enviado:', info.messageId);
    return info;
}

function getTransporter() {
    return transporter;
}

module.exports = { createTransport, send, getTransporter };

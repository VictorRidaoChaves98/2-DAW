const nodemailer = require('nodemailer');

class EmailClient {
    constructor() {
        this.transporter = null;
        this.config = null;
    }

    configure(config) {
        this.config = config;
        
        if (config.service) {
            this.transporter = nodemailer.createTransport({
                service: config.service,
                secure: false,
                auth: {
                    user: config.user,
                    pass: config.pass
                }
            });
        } else {
            this.transporter = nodemailer.createTransport({
                host: config.host,
                port: config.port,
                secure: false,
                auth: config.user && config.pass ? {
                    user: config.user,
                    pass: config.pass
                } : undefined
            });
        }

        this.transporter.verify((error) => {
            if (error) console.error('Error al verificar SMTP:', error.message);
            else console.log('Cliente SMTP listo');
        });
    }

    configureMailhog(host = '127.0.0.1', port = 1025) {
        this.configure({
            host,
            port
        });
    }

    configureGmail(user, pass) {
        this.configure({
            service: 'gmail',
            user,
            pass
        });
    }

    async send(message) {
        if (!this.transporter) {
            throw new Error('Cliente de email no configurado. Llama a configure() primero');
        }

        try {
            const info = await this.transporter.sendMail(message);
            console.log('Mensaje enviado: %s', info.messageId);
            return info;
        } catch (error) {
            console.error('Error al enviar email:', error);
            throw error;
        }
    }

    async verify() {
        if (!this.transporter) {
            throw new Error('Cliente de email no configurado');
        }

        try {
            await this.transporter.verify();
            return true;
        } catch (error) {
            console.error('Error al verificar cliente de email:', error);
            return false;
        }
    }
}

module.exports = EmailClient;


const express = require('express');
const router = express.Router();
const emailService = require('../services/email.service');

router.post('/send', async (req, res) => {
    try {
        const { to, subject, text, html } = req.body;

        if (!to || !subject) {
            return res.status(400).json({
                error: 'Los campos "to" y "subject" son obligatorios'
            });
        }

        if (!text && !html) {
            return res.status(400).json({
                error: 'Debe proporcionar al menos "text" o "html"'
            });
        }

        const message = {
            to,
            subject,
            text,
            html
        };

        const info = await emailService.send({ message });

        res.status(200).json({
            success: true,
            messageId: info.messageId,
            message: 'Email enviado correctamente'
        });

    } catch (error) {
        console.error('Error en ruta de envío de email:', error);
        res.status(error.responseCode || 500).json({
            success: false,
            error: error.message || 'Error al enviar el email'
        });
    }
});
router.get('/status', (req, res) => {
    const transporter = emailService.getTransporter();
    
    if (transporter) {
        res.status(200).json({
            status: 'OK',
            message: 'Servicio de email configurado y listo'
        });
    } else {
        res.status(503).json({
            status: 'ERROR',
            message: 'Servicio de email no configurado'
        });
    }
});

module.exports = router;

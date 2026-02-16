const mongoose = require('mongoose');

// Esquema base para todas las notificaciones
const notificationSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
  },
  { discriminatorKey: 'type', timestamps: true }
);

// Modelo base
const Notification = mongoose.model('Notification', notificationSchema);

// Discriminator para SMS
const SmsNotification = Notification.discriminator(
  'SMS',
  new mongoose.Schema({
    phone: {
      type: String,
      required: true,
    },
    smsProvider: {
      type: String,
      default: 'Twilio',
    },
  })
);

// Discriminator para Email
const EmailNotification = Notification.discriminator(
  'Email',
  new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    htmlContent: {
      type: Boolean,
      default: false,
    },
  })
);

module.exports = {
  Notification,
  SmsNotification,
  EmailNotification,
};

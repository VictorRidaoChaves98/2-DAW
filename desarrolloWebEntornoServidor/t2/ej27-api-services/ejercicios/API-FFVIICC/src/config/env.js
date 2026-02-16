import dotenv from 'dotenv';

// Cargar .env desde la raíz del proyecto
// En tests, Jest ya maneja las variables de entorno via setup
dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  ADMIN_USER: process.env.ADMIN_USER,
  ADMIN_PASS: process.env.ADMIN_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  NOTAS_PER_PAGE_DEFAULT: Number(process.env.NOTAS_PER_PAGE_DEFAULT) || 10
};

console.log('Config loaded:', {
  hasAdminUser: Boolean(config.ADMIN_USER),
  hasAdminPass: Boolean(config.ADMIN_PASS),
  hasJwtSecret: Boolean(config.JWT_SECRET),
  port: config.PORT
});

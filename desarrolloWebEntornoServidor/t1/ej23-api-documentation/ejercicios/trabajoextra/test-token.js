// Test script to verify token generation
import { config } from './src/config/env.js';
import jwt from 'jsonwebtoken';

console.log('Testing token generation...');
console.log('Config:', {
    adminUser: config.ADMIN_USER,
    hasAdminPass: Boolean(config.ADMIN_PASS),
    hasJwtSecret: Boolean(config.JWT_SECRET),
    jwtExpires: config.JWT_EXPIRES_IN
});

if (config.ADMIN_USER && config.ADMIN_PASS && config.JWT_SECRET) {
    const token = jwt.sign(
        { username: config.ADMIN_USER, role: 'admin' },
        config.JWT_SECRET,
        { expiresIn: config.JWT_EXPIRES_IN }
    );
    console.log('\n✓ Token generated successfully!');
    console.log('Token:', token);
    console.log('\nTo use in curl:');
    console.log(`curl -H "Authorization: Bearer ${token}" http://localhost:3000/api/notas`);
} else {
    console.error('\n✗ Missing configuration!');
}

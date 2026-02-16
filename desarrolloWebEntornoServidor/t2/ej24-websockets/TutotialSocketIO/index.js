import express from 'express';
import { createServer } from 'node:http';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('un usuario se conectó');
    socket.on('disconnect', () => {
        console.log('usuario desconectado');
    });
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});

// Mensaje de prueba para todos los usuarios que se conecten
io.emit('hello', 'world');

server.listen(3000, () => {
    console.log('servidor corriendo en http://localhost:3000');
});
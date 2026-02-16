import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import validator from 'validator';

// Validar contraseña fuerte
const esContraseniaFuerte = (contrasena) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(contrasena);
};

export const registrar = async (req, res) => {
    try {
        const { usuario, email, nombre, apellidos, contrasena, rol } = req.body;

        // Validaciones
        if (!usuario || !email || !nombre || !contrasena) {
            return res.status(400).json({ mensaje: 'Todos los campos obligatorios deben ser completados' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ mensaje: 'Email inválido' });
        }

        if (!esContraseniaFuerte(contrasena)) {
            return res.status(400).json({
                mensaje: 'La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y carácter especial (@$!%*?&)',
            });
        }

        // Verificar usuario duplicado
        const usuarioExistente = await User.findOne({ $or: [{ usuario }, { email }] });
        if (usuarioExistente) {
            return res.status(400).json({ mensaje: 'Usuario o email ya registrado' });
        }

        // Crear usuario
        const nuevoUsuario = new User({
            usuario,
            email,
            nombre,
            apellidos,
            contrasena,
            rol: rol || 'usuario',
        });

        await nuevoUsuario.save();

        // Generar token
        const token = jwt.sign(
            { id: nuevoUsuario._id, usuario: nuevoUsuario.usuario, rol: nuevoUsuario.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            token,
            usuario: {
                id: nuevoUsuario._id,
                usuario: nuevoUsuario.usuario,
                email: nuevoUsuario.email,
                nombre: nuevoUsuario.nombre,
                rol: nuevoUsuario.rol,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el registro', error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        if (!usuario || !contrasena) {
            return res.status(400).json({ mensaje: 'Usuario y contraseña requeridos' });
        }

        // Buscar usuario
        const usuarioEncontrado = await User.findOne({ $or: [{ usuario }, { email: usuario }] }).select('+contrasena');
        if (!usuarioEncontrado) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }

        // Verificar contraseña
        const esValida = await usuarioEncontrado.compararContrasena(contrasena);
        if (!esValida) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }

        // Generar token
        const token = jwt.sign(
            { id: usuarioEncontrado._id, usuario: usuarioEncontrado.usuario, rol: usuarioEncontrado.rol },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(200).json({
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuarioEncontrado._id,
                usuario: usuarioEncontrado.usuario,
                email: usuarioEncontrado.email,
                nombre: usuarioEncontrado.nombre,
                rol: usuarioEncontrado.rol,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el login', error: error.message });
    }
};

export const verificarToken = async (req, res) => {
    try {
        const usuario = await User.findById(req.usuario.id);
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.status(200).json({
            valido: true,
            usuario: {
                id: usuario._id,
                usuario: usuario.usuario,
                email: usuario.email,
                nombre: usuario.nombre,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al verificar token', error: error.message });
    }
};

// Obtener perfil de usuario por ID
export const obtenerPerfil = async (req, res) => {
    try {
        const { id } = req.params;

        const usuario = await User.findById(id).select('-contrasena');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.status(200).json({
            usuario: {
                id: usuario._id,
                usuario: usuario.usuario,
                email: usuario.email,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                telefono: usuario.telefono,
                foto: usuario.foto,
                rol: usuario.rol,
                notificaciones: usuario.notificaciones,
                visibilidad: usuario.visibilidad,
                createdAt: usuario.createdAt,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener perfil', error: error.message });
    }
};

// Actualizar perfil de usuario
export const actualizarPerfil = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, apellidos, email, telefono, foto, notificaciones, visibilidad, contrasenaActual, contrasenaNueva } = req.body;

        // Verificar que el usuario autenticado es el mismo o es admin
        if (req.usuario.id !== id && req.usuario.rol !== 'admin') {
            return res.status(403).json({ mensaje: 'No autorizado para modificar este perfil' });
        }

        const usuario = await User.findById(id).select('+contrasena');
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        // Actualizar campos básicos
        if (nombre !== undefined) usuario.nombre = nombre;
        if (apellidos !== undefined) usuario.apellidos = apellidos;
        if (telefono !== undefined) usuario.telefono = telefono;
        if (foto !== undefined) usuario.foto = foto;
        if (notificaciones !== undefined) usuario.notificaciones = notificaciones;
        if (visibilidad !== undefined) usuario.visibilidad = visibilidad;

        // Actualizar email (validar que no exista)
        if (email !== undefined && email !== usuario.email) {
            if (!validator.isEmail(email)) {
                return res.status(400).json({ mensaje: 'Email inválido' });
            }
            const emailExistente = await User.findOne({ email });
            if (emailExistente) {
                return res.status(400).json({ mensaje: 'Email ya registrado' });
            }
            usuario.email = email;
        }

        // Cambiar contraseña si se proporciona
        if (contrasenaNueva) {
            if (!contrasenaActual) {
                return res.status(400).json({ mensaje: 'Contraseña actual requerida' });
            }

            const esValida = await usuario.compararContrasena(contrasenaActual);
            if (!esValida) {
                return res.status(401).json({ mensaje: 'Contraseña actual incorrecta' });
            }

            if (!esContraseniaFuerte(contrasenaNueva)) {
                return res.status(400).json({
                    mensaje: 'La contraseña debe tener al menos 8 caracteres, incluir mayúscula, minúscula, número y carácter especial',
                });
            }

            usuario.contrasena = contrasenaNueva;
        }

        await usuario.save();

        res.status(200).json({
            mensaje: 'Perfil actualizado exitosamente',
            usuario: {
                id: usuario._id,
                usuario: usuario.usuario,
                email: usuario.email,
                nombre: usuario.nombre,
                apellidos: usuario.apellidos,
                telefono: usuario.telefono,
                foto: usuario.foto,
                rol: usuario.rol,
            },
        });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al actualizar perfil', error: error.message });
    }
};

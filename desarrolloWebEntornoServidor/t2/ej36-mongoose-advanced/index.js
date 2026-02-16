const mongoose = require('mongoose');
const { Notification, SmsNotification, EmailNotification } = require('./models/notification');
const User = require('./models/user');
const Color = require('./models/color');
const { ComplexSchema, Author } = require('./models/complexSchema');

// Conexión a MongoDB
const MONGO_URI = 'mongodb://localhost:27017/tema36-mongoose';

async function connectDB() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar a MongoDB:', error.message);
    process.exit(1);
  }
}

// ============================================================
// EJERCICIO 1: DISCRIMINATORS
// ============================================================
async function ejercicio1_Discriminators() {
  console.log('\n========== EJERCICIO 1: DISCRIMINATORS ==========\n');

  try {
    // Limpiar colección
    await Notification.deleteMany({});

    // Crear una notificación SMS
    const smsNotif = await SmsNotification.create({
      message: 'Tu código de verificación es 123456',
      recipient: 'Usuario 1',
      phone: '+34 600 123 456',
      smsProvider: 'Twilio',
    });

    console.log('📱 SMS Notification creada:');
    console.log(smsNotif);

    // Crear una notificación Email
    const emailNotif = await EmailNotification.create({
      message: 'Bienvenido a nuestra plataforma',
      recipient: 'usuario@example.com',
      email: 'usuario@example.com',
      subject: 'Bienvenido',
      htmlContent: true,
    });

    console.log('\n📧 Email Notification creada:');
    console.log(emailNotif);

    // Obtener todas las notificaciones
    const allNotifications = await Notification.find();
    console.log('\n📬 Todas las notificaciones:');
    console.log(allNotifications);

    console.log('\n✅ Ejercicio 1 completado\n');
  } catch (error) {
    console.error('❌ Error en Ejercicio 1:', error.message);
  }
}

// ============================================================
// EJERCICIO 2: HOOKS
// ============================================================
async function ejercicio2_Hooks() {
  console.log('========== EJERCICIO 2: HOOKS ==========\n');

  try {
    // Limpiar colección
    await User.deleteMany({});

    // Crear usuario con email en mayúsculas y nombre desordenado
    console.log('📝 Creando usuario con datos sin normalizar:');
    const user1 = await User.create({
      name: 'juan PÉREZ garcía',
      email: 'JUAN@EXAMPLE.COM',
      age: 28,
      role: 'user',
    });

    console.log('\n🔄 Usuario después de los hooks (email normalizado y nombre capitalizado):');
    console.log(user1);

    // Crear otro usuario
    console.log('\n📝 Creando segundo usuario:');
    const user2 = await User.create({
      name: 'maría GARCÍA López',
      email: 'MARIA@EXAMPLE.COM',
      age: 34,
      role: 'admin',
    });

    console.log('\n🔄 Segundo usuario normalizado:');
    console.log(user2);

    // Verificar que los emails están en minúsculas
    const users = await User.find();
    console.log('\n📋 Todos los usuarios (verificar normalización):');
    users.forEach((user) => {
      console.log(`- ${user.name} (${user.email})`);
    });

    console.log('\n✅ Ejercicio 2 completado\n');
  } catch (error) {
    console.error('❌ Error en Ejercicio 2:', error.message);
  }
}

// ============================================================
// EJERCICIO 3: VALIDACIONES
// ============================================================
async function ejercicio3_Validaciones() {
  console.log('========== EJERCICIO 3: VALIDACIONES ==========\n');

  try {
    // Limpiar colección
    await Color.deleteMany({});

    // Crear color válido
    console.log('✅ Intentando crear color válido (selectedColor dentro de colorList):');
    const color1 = await Color.create({
      name: 'Mi paleta de colores',
      colorList: ['red', 'blue', 'green', 'yellow'],
      selectedColor: 'blue',
    });

    console.log(color1);
    console.log('✅ Color válido creado exitosamente');

    // Intentar crear color inválido
    console.log('\n❌ Intentando crear color inválido (selectedColor NO en colorList):');
    try {
      const color2 = await Color.create({
        name: 'Paleta inválida',
        colorList: ['red', 'green'],
        selectedColor: 'purple', // No está en colorList
      });
      console.log(color2);
    } catch (validationError) {
      console.log('❌ Validación fallida (esperado):');
      console.log(`   Mensaje: ${validationError.errors.selectedColor.message}`);
    }

    // Crear otro color válido
    console.log('\n✅ Creando segundo color válido:');
    const color3 = await Color.create({
      name: 'Colores personalizados',
      colorList: ['orange', 'purple', 'pink'],
      selectedColor: 'orange',
    });

    console.log(color3);

    // Obtener todos los colores
    const allColors = await Color.find();
    console.log('\n🎨 Todos los colores válidos guardados:');
    allColors.forEach((col) => {
      console.log(`- ${col.name}: ${col.selectedColor} (disponibles: ${col.colorList.join(', ')})`);
    });

    console.log('\n✅ Ejercicio 3 completado\n');
  } catch (error) {
    console.error('❌ Error en Ejercicio 3:', error.message);
  }
}

// ============================================================
// EJERCICIO 4: TIPOS AVANZADOS DE SCHEMA
// ============================================================
async function ejercicio4_TiposAvanzados() {
  console.log('========== EJERCICIO 4: TIPOS AVANZADOS ==========\n');

  try {
    // Limpiar colecciones
    await Author.deleteMany({});
    await ComplexSchema.deleteMany({});

    // Crear un autor
    console.log('👤 Creando un autor:');
    const author = await Author.create({
      name: 'J.K. Rowling',
      email: 'jk@example.com',
    });
    console.log(author);

    // Crear documento con tipos avanzados
    console.log('\n📚 Creando documento con tipos avanzados:');
    const complexDoc = await ComplexSchema.create({
      title: 'Harry Potter and the Philosopher\'s Stone',
      tags: ['fantasy', 'magic', 'adventure', 'young-adult'],
      ratings: [5, 4.5, 5, 4, 4.5],
      metadata: {
        views: 1000000,
        likes: 50000,
        comments: 5000,
      },
      reviews: [
        {
          author: 'Alice',
          rating: 5,
          comment: 'Excelente libro, muy entretenido',
        },
        {
          author: 'Bob',
          rating: 4,
          comment: 'Bueno pero algo predecible',
        },
      ],
      properties: new Map([
        ['genre', 'Fantasy'],
        ['language', 'English'],
        ['publisher', 'Bloomsbury'],
      ]),
      authorId: author._id,
      extraData: {
        isbn: '9780747532699',
        pages: 309,
        publicationYear: 1997,
      },
    });

    console.log(complexDoc);

    // Obtener documento con populate
    console.log('\n🔍 Recuperando documento con populate (referencia al autor):');
    const complexDocWithAuthor = await ComplexSchema.findById(complexDoc._id).populate('authorId');
    console.log('Título:', complexDocWithAuthor.title);
    console.log('Autor:', complexDocWithAuthor.authorId.name);
    console.log('Tags:', complexDocWithAuthor.tags);
    console.log('Ratings:', complexDocWithAuthor.ratings);
    console.log('Metadata:', complexDocWithAuthor.metadata);
    console.log('Reviews:', complexDocWithAuthor.reviews);
    console.log('Properties (Map):', Object.fromEntries(complexDocWithAuthor.properties));
    console.log('Extra data (Mixed):', complexDocWithAuthor.extraData);

    // Crear otro documento
    console.log('\n📚 Creando segundo documento:');
    const author2 = await Author.create({
      name: 'George R.R. Martin',
      email: 'grrm@example.com',
    });

    const complexDoc2 = await ComplexSchema.create({
      title: 'A Game of Thrones',
      tags: ['fantasy', 'medieval', 'drama', 'political'],
      ratings: [4.5, 4, 5, 4.5],
      metadata: {
        views: 500000,
        likes: 25000,
        comments: 3000,
      },
      reviews: [
        {
          author: 'Charlie',
          rating: 5,
          comment: 'Épico y emocionante',
        },
      ],
      properties: new Map([
        ['genre', 'Fantasy'],
        ['language', 'English'],
        ['publisher', 'Bantam Books'],
      ]),
      authorId: author2._id,
      extraData: {
        isbn: '9780553386790',
        pages: 694,
        publicationYear: 1996,
      },
    });

    console.log(complexDoc2);

    // Obtener todos los documentos
    console.log('\n📚 Todos los documentos con tipos avanzados:');
    const allComplexDocs = await ComplexSchema.find().populate('authorId');
    allComplexDocs.forEach((doc) => {
      console.log(`\n📖 ${doc.title}`);
      console.log(`   Autor: ${doc.authorId.name}`);
      console.log(`   Tags: ${doc.tags.join(', ')}`);
      console.log(`   Promedio de ratings: ${(doc.ratings.reduce((a, b) => a + b, 0) / doc.ratings.length).toFixed(2)}`);
      console.log(`   Vistas: ${doc.metadata.views}`);
    });

    console.log('\n✅ Ejercicio 4 completado\n');
  } catch (error) {
    console.error('❌ Error en Ejercicio 4:', error.message);
  }
}

// ============================================================
// FUNCIÓN PRINCIPAL
// ============================================================
async function main() {
  await connectDB();

  await ejercicio1_Discriminators();
  await ejercicio2_Hooks();
  await ejercicio3_Validaciones();
  await ejercicio4_TiposAvanzados();

  console.log('========================================');
  console.log('✅ TODOS LOS EJERCICIOS COMPLETADOS');
  console.log('========================================\n');

  await mongoose.connection.close();
  console.log('✅ Conexión a MongoDB cerrada');
}

// Ejecutar
main().catch((error) => {
  console.error('Error fatal:', error.message);
  process.exit(1);
});

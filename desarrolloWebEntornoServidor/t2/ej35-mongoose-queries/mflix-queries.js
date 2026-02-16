import mongoose from 'mongoose';

// ================== CONFIGURACIÓN DE MODELOS ==================

// Schema de Movie
const movieSchema = new mongoose.Schema(
    {
        title: String,
        genres: [String],
        year: Number,
        rated: String,
        type: String
    },
    { collection: 'movies', strict: false }
);

// Schema de Comment con referencia a Movie
const commentSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        text: String,
        movie_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Movie'
        },
        date: Date
    },
    { collection: 'comments', strict: false }
);

const Movie = mongoose.model('Movie', movieSchema);
const Comment = mongoose.model('Comment', commentSchema);


// ================== 1. POPULATE: Comentario con datos de la película ==================

async function comentarioConPelicula() {
    console.log('\n========== 1. COMENTARIO CON PELÍCULA (POPULATE) ==========\n');
    
    // Buscar un comentario y poblar la información de la película
    const comentario = await Comment
        .findOne()
        .populate({
            path: 'movie_id',
            select: 'title genres year rated type' // Solo seleccionar estos campos
        });
    
    if (!comentario) {
        console.log('No se encontró ningún comentario');
        return;
    }
    
    console.log('📝 Comentario:');
    console.log(`  Nombre: ${comentario.name}`);
    console.log(`  Email: ${comentario.email}`);
    console.log(`  Fecha: ${comentario.date}`);
    console.log(`  Texto: ${comentario.text.substring(0, 100)}...`);
    
    console.log('\n🎬 Película referenciada:');
    if (comentario.movie_id) {
        console.log(`  Título: ${comentario.movie_id.title}`);
        console.log(`  Géneros: ${comentario.movie_id.genres?.join(', ')}`);
        console.log(`  Año: ${comentario.movie_id.year}`);
        console.log(`  Clasificación: ${comentario.movie_id.rated}`);
        console.log(`  Tipo: ${comentario.movie_id.type}`);
    } else {
        console.log('  (Película no encontrada)');
    }
    
    console.log('\n' + '='.repeat(60));
}


// ================== 2. AGGREGATE LOOKUP: Película con todos sus comentarios ==================

async function peliculaConComentarios() {
    console.log('\n========== 2. PELÍCULA CON COMENTARIOS (AGGREGATE $LOOKUP) ==========\n');
    
    // Buscar una película que tenga comentarios
    const resultado = await Movie.aggregate([
        // Stage 1: Buscar películas con comentarios
        {
            $lookup: {
                from: 'comments',              // Colección a unir
                localField: '_id',             // Campo de Movie
                foreignField: 'movie_id',      // Campo de Comment que referencia a Movie
                as: 'comentarios'              // Nombre del array resultante
            }
        },
        // Stage 2: Filtrar solo películas que tengan comentarios
        {
            $match: {
                'comentarios.0': { $exists: true }  // Array no vacío
            }
        },
        // Stage 3: Proyectar solo los campos requeridos
        {
            $project: {
                title: 1,
                genres: 1,
                year: 1,
                rated: 1,
                type: 1,
                comentarios: {
                    name: 1,
                    email: 1,
                    text: 1,
                    date: 1
                },
                totalComentarios: { $size: '$comentarios' }
            }
        },
        // Stage 4: Limitar a 1 película
        {
            $limit: 1
        }
    ]);
    
    if (resultado.length === 0) {
        console.log('No se encontró ninguna película con comentarios');
        return;
    }
    
    const pelicula = resultado[0];
    
    console.log('🎬 Película:');
    console.log(`  Título: ${pelicula.title}`);
    console.log(`  Géneros: ${pelicula.genres?.join(', ')}`);
    console.log(`  Año: ${pelicula.year}`);
    console.log(`  Clasificación: ${pelicula.rated}`);
    console.log(`  Tipo: ${pelicula.type}`);
    console.log(`  Total de comentarios: ${pelicula.totalComentarios}`);
    
    console.log('\n💬 Comentarios:');
    pelicula.comentarios.forEach((comentario, index) => {
        console.log(`\n  ${index + 1}. ${comentario.name} (${comentario.email})`);
        console.log(`     Fecha: ${comentario.date}`);
        console.log(`     ${comentario.text.substring(0, 100)}...`);
    });
    
    console.log('\n' + '='.repeat(60));
}


// ================== EJEMPLO AVANZADO: Múltiples películas con estadísticas ==================

async function peliculasConEstadisticas() {
    console.log('\n========== EXTRA: PELÍCULAS CON ESTADÍSTICAS DE COMENTARIOS ==========\n');
    
    const resultado = await Movie.aggregate([
        // Stage 1: Lookup de comentarios
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'movie_id',
                as: 'comentarios'
            }
        },
        // Stage 2: Filtrar películas con al menos 5 comentarios
        {
            $match: {
                $expr: { $gte: [{ $size: '$comentarios' }, 5] }
            }
        },
        // Stage 3: Proyectar y agregar estadísticas
        {
            $project: {
                title: 1,
                genres: 1,
                year: 1,
                rated: 1,
                type: 1,
                totalComentarios: { $size: '$comentarios' },
                ultimoComentario: { $arrayElemAt: ['$comentarios.date', -1] },
                primerComentario: { $arrayElemAt: ['$comentarios.date', 0] }
            }
        },
        // Stage 4: Ordenar por número de comentarios (descendente)
        {
            $sort: { totalComentarios: -1 }
        },
        // Stage 5: Limitar a 5 películas
        {
            $limit: 5
        }
    ]);
    
    console.log(`Encontradas ${resultado.length} películas con 5+ comentarios:\n`);
    
    resultado.forEach((pelicula, index) => {
        console.log(`${index + 1}. "${pelicula.title}" (${pelicula.year})`);
        console.log(`   Géneros: ${pelicula.genres?.join(', ')}`);
        console.log(`   Clasificación: ${pelicula.rated} | Tipo: ${pelicula.type}`);
        console.log(`   📊 ${pelicula.totalComentarios} comentarios`);
        console.log('');
    });
    
    console.log('='.repeat(60));
}


// ================== FUNCIÓN PRINCIPAL ==================

async function main() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sample_mflix');
        console.log('✓ Conectado a MongoDB (sample_mflix)');
        
        // Ejecutar consultas
        await comentarioConPelicula();
        await peliculaConComentarios();
        await peliculasConEstadisticas();
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n✓ Conexión cerrada');
    }
}

main();

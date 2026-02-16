import { Movie, Comment } from '../models/mflix.model.js';
import { connectDB, closeDB } from '../config/database.js';


/**
 * 1. POPULATE: Comentario con datos de la película
 */
async function comentarioConPelicula() {
    console.log('\n========== 1. COMENTARIO CON PELÍCULA (POPULATE) ==========\n');
    
    const comentario = await Comment
        .findOne()
        .populate({
            path: 'movie_id',
            select: 'title genres year rated type'
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


/**
 * 2. AGGREGATE LOOKUP: Película con todos sus comentarios
 */
async function peliculaConComentarios() {
    console.log('\n========== 2. PELÍCULA CON COMENTARIOS (AGGREGATE $LOOKUP) ==========\n');
    
    const resultado = await Movie.aggregate([
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'movie_id',
                as: 'comentarios'
            }
        },
        {
            $match: {
                'comentarios.0': { $exists: true }
            }
        },
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


/**
 * EJEMPLO AVANZADO: Películas con estadísticas de comentarios
 */
async function peliculasConEstadisticas() {
    console.log('\n========== EXTRA: PELÍCULAS CON ESTADÍSTICAS DE COMENTARIOS ==========\n');
    
    const resultado = await Movie.aggregate([
        {
            $lookup: {
                from: 'comments',
                localField: '_id',
                foreignField: 'movie_id',
                as: 'comentarios'
            }
        },
        {
            $match: {
                $expr: { $gte: [{ $size: '$comentarios' }, 5] }
            }
        },
        {
            $project: {
                title: 1,
                genres: 1,
                year: 1,
                rated: 1,
                type: 1,
                totalComentarios: { $size: '$comentarios' }
            }
        },
        {
            $sort: { totalComentarios: -1 }
        },
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


/**
 * Función principal
 */
async function main() {
    try {
        await connectDB('sample_mflix');
        
        await comentarioConPelicula();
        await peliculaConComentarios();
        await peliculasConEstadisticas();
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await closeDB();
    }
}

// Ejecutar si es el archivo principal
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
    main();
}

export { comentarioConPelicula, peliculaConComentarios, peliculasConEstadisticas };

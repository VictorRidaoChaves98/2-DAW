import { Grade } from '../models/grade.model.js';
import { connectDB, closeDB } from '../config/database.js';


/**
 * 1. NOTAS AGRUPADAS POR ESTUDIANTE Y TIPO
 */
async function notasPorEstudianteYTipo() {
    console.log('\n========== 1. NOTAS POR ESTUDIANTE Y TIPO ==========\n');
    
    const resultado = await Grade.aggregate([
        { $unwind: '$scores' },
        {
            $group: {
                _id: {
                    student_id: '$student_id',
                    type: '$scores.type'
                },
                notaMedia: { $avg: '$scores.score' },
                notaMaxima: { $max: '$scores.score' },
                notaMinima: { $min: '$scores.score' },
                totalNotas: { $sum: 1 }
            }
        },
        {
            $sort: {
                '_id.student_id': 1,
                '_id.type': 1
            }
        },
        { $limit: 10 }
    ]);
    
    console.log(`Total de resultados: ${resultado.length}\n`);
    
    resultado.forEach((item, index) => {
        console.log(`${index + 1}. Estudiante ID: ${item._id.student_id} | Tipo: ${item._id.type}`);
        console.log(`   📊 Media: ${item.notaMedia.toFixed(2)}`);
        console.log(`   ⬆️  Máxima: ${item.notaMaxima.toFixed(2)}`);
        console.log(`   ⬇️  Mínima: ${item.notaMinima.toFixed(2)}`);
        console.log(`   📝 Total evaluaciones: ${item.totalNotas}`);
        console.log('');
    });
    
    console.log('='.repeat(60));
}


/**
 * 2. NOTAS AGRUPADAS POR CLASE
 */
async function notasPorClase() {
    console.log('\n========== 2. NOTAS POR CLASE ==========\n');
    
    const resultado = await Grade.aggregate([
        { $unwind: '$scores' },
        {
            $group: {
                _id: '$class_id',
                notaMedia: { $avg: '$scores.score' },
                notaMaxima: { $max: '$scores.score' },
                notaMinima: { $min: '$scores.score' },
                totalEstudiantes: { $addToSet: '$student_id' },
                totalNotas: { $sum: 1 }
            }
        },
        {
            $project: {
                class_id: '$_id',
                notaMedia: 1,
                notaMaxima: 1,
                notaMinima: 1,
                totalNotas: 1,
                totalEstudiantes: { $size: '$totalEstudiantes' }
            }
        },
        { $sort: { class_id: 1 } },
        { $limit: 15 }
    ]);
    
    console.log(`Total de clases: ${resultado.length}\n`);
    
    resultado.forEach((item, index) => {
        console.log(`${index + 1}. Clase ID: ${item.class_id}`);
        console.log(`   👥 Estudiantes: ${item.totalEstudiantes}`);
        console.log(`   📊 Media: ${item.notaMedia.toFixed(2)}`);
        console.log(`   ⬆️  Máxima: ${item.notaMaxima.toFixed(2)}`);
        console.log(`   ⬇️  Mínima: ${item.notaMinima.toFixed(2)}`);
        console.log(`   📝 Total evaluaciones: ${item.totalNotas}`);
        console.log('');
    });
    
    console.log('='.repeat(60));
}


/**
 * EJEMPLO AVANZADO: Ranking de estudiantes por clase
 */
async function rankingEstudiantesPorClase(classId = 481) {
    console.log('\n========== EXTRA: RANKING DE ESTUDIANTES POR CLASE ==========\n');
    
    const resultado = await Grade.aggregate([
        { $match: { class_id: classId } },
        { $unwind: '$scores' },
        {
            $group: {
                _id: '$student_id',
                notaMedia: { $avg: '$scores.score' },
                notaMaxima: { $max: '$scores.score' },
                notaMinima: { $min: '$scores.score' },
                totalNotas: { $sum: 1 }
            }
        },
        { $sort: { notaMedia: -1 } },
        { $limit: 10 }
    ]);
    
    console.log(`🏆 TOP 10 ESTUDIANTES - Clase ${classId}\n`);
    
    resultado.forEach((item, index) => {
        const medalla = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        console.log(`${medalla} Estudiante ID: ${item._id}`);
        console.log(`   📊 Media: ${item.notaMedia.toFixed(2)}`);
        console.log(`   ⬆️  Máxima: ${item.notaMaxima.toFixed(2)}`);
        console.log(`   ⬇️  Mínima: ${item.notaMinima.toFixed(2)}`);
        console.log('');
    });
    
    console.log('='.repeat(60));
}


/**
 * EJEMPLO: Estadísticas por tipo de evaluación
 */
async function estadisticasPorTipo() {
    console.log('\n========== EXTRA: ESTADÍSTICAS POR TIPO DE EVALUACIÓN ==========\n');
    
    const resultado = await Grade.aggregate([
        { $unwind: '$scores' },
        {
            $group: {
                _id: '$scores.type',
                notaMedia: { $avg: '$scores.score' },
                notaMaxima: { $max: '$scores.score' },
                notaMinima: { $min: '$scores.score' },
                totalEvaluaciones: { $sum: 1 },
                desviacionEstandar: { $stdDevPop: '$scores.score' }
            }
        },
        { $sort: { _id: 1 } }
    ]);
    
    console.log('Estadísticas generales por tipo de evaluación:\n');
    
    resultado.forEach((item) => {
        console.log(`📋 Tipo: ${item._id.toUpperCase()}`);
        console.log(`   📊 Media: ${item.notaMedia.toFixed(2)}`);
        console.log(`   ⬆️  Máxima: ${item.notaMaxima.toFixed(2)}`);
        console.log(`   ⬇️  Mínima: ${item.notaMinima.toFixed(2)}`);
        console.log(`   📉 Desviación estándar: ${item.desviacionEstandar.toFixed(2)}`);
        console.log(`   📝 Total evaluaciones: ${item.totalEvaluaciones}`);
        console.log('');
    });
    
    console.log('='.repeat(60));
}


/**
 * Función principal
 */
async function main() {
    try {
        await connectDB('sample_training');
        
        const count = await Grade.countDocuments();
        console.log(`✓ Total de documentos en grades: ${count}`);
        
        await notasPorEstudianteYTipo();
        await notasPorClase();
        await rankingEstudiantesPorClase();
        await estadisticasPorTipo();
        
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

export { notasPorEstudianteYTipo, notasPorClase, rankingEstudiantesPorClase, estadisticasPorTipo };

import mongoose from 'mongoose';

// ================== CONFIGURACIÓN DE MODELO ==================

const gradeSchema = new mongoose.Schema({}, { strict: false, collection: 'grades' });
const Grade = mongoose.model('Grade', gradeSchema);


// ================== 1. NOTAS AGRUPADAS POR ESTUDIANTE Y TIPO ==================

async function notasPorEstudianteYTipo() {
    console.log('\n========== 1. NOTAS POR ESTUDIANTE Y TIPO ==========\n');
    
    const resultado = await Grade.aggregate([
        // Stage 1: Descomponer el array de scores
        {
            $unwind: '$scores'
        },
        // Stage 2: Agrupar por student_id y tipo de evaluación
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
        // Stage 3: Ordenar por student_id y tipo
        {
            $sort: {
                '_id.student_id': 1,
                '_id.type': 1
            }
        },
        // Stage 4: Limitar a 10 resultados para visualización
        {
            $limit: 10
        }
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


// ================== 2. NOTAS AGRUPADAS POR CLASE ==================

async function notasPorClase() {
    console.log('\n========== 2. NOTAS POR CLASE ==========\n');
    
    const resultado = await Grade.aggregate([
        // Stage 1: Descomponer el array de scores
        {
            $unwind: '$scores'
        },
        // Stage 2: Agrupar por class_id
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
        // Stage 3: Añadir el conteo de estudiantes únicos
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
        // Stage 4: Ordenar por class_id
        {
            $sort: { class_id: 1 }
        },
        // Stage 5: Limitar a 15 clases para visualización
        {
            $limit: 15
        }
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


// ================== EJEMPLO AVANZADO: RANKING DE ESTUDIANTES POR CLASE ==================

async function rankingEstudiantesPorClase() {
    console.log('\n========== EXTRA: RANKING DE ESTUDIANTES POR CLASE ==========\n');
    
    const classId = 481; // Clase específica para el ejemplo
    
    const resultado = await Grade.aggregate([
        // Stage 1: Filtrar por clase específica
        {
            $match: { class_id: classId }
        },
        // Stage 2: Descomponer el array de scores
        {
            $unwind: '$scores'
        },
        // Stage 3: Agrupar por estudiante
        {
            $group: {
                _id: '$student_id',
                notaMedia: { $avg: '$scores.score' },
                notaMaxima: { $max: '$scores.score' },
                notaMinima: { $min: '$scores.score' },
                totalNotas: { $sum: 1 }
            }
        },
        // Stage 4: Ordenar por nota media (descendente)
        {
            $sort: { notaMedia: -1 }
        },
        // Stage 5: Limitar a top 10
        {
            $limit: 10
        }
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


// ================== EJEMPLO: ESTADÍSTICAS POR TIPO DE EVALUACIÓN ==================

async function estadisticasPorTipo() {
    console.log('\n========== EXTRA: ESTADÍSTICAS POR TIPO DE EVALUACIÓN ==========\n');
    
    const resultado = await Grade.aggregate([
        // Stage 1: Descomponer el array de scores
        {
            $unwind: '$scores'
        },
        // Stage 2: Agrupar por tipo de evaluación
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
        // Stage 3: Ordenar por tipo
        {
            $sort: { _id: 1 }
        }
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


// ================== FUNCIÓN PRINCIPAL ==================

async function main() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sample_training');
        console.log('✓ Conectado a MongoDB (sample_training)');
        
        // Verificar que hay datos
        const count = await Grade.countDocuments();
        console.log(`✓ Total de documentos en grades: ${count}`);
        
        // Ejecutar consultas
        await notasPorEstudianteYTipo();
        await notasPorClase();
        await rankingEstudiantesPorClase();
        await estadisticasPorTipo();
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n✓ Conexión cerrada');
    }
}

main();

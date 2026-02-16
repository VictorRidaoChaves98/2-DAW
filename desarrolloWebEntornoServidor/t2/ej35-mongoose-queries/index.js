import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

// CONFIGURR MODELOS

const weatherSchemaNative = new mongoose.Schema({}, { strict: false });
const WeatherNative = mongoose.model('WeatherNative', weatherSchemaNative, 'data');



const weatherSchemaWithPlugin = new mongoose.Schema({}, { strict: false });
weatherSchemaWithPlugin.plugin(mongoosePaginate);
const WeatherWithPlugin = mongoose.model('WeatherWithPlugin', weatherSchemaWithPlugin, 'data');


// PAGINACIÓN NATIVA (skip y limit)

async function paginacionNativa() {
    console.log('\n========== PAGINACIÓN NATIVA ==========\n');
    
    const page = 2;
    const limit = 5;
    const skip = (page - 1) * limit;

    const docs = await WeatherNative
        .find()
        .skip(skip)
        .limit(limit);

    const totalDocs = await WeatherNative.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);
    
    console.log(`Página: ${page} de ${totalPages}`);
    console.log(`Documentos por página: ${limit}`);
    console.log(`Total de documentos: ${totalDocs}`);
    console.log(`Mostrando ${docs.length} documentos:\n`);
    
    docs.forEach((doc, index) => {
        console.log(`\n--- Documento ${skip + index + 1} ---`);
        console.log(JSON.stringify(doc, null, 2));
    });
    
    console.log('\n' + '='.repeat(45));
}


// PAGINACIÓN CON PLUGIN mongoose-paginate-v2

async function paginacionConPlugin() {
    console.log('\n========== PAGINACIÓN CON PLUGIN ==========\n');
    
    const options = {
        page: 2,
        limit: 5,
        sort: { _id: 1 },
        lean: false
    };

    const result = await WeatherWithPlugin.paginate({}, options);
    
    console.log(`Página: ${result.page} de ${result.totalPages}`);
    console.log(`Documentos por página: ${result.limit}`);
    console.log(`Total de documentos: ${result.totalDocs}`);
    console.log(`¿Hay página anterior?: ${result.hasPrevPage}`);
    console.log(`¿Hay página siguiente?: ${result.hasNextPage}`);
    console.log(`Página anterior: ${result.prevPage}`);
    console.log(`Página siguiente: ${result.nextPage}`);
    console.log(`Mostrando ${result.docs.length} documentos:\n`);
    
    result.docs.forEach((doc, index) => {
        const position = (result.page - 1) * result.limit + index + 1;
        console.log(`\n--- Documento ${position} ---`);
        console.log(JSON.stringify(doc, null, 2));
    });
    
    console.log('\n' + '='.repeat(45));
}


// EJEMPLO CON FILTROS Y PROYECCIÓN

async function paginacionAvanzada() {
    console.log('\n========== PAGINACIÓN AVANZADA CON FILTROS ==========\n');

    const query = {};
    
    const options = {
        page: 1,
        limit: 10,
        sort: { _id: -1 },
        select: '_id ts position',
        lean: true
    };
    
    const result = await WeatherWithPlugin.paginate(query, options);
    
    console.log(`Total encontrado con filtros: ${result.totalDocs}`);
    console.log(`Mostrando ${result.docs.length} documentos:\n`);
    
    result.docs.forEach((doc, index) => {
        console.log(`\n--- Documento ${index + 1} ---`);
        console.log(JSON.stringify(doc, null, 2));
    });
    
    console.log('\n' + '='.repeat(45));
}


// FUNCIÓN PRINCIPAL

async function main() {
    try {
        await mongoose.connect('mongodb://localhost:27017/sample_weatherdata');
        console.log('✓ Conectado a MongoDB');

        await paginacionNativa();
        await paginacionConPlugin();
        await paginacionAvanzada();
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n✓ Conexión cerrada');
    }
}

main();

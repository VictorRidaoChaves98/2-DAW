// Este .js se encargará de crear/borrar ficheros y carpetas según los argumentos que se le pasen.

var fs = require('fs');
var path = require('path');

var filesDir = path.join(__dirname, '..', 'files');

var action = process.argv[2];
var name = process.argv[3];

if (action === 'crear') {
    if (!fs.existsSync(filesDir)) {
        fs.mkdirSync(filesDir);
        console.log('Carpeta "files" creada');
    } else {
        console.log('La carpeta "files" ya existe');
    }
}

if (action === 'crear:js') {
    if (!name) {
        console.log('Debes indicar un nombre para el archivo .js');
    } else {
        if (!fs.existsSync(filesDir)) {
            fs.mkdirSync(filesDir);
            console.log('Carpeta "files" creada');
        }
        var filePath = path.join(filesDir, name + '.js');
        fs.writeFileSync(filePath, '// Este es el archivo ' + name + '.js');
        console.log('Archivo "' + name + '.js" creado');
    }
}

if (action === 'crear:carpeta') {
    if (!name) {
        console.log('Debes indicar un nombre para la carpeta');
    } else {
        if (!fs.existsSync(filesDir)) {
            fs.mkdirSync(filesDir);
            console.log('Carpeta "files" creada');
        }
        var dirPath = path.join(filesDir, name);
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath);
            console.log('Carpeta "' + name + '" creada');
        } else {
            console.log('La carpeta "' + name + '" ya existe');
        }
    }
}

if (action === 'borrar:js') {
    if (!fs.existsSync(filesDir)) {
        console.log('No existe la carpeta files');
    } else {
        var files = fs.readdirSync(filesDir);
        for (var i = 0; i < files.length; i++) {
            if (files[i].endsWith('.js')) {
                fs.unlinkSync(path.join(filesDir, files[i]));
                console.log('Archivo ' + files[i] + ' borrado');
            }
        }
    }
}

if (action === 'borrar') {
    if (fs.existsSync(filesDir)) {
        fs.rmSync(filesDir, { recursive: true, force: true });
        console.log('Carpeta "files" borrada completamente');
    } else {
        console.log('La carpeta "files" no existe');
    }
}


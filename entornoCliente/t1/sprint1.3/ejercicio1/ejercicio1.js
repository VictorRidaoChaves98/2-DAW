// ==========================
// 📚 Datos base
// ==========================
const estudiantes = [
    { nombre: "Juan", ciudad: "Madrid", beca: false, edad: 21, calificaciones: { matematicas: 5, fisica: 7, historia: 6 } },
    { nombre: "Ana", ciudad: "Barcelona", beca: true, edad: 20, calificaciones: { matematicas: 9, fisica: 6, historia: 8 } },
    { nombre: "Pedro", ciudad: "Madrid", beca: false, edad: 23, calificaciones: { matematicas: 4, fisica: 5, historia: 7 } },
    { nombre: "Maria", ciudad: "Sevilla", beca: true, edad: 19, calificaciones: { matematicas: 8, fisica: 7, historia: 9 } },
    { nombre: "Jose", ciudad: "Madrid", beca: false, edad: 22, calificaciones: { matematicas: 6, fisica: 7, historia: 5 } },
    { nombre: "Isabel", ciudad: "Valencia", beca: true, edad: 20, calificaciones: { matematicas: 5, fisica: 8, historia: 7 } },
    { nombre: "David", ciudad: "Bilbao", beca: false, edad: 24, calificaciones: { matematicas: 7, fisica: 6, historia: 8 } },
    { nombre: "Laura", ciudad: "Barcelona", beca: true, edad: 19, calificaciones: { matematicas: 6, fisica: 8, historia: 7 } },
    { nombre: "Miguel", ciudad: "Sevilla", beca: false, edad: 21, calificaciones: { matematicas: 7, fisica: 7, historia: 8 } },
    { nombre: "Sara", ciudad: "Madrid", beca: true, edad: 20, calificaciones: { matematicas: 6, fisica: 5, historia: 9 } },
    { nombre: "Daniela", ciudad: "Valencia", beca: false, edad: 22, calificaciones: { matematicas: 8, fisica: 9, historia: 6 } },
    { nombre: "Alberto", ciudad: "Bilbao", beca: true, edad: 23, calificaciones: { matematicas: 5, fisica: 8, historia: 6 } },
    { nombre: "Gabriel", ciudad: "Sevilla", beca: false, edad: 19, calificaciones: { matematicas: 8, fisica: 5, historia: 7 } },
    { nombre: "Carmen", ciudad: "Barcelona", beca: true, edad: 24, calificaciones: { matematicas: 9, fisica: 9, historia: 9 } },
    { nombre: "Roberto", ciudad: "Madrid", beca: false, edad: 20, calificaciones: { matematicas: 4, fisica: 5, historia: 5 } },
    { nombre: "Carolina", ciudad: "Valencia", beca: true, edad: 22, calificaciones: { matematicas: 5, fisica: 7, historia: 6 } },
    { nombre: "Alejandro", ciudad: "Bilbao", beca: false, edad: 23, calificaciones: { matematicas: 9, fisica: 8, historia: 8 } },
    { nombre: "Lucia", ciudad: "Barcelona", beca: true, edad: 21, calificaciones: { matematicas: 7, fisica: 7, historia: 7 } },
    { nombre: "Ricardo", ciudad: "Sevilla", beca: false, edad: 19, calificaciones: { matematicas: 6, fisica: 5, historia: 6 } },
    { nombre: "Marina", ciudad: "Madrid", beca: true, edad: 20, calificaciones: { matematicas: 5, fisica: 9, historia: 8 } }
];

const salida = document.getElementById("resultado");

// ==========================
// 🧩 FUNCIONES
// ==========================

// 1️⃣ Estudiantes destacados
function estudiantesDestacadosPorAsignatura(estudiantes, asignatura) {
    return [...estudiantes]
        .sort((a, b) => b.calificaciones[asignatura] - a.calificaciones[asignatura])
        .slice(0, 3);
}

// 2️⃣ Asignatura con menor rendimiento
function asignaturaMenorRendimiento(estudiantes) {
    const asignaturas = Object.keys(estudiantes[0].calificaciones);
    let promedios = {};

    asignaturas.forEach(a => {
        const promedio = estudiantes.reduce((acc, e) => acc + e.calificaciones[a], 0) / estudiantes.length;
        promedios[a] = promedio;
    });

    return Object.entries(promedios).sort((a, b) => a[1] - b[1])[0][0];
}

// 3️⃣ Mejora de notas de becados
function mejoraNotasBeca(estudiantes) {
    return estudiantes.map(e => {
        if (e.beca) {
            const calif = {};
            for (let materia in e.calificaciones) {
                calif[materia] = Math.min(e.calificaciones[materia] * 1.1, 10).toFixed(1);
            }
            return { ...e, calificaciones: calif };
        }
        return e;
    });
}

// 4️⃣ Filtrado por ciudad y asignatura
function filtrarPorCiudadYAsignatura(estudiantes, ciudad, asignatura) {
    return estudiantes
        .filter(e => e.ciudad === ciudad)
        .sort((a, b) => b.calificaciones[asignatura] - a.calificaciones[asignatura]);
}

// 5️⃣ Estudiantes sin beca por ciudad
function estudiantesSinBecaPorCiudad(estudiantes, ciudad) {
    return estudiantes.filter(e => e.ciudad === ciudad && !e.beca).length;
}

// 6️⃣ Promedio de edad de becados
function promedioEdadEstudiantesConBeca(estudiantes) {
    const becados = estudiantes.filter(e => e.beca);
    const total = becados.reduce((acc, e) => acc + e.edad, 0);
    return (total / becados.length).toFixed(1);
}

// 7️⃣ Mejores estudiantes por promedio general
function mejoresEstudiantes(estudiantes) {
    const conPromedio = estudiantes.map(e => {
        const notas = Object.values(e.calificaciones);
        const promedio = notas.reduce((a, b) => a + b, 0) / notas.length;
        return { ...e, promedio: promedio.toFixed(2) };
    });

    return conPromedio.sort((a, b) => b.promedio - a.promedio).slice(0, 2);
}

// 8️⃣ Estudiantes con todas las materias aprobadas
function estudiantesAprobados(estudiantes) {
    return estudiantes
        .filter(e => Object.values(e.calificaciones).every(nota => nota >= 5))
        .map(e => e.nombre);
}

// ==========================
// 🎛️ BOTONES DE PRUEBA
// ==========================
function mostrarResultado(titulo, datos) {
    salida.innerHTML = `<h3>${titulo}</h3><pre>${JSON.stringify(datos, null, 2)}</pre>`;
}

function probarDestacados() {
    mostrarResultado("1️⃣ Estudiantes destacados (matemáticas)", estudiantesDestacadosPorAsignatura(estudiantes, "matematicas"));
}

function probarMenorRendimiento() {
    mostrarResultado("2️⃣ Asignatura con menor rendimiento", asignaturaMenorRendimiento(estudiantes));
}

function probarMejoraBeca() {
    mostrarResultado("3️⃣ Mejora de notas de estudiantes con beca", mejoraNotasBeca(estudiantes));
}

function probarFiltrado() {
    mostrarResultado("4️⃣ Filtrado por ciudad y asignatura (Madrid / física)", filtrarPorCiudadYAsignatura(estudiantes, "Madrid", "fisica"));
}

function probarSinBeca() {
    mostrarResultado("5️⃣ Estudiantes sin beca en Madrid", estudiantesSinBecaPorCiudad(estudiantes, "Madrid"));
}

function probarPromedioEdad() {
    mostrarResultado("6️⃣ Promedio de edad de becados", promedioEdadEstudiantesConBeca(estudiantes));
}

function probarMejores() {
    mostrarResultado("7️⃣ Mejores estudiantes por promedio", mejoresEstudiantes(estudiantes));
}

function probarAprobados() {
    mostrarResultado("8️⃣ Estudiantes con todas las materias aprobadas", estudiantesAprobados(estudiantes));
}

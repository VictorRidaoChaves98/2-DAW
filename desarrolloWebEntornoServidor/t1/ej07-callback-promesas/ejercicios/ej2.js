// Crear algún flujo síncrono y asíncrono

// --- FLUJO SÍNCRONO ---

function tareaSincrona() {
    console.log("1.Empieza la tarea sincrona");
    for (let i = 0; i < 3; i++) {
        console.log("...", i);
    }
    console.log("2.Termina tarea");
}

tareaSincrona();

// --- FLUJO ASÍNCRONO ---

function tareaAsincrona() {
    console.log("Empieza la tarea asíncrona");
    setTimeout(() => {
        console.log("tarda 2 secs.");
    }, 2000); //milisegundos
    console.log("la tarea continúa.");
}

tareaAsincrona();
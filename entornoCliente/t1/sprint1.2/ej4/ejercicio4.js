let segundosTotales = 0;
let intervaloId = null;

const display = document.getElementById("display");
const iniciarBtn = document.getElementById("iniciarBtn");
const pausarBtn = document.getElementById("pausarBtn");
const reiniciarBtn = document.getElementById("reiniciarBtn");

// Función para actualizar el display en formato MM:SS
function actualizarDisplay() {
    const minutos = Math.floor(segundosTotales / 60);
    const segundos = segundosTotales % 60;
    display.textContent = `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
}

// Iniciar cronómetro
iniciarBtn.addEventListener("click", () => {
    if (intervaloId !== null) return; // Ya está corriendo
    intervaloId = setInterval(() => {
        segundosTotales++;
        actualizarDisplay();
    }, 1000);
});

// Pausar cronómetro
pausarBtn.addEventListener("click", () => {
    if (intervaloId !== null) {
        clearInterval(intervaloId);
        intervaloId = null;
    }
});

// Reiniciar cronómetro
reiniciarBtn.addEventListener("click", () => {
    clearInterval(intervaloId);
    intervaloId = null;
    segundosTotales = 0;
    actualizarDisplay();
});

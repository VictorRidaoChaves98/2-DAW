document.addEventListener("DOMContentLoaded", () => {
    const inputSegundos = document.getElementById("segundos");
    const botonIniciar = document.getElementById("iniciar");
    const display = document.getElementById("display");

    let intervaloId = null;

    function mostrarMensaje(text) {
        display.textContent = text;
    }

    function iniciarCuenta() {
        const segundos = parseInt(inputSegundos.value.trim(), 10);

        if (isNaN(segundos) || segundos <= 0) {
            alert("Introduce un número válido de segundos (entero positivo).");
            return;
        }

        // Si ya hay un intervalo, lo limpiamos
        if (intervaloId !== null) {
            clearInterval(intervaloId);
            intervaloId = null;
        }

        let restante = segundos;
        mostrarMensaje(`Tiempo restante: ${restante}`);

        botonIniciar.disabled = true;
        inputSegundos.disabled = true;

        intervaloId = setInterval(() => {
            restante--;
            if (restante > 0) {
                mostrarMensaje(`Tiempo restante: ${restante}`);
            } else {
                clearInterval(intervaloId);
                intervaloId = null;
                mostrarMensaje("¡Tiempo finalizado!");
                botonIniciar.disabled = false;
                inputSegundos.disabled = false;
            }
        }, 1000);
    }

    // Evento click en el botón
    botonIniciar.addEventListener("click", (e) => {
        e.preventDefault();
        iniciarCuenta();
    });

    // Permitir Enter en el input
    inputSegundos.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            iniciarCuenta();
        }
    });
});

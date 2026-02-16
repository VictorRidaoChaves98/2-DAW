// Seleccionamos elementos del DOM
const anchoInput = document.getElementById("ancho");
const altoInput = document.getElementById("alto");
const btn = document.getElementById("btnCalcular");
const resultado = document.getElementById("resultado");

// Función para calcular el área
function calcularArea() {
    // Convertimos los valores de los inputs a números
    const ancho = parseFloat(anchoInput.value);
    const alto = parseFloat(altoInput.value);

    // Validación básica: si alguno no es número, mostrar mensaje
    if (isNaN(ancho) || isNaN(alto)) {
        resultado.textContent = "Por favor, introduce ambos valores.";
        return;
    }

    // Calculamos el área
    const area = ancho * alto;

    // Mostramos el resultado en el párrafo
    resultado.textContent = `Área: ${area}`;
}

// Evento al hacer clic en el botón
btn.addEventListener("click", calcularArea);

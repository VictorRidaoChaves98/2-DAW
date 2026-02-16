// Objeto para contar votos
const votos = {
    "Rojo": 0,
    "Verde": 0,
    "Azul": 0,
    "Amarillo": 0
};

// Evento al hacer click en "Enviar"
document.getElementById("enviarBtn").addEventListener("click", function () {
    const seleccion = document.querySelector('input[name="color"]:checked');
    if (!seleccion) {
        alert("Por favor selecciona una opción antes de enviar.");
        return;
    }

    // Incrementar el voto
    votos[seleccion.value]++;

    // Actualizar gráfico
    actualizarGrafico();
});

// Función para dibujar las barras
function actualizarGrafico() {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = "";

    // Calcular el total de votos
    const totalVotos = Object.values(votos).reduce((a, b) => a + b, 0);

    for (const color in votos) {
        const cantidad = votos[color];
        const porcentaje = totalVotos > 0 ? (cantidad / totalVotos) * 100 : 0;

        // Crear contenedor de barra
        const contenedor = document.createElement("div");
        contenedor.className = "bar-container";

        // Etiqueta
        const etiqueta = document.createElement("span");
        etiqueta.className = "label";
        etiqueta.textContent = color;

        // Barra
        const barra = document.createElement("div");
        barra.className = "bar";
        barra.style.width = porcentaje + "%";
        barra.textContent = cantidad;

        contenedor.appendChild(etiqueta);
        contenedor.appendChild(barra);
        resultadosDiv.appendChild(contenedor);
    }
}

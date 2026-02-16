// Esperamos al evento de clic en el botón
document.getElementById("calcularBtn").addEventListener("click", function () {
    // Capturar valores
    const num1 = parseFloat(document.getElementById("num1").value);
    const num2 = parseFloat(document.getElementById("num2").value);
    const operacion = document.getElementById("operacion").value;
    let resultado;

    // Validar que los campos no estén vacíos
    if (isNaN(num1) || isNaN(num2)) {
        alert("Por favor ingresa ambos números.");
        return;
    }

    // Realizar la operación seleccionada
    switch (operacion) {
        case "suma":
            resultado = num1 + num2;
            break;
        case "resta":
            resultado = num1 - num2;
            break;
        case "multiplicacion":
            resultado = num1 * num2;
            break;
        case "division":
            if (num2 === 0) {
                resultado = "INDEFINIDO";
            } else {
                resultado = num1 / num2;
            }
            break;
        default:
            resultado = "Operación no válida";
    }

    // Mostrar resultado en el párrafo
    document.getElementById("resultado").textContent = "Resultado: " + resultado;
});

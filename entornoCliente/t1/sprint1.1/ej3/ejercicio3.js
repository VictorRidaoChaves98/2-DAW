// Seleccionamos los elementos del DOM
const input = document.getElementById("nuevoElemento");
const btn = document.getElementById("btnAñadir");
const lista = document.getElementById("lista");

// Función para añadir un nuevo elemento a la lista
function añadirElemento() {
    // Obtenemos el valor del input
    const valor = input.value.trim(); // trim() elimina espacios al inicio y fin

    // Validamos que no esté vacío
    if (valor === "") {
        alert("Por favor, escribe algo para añadir a la lista.");
        return;
    }

    // Creamos un nuevo elemento <li>
    const li = document.createElement("li");

    // Asignamos el texto del input al <li>
    li.textContent = valor;

    // Añadimos el <li> a la lista
    lista.appendChild(li);

    // Limpiamos el input para escribir el siguiente
    input.value = "";
}

// Evento al hacer clic en el botón
btn.addEventListener("click", añadirElemento);

// También se podría añadir con Enter, opcionalmente
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        añadirElemento();
    }
});

// Seleccionamos todos los divs con la clase 'miDiv'
const divs = document.querySelectorAll(".miDiv");

// Recorremos cada div para agregar eventos
divs.forEach(div => {
    // Evento cuando el ratón entra en el div
    div.addEventListener("mouseover", () => {
        // Guardamos los estilos originales para poder restaurarlos
        div.dataset.bg = div.style.backgroundColor;
        div.dataset.color = div.style.color;

        // Cambiamos a fondo azul y texto blanco
        div.style.backgroundColor = "blue";
        div.style.color = "white";
    });

    // Evento cuando el ratón sale del div
    div.addEventListener("mouseout", () => {
        // Restauramos los estilos originales
        div.style.backgroundColor = div.dataset.bg || "#ddd";
        div.style.color = div.dataset.color || "#333";
    });
});

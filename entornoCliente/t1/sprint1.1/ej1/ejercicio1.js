const btn = document.getElementById("btnColor");
const texto = document.getElementById("colorTexto");

// Genera un color aleatorio
function generarColorAleatorio() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return { rgb: `rgb(${r}, ${g}, ${b})`, valores: `RGB(${r}, ${g}, ${b})` };
}

// Convierte RGB a gradiente (de color a blanco)
function crearGradiente(rgb) {
    return `linear-gradient(to right, ${rgb}, white)`;
}

btn.addEventListener("click", () => {
    const color = generarColorAleatorio();
    document.body.style.backgroundColor = color.rgb;

    texto.textContent = color.valores;
    texto.style.background = crearGradiente(color.rgb);

    // Ajuste de contraste del texto según luminosidad
    const rgbMatch = color.rgb.match(/\d+/g);
    const luminosidad = 0.299 * rgbMatch[0] + 0.587 * rgbMatch[1] + 0.114 * rgbMatch[2];
    texto.style.color = luminosidad > 186 ? 'black' : 'white';
});

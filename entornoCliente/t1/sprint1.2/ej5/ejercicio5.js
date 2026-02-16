document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("gameGrid");
    const mensaje = document.getElementById("mensaje");
    const reiniciarBtn = document.getElementById("reiniciarBtn");

    // Lista de imágenes de cartas (8 imágenes duplicadas)
    let cartas = [
        'cards/alexandros.png', 'cards/alexandros.png',
        'cards/bahamut.png', 'cards/bahamut.png',
        'cards/cactilion.png', 'cards/cactilion.png',
        'cards/edea.png', 'cards/edea.png',
        'cards/laguna.png', 'cards/laguna.png',
        'cards/odin.png', 'cards/odin.png',
        'cards/rinoa.png', 'cards/rinoa.png',
        'cards/squall.png', 'cards/squall.png'
    ];

    let primeraCarta = null;
    let segundaCarta = null;
    let bloqueando = false;
    let parejasEncontradas = 0;

    function barajar(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    function crearTablero() {
        grid.innerHTML = '';
        cartas = barajar(cartas);

        cartas.forEach((src) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.valor = src;

            // Imagen frontal (cuando se voltea)
            const imgFrente = document.createElement('img');
            imgFrente.src = src;
            imgFrente.classList.add('frente');

            // Imagen trasera (boca abajo)
            const imgTrasera = document.createElement('img');
            imgTrasera.src = 'cards/cover.png';
            imgTrasera.classList.add('trasera');

            card.appendChild(imgFrente);
            card.appendChild(imgTrasera);

            grid.appendChild(card);
        });
    }

    function voltearCarta(carta) {
        if (bloqueando || carta.classList.contains('flipped')) return;

        carta.classList.add('flipped');

        if (!primeraCarta) {
            primeraCarta = carta;
        } else {
            segundaCarta = carta;
            bloquearTablero();

            const valor1 = primeraCarta.dataset.valor;
            const valor2 = segundaCarta.dataset.valor;

            if (valor1 === valor2) {
                // Coinciden → quedan visibles
                desbloquearTablero();
                parejasEncontradas++;
                comprobarVictoria();
            } else {
                // No coinciden → se voltean de nuevo
                setTimeout(() => {
                    primeraCarta.classList.remove('flipped');
                    segundaCarta.classList.remove('flipped');
                    desbloquearTablero();
                }, 1000);
            }
        }
    }

    function bloquearTablero() { bloqueando = true; }
    function desbloquearTablero() { primeraCarta = null; segundaCarta = null; bloqueando = false; }

    function comprobarVictoria() {
        if (parejasEncontradas === cartas.length / 2) {
            mensaje.textContent = "🎉 ¡Has encontrado todas las parejas!";
        }
    }

    // Evento click en cartas
    grid.addEventListener('click', (e) => {
        const card = e.target.closest('.card');
        if (card) voltearCarta(card);
    });

    // Reiniciar juego
    reiniciarBtn.addEventListener('click', () => {
        primeraCarta = null;
        segundaCarta = null;
        bloqueando = false;
        parejasEncontradas = 0;
        mensaje.textContent = '';
        crearTablero();
    });

    // Crear tablero inicial
    crearTablero();
});

// Ejercicio 2: Ahorcado (teclado físico + teclado en pantalla)

(() => {
    // ---------- CONFIG / PALABRAS ----------
    // Palabras sin acentos preferible; si quieres usar acentos, se normalizarán.
    const WORDS = [
        "PERRO", "GATO", "CAMINO", "ESPAÑA", "NARANJA", "AVION", "PROGRAMAR", "JAVASCRIPT",
        "ORDENADOR", "TECLADO", "MONITOR", "SILLA", "VENTANA", "LENGUAJE", "COCHE"
    ];

    const MAX_LIVES = 6;
    const VALID_LETTERS = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
    ];

    // ---------- SELECTORES ----------
    const wordEl = document.getElementById("word");
    const statusEl = document.getElementById("status");
    const livesEl = document.getElementById("lives");
    const keyboardEl = document.getElementById("keyboard");
    const restartBtn = document.getElementById("restart");
    const usedListEl = document.getElementById("usedList");
    const showWordBtn = document.getElementById("showWord");

    const parts = [
        document.getElementById("part-0"),
        document.getElementById("part-1"),
        document.getElementById("part-2"),
        document.getElementById("part-3"),
        document.getElementById("part-4"),
        document.getElementById("part-5")
    ];

    // ---------- ESTADO ----------
    let secret = "";
    let normalizedSecret = ""; // sin diacríticos y en mayúsculas para comparación
    let revealed = []; // array de boolean por cada caracter
    let lives = MAX_LIVES;
    let used = new Set();
    let gameOver = false;

    // ---------- UTIL ----------
    function normalize(str) {
        // eliminar diacríticos y pasar a mayúsculas
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase();
    }

    function pickWord() {
        const idx = Math.floor(Math.random() * WORDS.length);
        return WORDS[idx];
    }

    function updateLivesDisplay() {
        livesEl.textContent = lives;
    }

    function updateUsedDisplay() {
        const arr = Array.from(used);
        usedListEl.textContent = arr.length ? arr.join(", ") : "—";
    }

    function renderWord() {
        wordEl.innerHTML = "";
        for (let i = 0; i < secret.length; i++) {
            const ch = secret[i];
            const span = document.createElement("div");
            span.className = "letter";
            if (revealed[i]) {
                span.classList.add("revealed");
                span.textContent = ch;
            } else {
                // si es espacio u otro separador, mostrarlo directamente
                span.textContent = (ch === " ") ? " " : "";
            }
            wordEl.appendChild(span);
        }
    }

    function revealAll() {
        for (let i = 0; i < revealed.length; i++) revealed[i] = true;
        renderWord();
    }

    function disableAllKeys() {
        const keys = keyboardEl.querySelectorAll(".key");
        keys.forEach(k => k.classList.add("disabled"));
    }

    function enableAllKeys() {
        const keys = keyboardEl.querySelectorAll(".key");
        keys.forEach(k => k.classList.remove("disabled"));
    }

    function showPart(index) {
        if (parts[index]) parts[index].style.display = "block";
    }

    function hideAllParts() {
        parts.forEach(p => { if (p) p.style.display = "none"; });
    }

    function message(text) {
        statusEl.textContent = text;
    }

    // ---------- LÓGICA DE JUEGO ----------
    function startGame() {
        secret = pickWord();
        normalizedSecret = normalize(secret);
        // prepare revealed array: letters are revealed=false, spaces true
        revealed = Array.from(normalizedSecret).map(ch => (ch === " ") ? true : false);
        lives = MAX_LIVES;
        used.clear();
        gameOver = false;
        hideAllParts();
        updateLivesDisplay();
        updateUsedDisplay();
        renderWord();
        message("Comienza el juego. ¡Buena suerte!");
        enableAllKeys();
    }

    function finishGame(win) {
        gameOver = true;
        if (win) {
            message("🎉 ¡Has ganado! Felicidades.");
        } else {
            message(`💀 Has perdido. La palabra era: ${secret}`);
            // mostrar el resto del cuerpo por si quedó algo oculto
            revealAll();
        }
        disableAllKeys();
    }

    function checkWin() {
        return revealed.every(Boolean);
    }

    function handleGuess(letter) {
        if (gameOver) return;
        letter = normalize(letter);
        if (!VALID_LETTERS.includes(letter)) return;

        // ya usado?
        if (used.has(letter)) return;
        used.add(letter);
        updateUsedDisplay();

        // deshabilitar tecla en pantalla
        const keyBtn = keyboardEl.querySelector(`.key[data-letter="${letter}"]`);
        if (keyBtn) keyBtn.classList.add("disabled");

        // buscar en normalizedSecret (comparamos sin acentos)
        let found = false;
        for (let i = 0; i < normalizedSecret.length; i++) {
            if (normalizedSecret[i] === letter) {
                revealed[i] = true;
                found = true;
            }
        }

        if (found) {
            renderWord();
            message(`✅ Letra ${letter}: acierto`);
            if (checkWin()) {
                finishGame(true);
            }
        } else {
            // fallo: restar vida y mostrar parte
            lives--;
            updateLivesDisplay();
            message(`❌ Letra ${letter}: no está. Vidas restantes: ${lives}`);
            const partIndex = MAX_LIVES - 1 - lives; // 0..5
            showPart(partIndex);
            if (lives <= 0) {
                finishGame(false);
            }
        }
    }

    // ---------- TECLADO EN PANTALLA ----------
    function buildKeyboard() {
        keyboardEl.innerHTML = "";
        VALID_LETTERS.forEach(letter => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "key";
            btn.textContent = letter;
            btn.dataset.letter = letter;
            btn.addEventListener("click", () => {
                handleGuess(letter);
            });
            keyboardEl.appendChild(btn);
        });
    }

    // ---------- TECLADO FÍSICO ----------
    function onPhysicalKey(e) {
        if (gameOver) return;
        const key = e.key || "";
        // Normalizar tecla a mayúscula y quitar acentos si necesario
        let k = key.toUpperCase();
        // Support ñ (some layouts produce 'Ñ' directly)
        if (k === "Ç") k = "C"; // small normalization example
        // Allow only letters and ñ
        if (/^[A-ZÑ]$/.test(k)) {
            handleGuess(k);
        }
    }

    // ---------- EVENTOS ----------
    restartBtn.addEventListener("click", startGame);
    showWordBtn.addEventListener("click", () => {
        alert(`Palabra actual: ${secret}`);
    });

    // bind keyboard physical
    window.addEventListener("keydown", onPhysicalKey);

    // ---------- INIT ----------
    buildKeyboard();
    startGame();

})();
